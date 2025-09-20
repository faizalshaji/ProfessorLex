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
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0A2F2F]/80 via-transparent to-[#0A2F2F]/80 flex flex-col items-center justify-start px-4 text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/ProfessorLex/images/home.jpg"
        alt="Professor Background"
        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
      />

      {/* Title */}
      <div className="relative z-10 text-center mt-[15vh] space-y-6">
        <h1 className="text-8xl font-bold text-white animate-fade-in drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
          Professor Lex
        </h1>
        <div className="flex flex-col items-center space-y-2 animate-fade-in-delay">
          <p className="text-3xl font-light tracking-wide text-white/95 drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
            Sharpen your vocabulary, one word at a time
          </p>
        </div>
      </div>

      {/* Mode Buttons Panel */}
      <div className="relative z-10 w-full max-w-md mt-16">
        <div className="bg-[#0A2F2F]/90 backdrop-blur-md rounded-3xl p-8 border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)] hover:shadow-[0_0_50px_rgba(47,111,95,0.2)] transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-center mb-10 text-white tracking-wide">
            Choose Your Mode
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                setMode("single");
                setShowPopup(true);
              }}
              className="w-full flex items-center gap-3 justify-center py-5 px-6 bg-[#2F6F5F] hover:bg-[#3A8A75] backdrop-blur-sm rounded-xl shadow-lg shadow-[#1A472F]/20 hover:shadow-[#2F6F5F]/40 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="w-full flex items-center gap-3 justify-center py-5 px-6 bg-[#1F574A] hover:bg-[#286D5D] backdrop-blur-sm rounded-xl shadow-lg shadow-[#1A472F]/20 hover:shadow-[#2F6F5F]/40 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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

          <p className="mt-8 text-sm text-center text-[#7FBFAB] tracking-wide">
            Challenge yourself or compete with friends
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
