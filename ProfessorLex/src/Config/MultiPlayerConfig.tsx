import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../Utils/firebase";
import Config from "./Config";
import { MultiMode } from "../Enums/MultiMode";

interface Props {
  gridSize: number;
  setGridSize: (val: number) => void;
  time: number;
  setTime: (val: number) => void;
  roomName: string;
  setRoomName: (val: string) => void;
  error: string;
  setError: (val: string) => void;
}

export default function MultiplayerConfig(props: Props) {
  const { gridSize, setGridSize, time, setTime, roomName, setRoomName } = props;
  const navigate = useNavigate();
  const [multiMode, setMultiMode] = useState<MultiMode>(MultiMode.Join);
  const [playerName, setPlayerName] = useState("");

  const [joinError, setJoinError] = useState("");
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (multiMode === MultiMode.Create) {
      if (!playerName.trim()) {
        setCreateError("Please enter your name");
      } else if (gridSize < 5 || gridSize > 10) {
        setCreateError("Grid size must be between 5 and 10");
      } else if (time < 30 || time > 300) {
        setCreateError("Time must be between 30 and 300 seconds");
      } else {
        setCreateError("");
      }
    }

    if (multiMode === MultiMode.Join) {
      if (!playerName.trim()) {
        setJoinError("Please enter your name");
      } else if (!roomName.trim()) {
        setJoinError("Please enter room ID to join");
      } else {
        setJoinError("");
      }
    }
  }, [playerName, roomName, gridSize, time, multiMode]);

  const handleCreateRoom = async () => {
    if (createError) return;

    try {
      const result = await createRoom(playerName, playerName);
      if (!result) {
        setCreateError("Failed to create room");
        return;
      }
      navigate(`/multiplayer/${result.roomId}`, {
        state: {
          playerId: result.playerId,
          playerName,
          isHost: true,
          gridSize,
          time,
        },
      });
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create room"
      );
    }
  };

  const handleJoinRoom = async () => {
    if (joinError) return;

    try {
      const playerId = await joinRoom(roomName, playerName);
      if (!playerId) {
        setJoinError("Failed to join room");
        return;
      }
      navigate(`/multiplayer/${roomName}`, {
        state: { playerId, playerName, isHost: false, gridSize, time },
      });
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join room");
    }
  };

  const getInputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-gray-800 border ${
      hasError ? "border-red-500" : "border-gray-600"
    } 
     rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 
     ${
       hasError ? "focus:ring-red-500" : "focus:ring-purple-500"
     } transition-all duration-200 text-lg`;

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setMultiMode(MultiMode.Join)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            multiMode === MultiMode.Join
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Join Room
        </button>
        <button
          onClick={() => setMultiMode(MultiMode.Create)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            multiMode === MultiMode.Create
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Create Room
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-white">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={getInputClass(
              (multiMode === MultiMode.Join && !!joinError) ||
                (multiMode === MultiMode.Create && !!createError && !playerName)
            )}
          />
          {multiMode === MultiMode.Join && joinError && !playerName && (
            <span className="text-red-500 text-sm">{joinError}</span>
          )}
          {multiMode === MultiMode.Create && createError && !playerName && (
            <span className="text-red-500 text-sm">{createError}</span>
          )}
        </div>

        {multiMode === MultiMode.Join && (
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-white">Room ID</label>
            <input
              type="text"
              placeholder="Enter room ID to join"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className={getInputClass(!!joinError && !roomName)}
            />
            {joinError && !roomName && (
              <span className="text-red-500 text-sm">{joinError}</span>
            )}
          </div>
        )}

        {multiMode === MultiMode.Create && (
          <Config
            gridSize={gridSize}
            setGridSize={setGridSize}
            time={time}
            setTime={setTime}
          />
        )}

        <button
          onClick={
            multiMode === MultiMode.Create ? handleCreateRoom : handleJoinRoom
          }
          className={`w-full py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
            ${
              multiMode === MultiMode.Create
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white focus:ring-indigo-500"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white focus:ring-purple-500"
            }`}
        >
          {multiMode === MultiMode.Create ? "Create Room" : "Join Room"}
        </button>
      </div>
    </div>
  );
}
