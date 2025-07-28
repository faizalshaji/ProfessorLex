import { useState } from "react";
import Popup from "./Popup";
import SinglePlayerConfig from "./Config/SinglePlayerConfig";
import MultiplayerConfig from "./Config/MultiPlayerConfig";

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [mode, setMode] = useState<"single" | "multi">("single");

  const [gridSize, setGridSize] = useState<number>(3);
  const [time, setTime] = useState<number>(30);

  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg mb-12 text-center">
        Professor Lex
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button
          onClick={() => {
            setMode("single");
            setShowPopup(true);
          }}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 transition duration-200 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105"
        >
          Single Player
        </button>

        <button
          onClick={() => {
            setMode("multi");
            setShowPopup(true);
          }}
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
        title={mode === "single" ? "Single Player" : "Multiplayer"}
      >
        <div className="space-y-6 text-gray-100">
          {mode === "single" ? (
            <SinglePlayerConfig
              gridSize={gridSize}
              setGridSize={setGridSize}
              time={time}
              setTime={setTime}
            />
          ) : (
            <MultiplayerConfig
              gridSize={gridSize}
              setGridSize={setGridSize}
              time={time}
              setTime={setTime}
              roomName={roomName}
              setRoomName={setRoomName}
              error={error}
              setError={setError}
            />
          )}
        </div>
      </Popup>
    </div>
  );
}

export default Home;
