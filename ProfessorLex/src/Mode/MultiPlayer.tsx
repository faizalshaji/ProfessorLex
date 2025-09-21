import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import Game from "../Game/Game";
import type { Room } from "../Utils/firebase";
import {
  startGame,
  updatePlayerScore,
  updatePlayerName,
  joinRoom,
  leaveRoom,
} from "../Utils/firebase";
import { GameMode } from "../Enums/GameMode";
import { GameState } from "../Enums/GameState";
import NameModal from "../components/NameModal";
import {
  getRoomSession,
  getUserName,
  setRoomSession,
  setUserName,
  clearRoomSession,
} from "../Utils/storage";
// joinRoom imported above

function Multiplayer() {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const location = useLocation();
  const { gridSize, time, playerId, playerName, isHost } = location.state || {};
  const [room, setRoom] = useState<Room | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [needsName, setNeedsName] = useState(false);
  const [session, setSession] = useState<{
    playerId: string;
    playerName: string;
    isHost: boolean;
  } | null>(null);
  const [displayName, setDisplayName] = useState<string>(
    () => getUserName() || ""
  );
  const lastSyncedRef = useRef<string | null>(null);

  // Compute a players map that immediately reflects local name for self
  const playersForDisplay = useMemo(() => {
    if (!room?.players) return room?.players;
    if (!session?.playerId) return room.players;
    const localName = displayName || session.playerName || "";
    const me = room.players[session.playerId];
    if (!me) return room.players;
    if (me.name === localName || !localName) return room.players;
    return {
      ...room.players,
      [session.playerId]: { ...me, name: localName },
    };
  }, [room?.players, session?.playerId, session?.playerName, displayName]);

  useEffect(() => {
    if (!roomName) {
      navigate("/");
      return;
    }

    // Initialize session from navigation state or saved storage
    if (playerId && playerName) {
      const s = { playerId, playerName, isHost: !!isHost };
      setSession(s);
      // Prefer the locally saved username if it exists
      const local = getUserName();
      setDisplayName(local || playerName);
    } else {
      const stored = getRoomSession(roomName);
      if (stored) {
        const local = getUserName();
        const merged =
          local && local !== stored.playerName
            ? { ...stored, playerName: local }
            : stored;
        setSession(merged);
        setDisplayName(merged.playerName);
        if (merged !== stored) {
          setRoomSession(roomName, merged);
        }
      } else {
        setSession(null);
      }
    }

    // If no session and no saved name, prompt for one
    if (!playerId && !playerName && !getRoomSession(roomName)) {
      const fallbackName = getUserName();
      if (!fallbackName) {
        setNeedsName(true);
      } else {
        setNeedsName(false);
        setDisplayName(fallbackName);
      }
    } else {
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
  }, [roomName, navigate, playerId, playerName, isHost]);

  // If local username changes and differs from session, align them
  useEffect(() => {
    if (!roomName || !session) return;
    const local = getUserName();
    if (local && session.playerName !== local) {
      const updated = { ...session, playerName: local };
      setSession(updated);
      setDisplayName(local);
      setRoomSession(roomName, updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  // If game already started and the user is not in the room, suppress name modal
  useEffect(() => {
    if (room?.gameState === GameState.Playing && !session?.playerId) {
      setNeedsName(false);
    }
  }, [room?.gameState, session?.playerId]);

  // After room data loads, ensure Firebase player name matches local session name
  useEffect(() => {
    if (!roomName || !room || !session || !session.playerId) return;
    const p = room.players?.[session.playerId];
    if (!p) return;
    if (
      p.name !== session.playerName &&
      lastSyncedRef.current !== session.playerName
    ) {
      lastSyncedRef.current = session.playerName;
      updatePlayerName(roomName, session.playerId, session.playerName).catch(
        () => {
          // ignore sync failures
        }
      );
    }
  }, [room?.players, session?.playerId, session?.playerName, roomName]);

  if (!room) return <div>Loading...</div>;
  const activeId = session?.playerId;
  const activeHost = activeId
    ? !!room.players?.[activeId]?.isHost
    : !!session?.isHost;
  // We always render the page; joinLocked and needsName control UI states.

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

  const handleLeave = async () => {
    try {
      if (roomName && activeId) {
        await leaveRoom(roomName, activeId);
      }
    } catch {}
    if (roomName) clearRoomSession(roomName);
    navigate("/");
  };

  // (moved playersForDisplay useMemo above to avoid hook-order issues with early returns)

  // Only lock joins while actively Playing; allow joins when Waiting or Finished
  const joinLocked = room?.gameState === GameState.Playing && !activeId;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 items-center p-4 bg-[#0A2F2F]/90 backdrop-blur-md text-white">
        {/* Left: Home + Room */}
        <div className="flex items-center gap-2 justify-start">
          <button
            onClick={handleLeave}
            className="px-3 py-1 rounded bg-[#1F574A] hover:bg-[#286D5D] text-white text-sm"
            title="Go Home"
          >
            Home
          </button>
          <h2 className="text-xl font-bold">Room: {room.id}</h2>
        </div>
        {/* Center: Start button or status */}
        <div className="flex items-center justify-center">
          {activeHost && !gameStarted ? (
            <button
              onClick={handleStartGame}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
            >
              Start Game
            </button>
          ) : (
            <div />
          )}
        </div>
        {/* Right: Player name + settings (only after join) */}
        <div className="flex justify-end">
          {activeId && (
            <button
              className="flex items-center gap-2 px-3 py-1 rounded bg-[#2F6F5F] hover:bg-[#3A8A75] text-white text-sm"
              onClick={() => setNeedsName(true)}
              title="Edit your name"
            >
              <span>{displayName || session?.playerName || ""}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M11.49 3.17c-.38-1.15-2-.86-2 .36v.91a6.96 6.96 0 00-2.03.84l-.64-.64c-.9-.9-2.36.56-1.46 1.46l.64.64c-.35.63-.62 1.32-.79 2.04h-.91c-1.22 0-1.51 1.62-.36 2l.91.3c.06.71.25 1.4.54 2.03l-.64.64c-.9.9.56 2.36 1.46 1.46l.64-.64c.64.3 1.32.49 2.03.55l.3.91c.38 1.15 2 .86 2-.36v-.91c.71-.06 1.4-.25 2.03-.54l.64.64c.9.9 2.36-.56 1.46-1.46l-.64-.64c.3-.64.49-1.32.55-2.03l.91-.3c1.15-.38.86-2-.36-2h-.91a6.96 6.96 0 00-.84-2.03l.64-.64c.9-.9-.56-2.36-1.46-1.46l-.64.64a6.96 6.96 0 00-2.03-.84v-.91zM10 13a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {joinLocked ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-[#0A2F2F]/90 backdrop-blur-md rounded-3xl p-8 border border-[#2F6F5F]/30 text-center text-white max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-3">
                Game Already Started
              </h2>
              <p className="text-[#2F6F5F] mb-6">
                You can’t join this room right now because the game is in
                progress.
              </p>
              <button
                onClick={handleLeave}
                className="px-4 py-2 rounded-lg bg-[#2F6F5F] hover:bg-[#3A8A75] text-white"
              >
                Go Home
              </button>
            </div>
          </div>
        ) : (
          /* Game Board */
          <div className="flex-1">
            <Game
              mode={GameMode.MultiPlayer}
              gridSize={gridSize ?? room.gridSize ?? 5}
              time={time ?? room.gameDuration ?? 60}
              gameStarted={gameStarted}
              roomId={roomName}
              playerId={activeId}
              isHost={activeHost}
              players={playersForDisplay || room.players}
              onStartGame={handleStartGame}
              isWaiting={room.gameState === GameState.Waiting}
              onGameOver={async () => {
                // Mark the game as finished to unlock joins and show results
                if (roomName) {
                  try {
                    const { endGame } = await import("../Utils/firebase");
                    await endGame(roomName);
                  } catch {}
                }
              }}
              onUpdateScore={(words) => {
                const score = words.reduce((total, word) => {
                  const wordLength = word.length;
                  const baseScore = wordLength * 10;
                  const extraLetters = Math.max(0, wordLength - 3);
                  const bonus =
                    extraLetters > 0 ? Math.pow(1.5, extraLetters - 1) * 20 : 0;
                  return total + Math.floor(baseScore + bonus);
                }, 0);
                if (activeId && roomName)
                  updatePlayerScore(roomName, activeId, score, words);
              }}
            />
          </div>
        )}
      </div>

      {/* Name prompt for direct link join */}
      <NameModal
        isOpen={needsName && !joinLocked}
        initialName={displayName || session?.playerName || ""}
        title="Your Name"
        confirmText={session ? "OK" : "Join"}
        onConfirm={async (name) => {
          if (!roomName) return;
          try {
            if (joinLocked) return;
            if (session) {
              // Update locally and remotely
              setDisplayName(name);
              const updated = { ...session, playerName: name };
              setSession(updated);
              setUserName(name);
              setRoomSession(roomName, updated);
              await updatePlayerName(roomName, session.playerId, name);
              setNeedsName(false);
              return;
            }
            // Join flow
            const newId = await joinRoom(roomName, name);
            const newSession = {
              playerId: newId,
              playerName: name,
              isHost: false,
            };
            setSession(newSession);
            setDisplayName(name);
            setUserName(name);
            setRoomSession(roomName, newSession);
            setNeedsName(false);
          } catch {
            // keep modal open
          }
        }}
      />
    </div>
  );
}

export default Multiplayer;
