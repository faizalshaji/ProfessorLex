import { useState } from "react";
import Board from "./Board/Board";
import FoundWords from "./FoundWords/FoundWords";

export default function Game() {
  const [foundWords, setFoundWords] = useState<string[]>([]);

  return (
    <div className="flex h-screen w-screen">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xl font-bold"></span>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex items-center justify-center">
        <Board onWordsChange={setFoundWords} />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center">
        <FoundWords words={foundWords} />
      </div>
    </div>
  );
}
