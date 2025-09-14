type FoundWordsProps = {
  words: string[];
};

import { useEffect, useRef } from "react";

export default function FoundWords({ words }: FoundWordsProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // Auto-scroll to bottom when new words are added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [words]);

  return (
    <div className="w-64 p-6 bg-slate-800 rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white">
          Found Words <span className="text-emerald-400">({words.length})</span>
        </h3>
      </div>
      <ul
        ref={listRef}
        className="h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {words.map((w) => (
          <li
            key={w}
            className="text-lg py-2 px-3 border-b border-gray-700 text-emerald-400 font-medium first:border-t"
          >
            {w.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}
