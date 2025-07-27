import { useEffect, useRef, useState } from "react";
import Trie from "trie-prefix-tree";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ArrowUpLeftIcon,
  ArrowDownRightIcon,
  ArrowDownLeftIcon,
} from "@heroicons/react/24/solid";

type Cell = { letter: string; row: number; col: number };

const GRID_SIZE = 10;

function Game() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [trace, setTrace] = useState<Cell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(120);
  const [trie, setTrie] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTrie().then((t) => {
      setTrie(t);
      initGrid();
      const timer = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
      return () => clearInterval(timer);
    });
  }, []);

  async function loadTrie(): Promise<any> {
    const words = await loadWords();
    return Trie(words);
  }

  async function loadWords() {
    const res = await fetch("/ProfessorLex/wordlist.txt");
    const words = (await res.text())
      .split("\n")
      .map((w) => w.trim())
      .filter(Boolean);
    return words;
  }

  function initGrid() {
    const letters = Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    );
    const cells: Cell[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      cells.push([]);
      for (let c = 0; c < GRID_SIZE; c++) {
        cells[r].push({ letter: letters.pop()!, row: r, col: c });
      }
    }
    setGrid(cells);
  }

  function onMouseDown(cell: Cell) {
    setTrace([cell]);
  }

  function onMouseEnter(cell: Cell) {
    if (!trace.length) return;
    const alreadyTraced = trace.some(
      (c) => c.row === cell.row && c.col === cell.col
    );
    if (!alreadyTraced) {
      const newTrace = [...trace, cell];
      const prefix = newTrace.map((c) => c.letter).join("");
      // Optionally skip prefix check to allow full freedom
      setTrace(newTrace);
    }
  }

  function onMouseUp() {
    if (!trace.length || !trie) {
      setTrace([]);
      return;
    }
    const word = trace.map((c) => c.letter).join("");
    if (word.length > 2 && trie.hasWord(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore((s) => s + word.length);
    }
    setTrace([]);
  }

  function getCellCenter(cell: Cell) {
    const cellSize = 48; // w-12 / h-12
    const offset = containerRef.current?.getBoundingClientRect();
    return {
      x: cell.col * cellSize + cellSize / 2,
      y: cell.row * cellSize + cellSize / 2,
    };
  }

  function getDirection(from: Cell, to: Cell) {
    const dr = to.row - from.row;
    const dc = to.col - from.col;
    if (dr === -1 && dc === 0)
      return <ArrowUpIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === 1 && dc === 0)
      return <ArrowDownIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === 0 && dc === -1)
      return <ArrowLeftIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === 0 && dc === 1)
      return <ArrowRightIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === -1 && dc === 1)
      return <ArrowUpRightIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === -1 && dc === -1)
      return <ArrowUpLeftIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === 1 && dc === 1)
      return <ArrowDownRightIcon className="w-4 h-4 text-yellow-500" />;
    if (dr === 1 && dc === -1)
      return <ArrowDownLeftIcon className="w-4 h-4 text-yellow-500" />;
    return null;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-6 text-center select-none"
      onMouseUp={onMouseUp}
    >
      <h1 className="text-4xl font-extrabold mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Professor Lex
      </h1>

      <div className="flex justify-center gap-10 text-lg mb-6 font-medium text-gray-300">
        <p>
          ⏱️ Time: <span className="text-white font-bold">{time}s</span>
        </p>
        <p>
          ⭐ Score: <span className="text-white font-bold">{score}</span>
        </p>
      </div>

      {/* Grid with arrows */}
      <div className="relative inline-block" ref={containerRef}>
        {/* Arrows using SVG */}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={GRID_SIZE * 48}
          height={GRID_SIZE * 48}
        >
          {trace.length > 1 &&
            trace.map((cell, i) => {
              const next = trace[i + 1];
              if (!next) return null;
              const start = getCellCenter(cell);
              const end = getCellCenter(next);
              return (
                <line
                  key={i}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="yellow"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="yellow" />
            </marker>
          </defs>
        </svg>

        {/* Grid Cells */}
        <div
          className={`grid gap-1 bg-white border-4 border-gray-200 shadow-md ${
            {
              4: "grid-cols-4 grid-rows-4",
              5: "grid-cols-5 grid-rows-5",
              6: "grid-cols-6 grid-rows-6",
              7: "grid-cols-7 grid-rows-7",
              8: "grid-cols-8 grid-rows-8",
              9: "grid-cols-9 grid-rows-9",
              10: "grid-cols-10 grid-rows-10",
            }[GRID_SIZE] || "grid-cols-4 grid-rows-4"
          }`}
        >
          {grid.flat().map((c) => {
            const tracing = trace.some(
              (t) => t.row === c.row && t.col === c.col
            );
            const currentIdx = trace.findIndex(
              (t) => t.row === c.row && t.col === c.col
            );
            const prevCell = currentIdx > 0 ? trace[currentIdx - 1] : null;

            return (
              <div
                key={`${c.row}-${c.col}`}
                className={`relative w-12 h-12 border border-gray-300 text-lg font-bold flex items-center justify-center cursor-pointer transition ${
                  tracing
                    ? "bg-yellow-400 text-black scale-105"
                    : "bg-white text-gray-800"
                }`}
                onMouseDown={() => onMouseDown(c)}
                onMouseEnter={() => onMouseEnter(c)}
              >
                {c.letter.toUpperCase()}
                {prevCell && (
                  <div className="absolute -bottom-2 right-0 p-0.5">
                    {getDirection(prevCell, c)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Found Words */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-pink-400">
          Found Words ({foundWords.length})
        </h3>
        <ul className="mt-2 space-y-1 text-gray-100">
          {foundWords.map((w) => (
            <li key={w} className="text-sm">
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Game Over */}
      {time === 0 && (
        <div className="mt-8 text-red-400 text-xl font-bold">
          <h2>Game Over!</h2>
          <p className="mt-1 text-white">Your score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
