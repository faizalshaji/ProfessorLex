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
        <button
          className="flex items-center gap-2 px-3 py-1 rounded bg-[#2F6F5F] hover:bg-[#3A8A75] text-white text-sm"
          onClick={() => setNeedsName(true)}
          title="Edit your name"
        >
          <span>{activeName}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M11.49 3.17c-.38-1.15-2-.86-2 .36v.91a6.96 6.96 0 00-2.03.84l-.64-.64c-.9-.9-2.36.56-1.46 1.46l.64.64c-.35.63-.62 1.32-.79 2.04h-.91c-1.22 0-1.51 1.62-.36 2l.91.3c.06.71.25 1.4.54 2.03l-.64.64c-.9.9.56 2.36 1.46 1.46l.64-.64c.64.3 1.32.49 2.03.55l.3.91c.38 1.15 2 .86 2-.36v-.91c.71-.06 1.4-.25 2.03-.54l.64.64c.9.9 2.36-.56 1.46-1.46l-.64-.64c.3-.64.49-1.32.55-2.03l.91-.3c1.15-.38.86-2-.36-2h-.91a6.96 6.96 0 00-.84-2.03l.64-.64c.9-.9-.56-2.36-1.46-1.46l-.64.64a6.96 6.96 0 00-2.03-.84v-.91zM10 13a3 3 0 110-6 3 3 0 010 6z" />
          </svg>
        </button>
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
        initialName={getUserName() ?? activeName ?? ""}
        title="Your Name"
        confirmText={effective ? "OK" : "Join"}
        onConfirm={async (name) => {
          if (!roomName) return;
          try {
            // If already joined (effective exists), just update stored name and Firebase
            if (effective) {
              setUserName(name);
              setRoomSession(roomName, {
                playerId: effective.playerId,
                playerName: name,
                isHost: effective.isHost,
              });
              // Best-effort update to Firebase
              // Avoid import cycle by lazy import
              const { updatePlayerName } = await import("../Utils/firebase");
              await updatePlayerName(roomName, effective.playerId, name);
              setNeedsName(false);
              return;
            }

            // Otherwise, join the room now
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
