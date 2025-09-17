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
    <div className="h-full flex flex-col">
      <div className="mb-2">
        <span className="text-emerald-400 text-sm font-medium">
          Found Words ({words.length})
        </span>
      </div>
      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {words.map((w) => (
          <li
            key={w}
            className="text-sm py-1 px-2 rounded bg-gray-700/50 text-emerald-400 font-medium"
          >
            {w.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}
