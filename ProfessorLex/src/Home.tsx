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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start px-4 text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/ProfessorLex/images/home.png"
        alt="Professor Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      {/* Mode Buttons Panel */}
      <div className="relative z-10 w-full max-w-md mt-[60vh]">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Choose Your Mode
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                setMode("single");
                setShowPopup(true);
              }}
              className="w-full flex items-center gap-3 justify-center py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-lg hover:shadow-purple-500/25 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Single Player
            </button>

            <button
              onClick={() => {
                setMode("multi");
                setShowPopup(true);
              }}
              className="w-full flex items-center gap-3 justify-center py-4 px-6 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 rounded-xl shadow-lg hover:shadow-pink-500/25 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Multiplayer
            </button>
          </div>

          <p className="mt-6 text-sm text-center text-gray-400">
            Challenge yourself or compete with friends!
          </p>
        </div>
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
