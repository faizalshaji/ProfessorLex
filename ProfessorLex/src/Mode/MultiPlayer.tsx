import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import Game from "../Game/Game";
import type { Room } from "../Utils/firebase";
import { startGame, updatePlayerScore } from "../Utils/firebase";
import { GameMode } from "../Enums/GameMode";
import { GameState } from "../Enums/GameState";
import NameModal from "../components/NameModal";
import {
  getRoomSession,
  getUserName,
  setRoomSession,
  setUserName,
} from "../Utils/storage";
import { joinRoom } from "../Utils/firebase";

function Multiplayer() {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const location = useLocation();
  const { gridSize, time, playerId, playerName, isHost } = location.state || {};
  const [room, setRoom] = useState<Room | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [needsName, setNeedsName] = useState(false);

  // Derive effective session from navigation state or localStorage
  const effective = useMemo(() => {
    if (!roomName) return null;
    if (playerId && playerName) {
      return { playerId, playerName, isHost: !!isHost };
    }
    const stored = getRoomSession(roomName);
    if (stored) return stored;
    return null;
  }, [roomName, playerId, playerName, isHost]);

  useEffect(() => {
    if (!roomName) {
      navigate("/");
      return;
    }

    // If we have no effective session, prompt for name and attempt auto-join
    if (!effective) {
      const fallbackName = getUserName();
      if (!fallbackName) {
        setNeedsName(true);
        return;
      }
      setNeedsName(false);
    }

    const db = getDatabase();
    const roomRef = ref(db, `rooms/${roomName}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val() as Room;
      if (data) {
        setRoom(data);
        setGameStarted(data.gameState === GameState.Playing);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [roomName, navigate, effective]);

  if (!room) return <div>Loading...</div>;
  const activeId = effective?.playerId;
  const activeName = effective?.playerName;
  const activeHost = !!effective?.isHost;
  if (!roomName || !activeId || !activeName)
    return <div>Invalid game session</div>;

  const handleStartGame = async () => {
    if (!roomName || !gridSize) return;
    const grid = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      );
    await startGame(roomName, grid);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4  bg-[#0A2F2F]/90 backdrop-blur-md text-white">
        <h2 className="text-xl font-bold">Room: {room.id}</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">You: {activeName}</div>
          <button
            className="px-3 py-1 rounded bg-[#2F6F5F] hover:bg-[#3A8A75] text-white text-sm"
            onClick={() => setNeedsName(true)}
          >
            Change name
          </button>
        </div>
        {activeHost && !gameStarted && (
          <button
            onClick={handleStartGame}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Start Game
          </button>
        )}
        {!activeHost && !gameStarted && (
          <div className="text-sm text-gray-400">
            Waiting for host to start...
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Game Board */}
        <div className="flex-1">
          <Game
            mode={GameMode.MultiPlayer}
            gridSize={gridSize ?? room.gridSize ?? 5}
            time={time ?? room.gameDuration ?? 60}
            gameStarted={gameStarted}
            roomId={roomName}
            playerId={activeId}
            isHost={activeHost}
            players={room.players}
            onStartGame={handleStartGame}
            onUpdateScore={(words) => {
              const score = words.reduce((total, word) => {
                const wordLength = word.length;
                const baseScore = wordLength * 10;
                const extraLetters = Math.max(0, wordLength - 3);
                const bonus =
                  extraLetters > 0 ? Math.pow(1.5, extraLetters - 1) * 20 : 0;
                return total + Math.floor(baseScore + bonus);
              }, 0);
              if (activeId) updatePlayerScore(roomName, activeId, score, words);
            }}
          />
        </div>
      </div>

      {/* Name prompt for direct link join */}
      <NameModal
        isOpen={needsName}
        initialName={getUserName() ?? ""}
        title="Enter your name to join"
        confirmText="Join"
        onConfirm={async (name) => {
          if (!roomName) return;
          try {
            const newId = await joinRoom(roomName, name);
            setUserName(name);
            setRoomSession(roomName, {
              playerId: newId,
              playerName: name,
              isHost: false,
            });
            setNeedsName(false);
          } catch (e) {
            // Stay on modal; in a real app we would show error.
          }
        }}
      />
    </div>
  );
}

export default Multiplayer;
