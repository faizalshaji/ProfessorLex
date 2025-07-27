import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup/Popup";
import Configuration from "../Configuration/Configuration";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Professor Lex</h1>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Single Player
        </button>
        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Multi Player
        </button>
      </div>

      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Game Settings"
      >
        <div className="space-y-6">
          <Configuration
            gridSize={gridSize}
            setGridSize={setGridSize}
            time={time}
            setTime={setTime}
          />

          <div className="flex gap-4">
            <button
              onClick={handleStart}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start Game
            </button>
            <button
              onClick={createRoom}
              className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Create Room
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleJoinRoom}
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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
