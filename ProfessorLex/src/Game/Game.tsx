import { useState } from "react";
import Board from "./Board/Board";
import FoundWords from "./FoundWords/FoundWords";

interface GameProps {
  gridSize?: number;
  time?: number;
}

export default function Game({ gridSize, time }: GameProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);

  return (
    <div className="flex h-screen w-screen">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xl font-bold"></span>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex items-center justify-center">
        <Board
          onWordsChange={setFoundWords}
          gridSize={gridSize}
          initialTime={time}
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center">
        <FoundWords words={foundWords} />
      </div>
    </div>
  );
}
