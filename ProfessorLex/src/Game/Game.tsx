import { useState } from "react";
import Board from "./Board/Board";
import FoundWords from "./FoundWords/FoundWords";

interface GameProps {
  gridSize?: number;
  time?: number;
  gameStarted: boolean;
  roomId: string;
  playerId: string;
  onUpdateScore?: (words: string[]) => void;
}

export default function Game({
  gridSize,
  time,
  gameStarted,
  roomId,
  playerId,
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
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-3xl mb-4">🎲</div>
          <h2 className="text-xl font-semibold mb-2">Game Not Started</h2>
          <p>Waiting for the room owner to start the game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Center Section - Game Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <Board
            onWordsChange={handleWordsChange}
            gridSize={gridSize}
            initialTime={time}
            gameStarted={gameStarted}
          />

          {/* Found Words Section */}
          <div className="mt-8">
            <FoundWords words={foundWords} />
          </div>
        </div>
      </div>
    </div>
  );
}
