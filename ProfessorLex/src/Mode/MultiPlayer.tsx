import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../utils/firebase";

export default function MultiPlayer() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      if (!playerName.trim()) {
        setError("Please enter your name");
        return;
      }

      let roomId: string;
      let playerId: string;

      if (mode === "create") {
        const result = await createRoom(playerName, playerName);
        roomId = result.roomId;
        playerId = result.playerId;
      } else {
        if (!roomName.trim()) {
          setError("Please enter a room name to join");
          return;
        }
        playerId = await joinRoom(roomName, playerName);
        roomId = roomName;
      }

      // Navigate to game with needed state
      navigate(`/multiplayer/${roomId}`, {
        state: { playerId, playerName, gridSize: 5, time: 60 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {mode === "create" ? "Create Room" : "Join Room"}
          </h2>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-3 text-sm font-medium ${
              mode === "create"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setMode("join")}
            className={`flex-1 py-3 text-sm font-medium ${
              mode === "join"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Join Room
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleJoinRoom} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                required
              />
            </div>

            {mode === "join" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  required={mode === "join"}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 font-medium"
          >
            {mode === "create" ? "Create & Join Room" : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
