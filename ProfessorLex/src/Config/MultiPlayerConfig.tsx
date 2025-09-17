import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../utils/firebase";
import Config from "./Config";

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
  const {
    gridSize,
    setGridSize,
    time,
    setTime,
    roomName,
    setRoomName,
    error,
    setError,
  } = props;
  const navigate = useNavigate();
  const [multiMode, setMultiMode] = useState<"join" | "create">("create");
  const [playerName, setPlayerName] = useState("");

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (gridSize < 1 || time < 1) {
      setError("Please enter valid values for grid size and time");
      return;
    }

    try {
      const result = await createRoom(playerName, playerName);
      if (!result) {
        setError("Failed to create room");
        return;
      }
      navigate(`/multiplayer/${result.roomId}`, {
        state: {
          playerId: result.playerId,
          playerName: playerName,
          isHost: true,
          gridSize,
          time,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomName.trim()) {
      setError("Please enter room ID to join");
      return;
    }

    try {
      const playerId = await joinRoom(roomName, playerName);
      if (!playerId) {
        setError("Failed to join room");
        return;
      }
      navigate(`/multiplayer/${roomName}`, {
        state: {
          playerId,
          playerName,
          isHost: false,
          gridSize,
          time,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switch Buttons */}
      <div className="flex bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setMultiMode("join")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            multiMode === "join"
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Join Room
        </button>
        <button
          onClick={() => setMultiMode("create")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            multiMode === "create"
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Create Room
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-all duration-200"
          />
        </div>

        {multiMode === "join" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter room ID to join"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200"
            />
          </div>
        )}

        {error && (
          <p className="mt-2 text-red-400 text-sm bg-red-900/20 p-2 rounded">
            {error}
          </p>
        )}

        {multiMode === "create" && (
          <Config
            gridSize={gridSize}
            setGridSize={setGridSize}
            time={time}
            setTime={setTime}
          />
        )}

        <button
          onClick={multiMode === "create" ? handleCreateRoom : handleJoinRoom}
          className={`w-full py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
            ${
              multiMode === "create"
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white focus:ring-indigo-500"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white focus:ring-purple-500"
            }`}
        >
          {multiMode === "create" ? "Create Room" : "Join Room"}
        </button>
      </div>
    </div>
  );
}
