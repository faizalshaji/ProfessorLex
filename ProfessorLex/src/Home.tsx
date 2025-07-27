import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import Configuration from "./Configuration";

function Home() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  const [gridSize, setGridSize] = useState<number>(3);
  const [time, setTime] = useState<number>(30);

  const handleStart = () => {
    if (gridSize < 1 || time < 1) {
      alert("Please enter valid values");
      return;
    }
    console.log("Start game with gridSize:", gridSize, "and time:", time);
  };

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/multiplayer/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }
    navigate(`/multiplayer/${roomName}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg mb-12 text-center">
        Professor Lex
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button
          onClick={() => setShowPopup(true)}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 transition duration-200 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105"
        >
          Single Player
        </button>
        <button
          onClick={() => setShowPopup(true)}
          className="w-full py-3 bg-green-500 hover:bg-green-600 transition duration-200 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105"
        >
          Multiplayer
        </button>
      </div>

      <Popup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          setError("");
        }}
        title="Game Settings"
      >
        <div className="space-y-6 text-gray-100">
          <Configuration
            gridSize={gridSize}
            setGridSize={setGridSize}
            time={time}
            setTime={setTime}
          />

          <div className="flex gap-4">
            <button
              onClick={handleStart}
              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg shadow transform hover:scale-105"
            >
              Start Game
            </button>
            <button
              onClick={createRoom}
              className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow transform hover:scale-105"
            >
              Create Room
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleJoinRoom}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg shadow transform hover:scale-105"
            >
              Join Room
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default Home;
