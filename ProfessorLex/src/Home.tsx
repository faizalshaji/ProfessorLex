import { useState } from "react";
import Popup from "./Popup";
import SinglePlayerConfig from "./Config/SinglePlayerConfig";
import MultiplayerConfig from "./Config/MultiPlayerConfig";

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [mode, setMode] = useState<"single" | "multi">("single");

  const [gridSize, setGridSize] = useState<number>(5);
  const [time, setTime] = useState<number>(60);

  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/ProfessorLex/images/home.png"
        alt="Professor Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      {/* Mode Buttons */}
      <div className="flex flex-col gap-6 w-full max-w-sm z-10">
        <button
          onClick={() => {
            setMode("single");
            setShowPopup(true);
          }}
          className="flex items-center gap-3 justify-center py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-xl hover:shadow-2xl text-lg font-semibold transition transform hover:scale-105"
        >
          Single Player
        </button>

        <button
          onClick={() => {
            setMode("multi");
            setShowPopup(true);
          }}
          className="flex items-center gap-3 justify-center py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-xl hover:shadow-2xl text-lg font-semibold transition transform hover:scale-105"
        >
          Multiplayer
        </button>
      </div>

      {/* Config Popup */}
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
