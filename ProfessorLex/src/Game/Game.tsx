import { useState } from "react";
import Board from "./Board/Board";
import FoundWords from "./FoundWords/FoundWords";
import { GameMode } from "../Enums/GameMode";

interface GameProps {
  mode: GameMode;
  gridSize?: number;
  time?: number;
  gameStarted?: boolean;
  roomId?: string;
  playerId?: string;
  onUpdateScore?: (words: string[]) => void;
}

export default function Game({
  mode,
  gridSize,
  time,
  gameStarted = mode === GameMode.SinglePlayer,
  onUpdateScore,
}: GameProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);

  const handleWordsChange = (words: string[]) => {
    setFoundWords(words);
    if (onUpdateScore) {
      onUpdateScore(words);
    }
  };

  if (!gameStarted) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Background Image */}
        <img
          src="/ProfessorLex/images/home.jpg"
          alt="Game Background"
          className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 bg-[#0A2F2F]/90 backdrop-blur-md rounded-3xl p-8 border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)] text-center">
          <div className="text-4xl mb-4">🎲</div>
          <h2 className="text-2xl font-semibold mb-3 text-white">
            Game Not Started
          </h2>
          {mode === GameMode.MultiPlayer ? (
            <p className="text-[#2F6F5F] text-lg">
              Waiting for the room owner to start the game...
            </p>
          ) : (
            <p className="text-[#2F6F5F] text-lg">Starting game...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full">
      {/* Background Image */}
      <img
        src="/ProfessorLex/images/home.jpg"
        alt="Game Background"
        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
      />

      {/* Game Container */}
      <div className="relative z-10 flex w-full h-full bg-gradient-to-b from-[#0A2F2F]/80 via-transparent to-[#0A2F2F]/80">
        {/* Center Section - Game Board */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-[#0A2F2F]/90 backdrop-blur-md rounded-3xl p-8 border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)]">
            <Board
              onWordsChange={handleWordsChange}
              gridSize={gridSize}
              initialTime={time}
              gameStarted={gameStarted}
            />
          </div>
        </div>

        {/* Right Section - Found Words */}
        <div className="w-72 p-6 bg-[#0A2F2F]/90 backdrop-blur-md border-l border-[#2F6F5F]/30 overflow-y-auto flex-none">
          <h3 className="text-xl font-semibold mb-4 text-white tracking-wide">
            Found Words
          </h3>
          <FoundWords words={foundWords} />
        </div>
      </div>
    </div>
  );
}
