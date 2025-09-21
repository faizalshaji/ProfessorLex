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

  const hasWords = words.length > 0;

  return (
    <div
      className={`flex flex-col gap-2 h-full ${
        hasWords ? "" : "justify-center"
      }`}
    >
      {hasWords ? (
        <ul
          ref={listRef}
          className="flex flex-col gap-2 pr-2 pb-4 scrollbar-thin scrollbar-thumb-[#2F6F5F] scrollbar-track-transparent"
        >
          {words.map((w) => (
            <li
              key={w}
              className="text-sm py-2 px-3 rounded-lg bg-[#2F6F5F]/20 text-[#3A8A75] font-medium border border-[#2F6F5F]/20 hover:bg-[#2F6F5F]/30 transition-colors duration-200"
            >
              {w.toUpperCase()}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-[#2F6F5F]/60">
          No words found yet.
          <br />
          Start finding words!
        </div>
      )}
    </div>
  );
}
