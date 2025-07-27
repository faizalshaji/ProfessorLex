import { useEffect, useState } from "react";
import Trie from "trie-prefix-tree";

type Cell = { letter: string; row: number; col: number };

function Game() {
  const GRID_SIZE = 10;
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [trace, setTrace] = useState<Cell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(120);
  const [trie, setTrie] = useState<any>(null);

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

  async function loadWords() {
    const res = await fetch("/ProfessorLex/wordlist.txt");
    const words = (await res.text())
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w);
    return words;
  }

  function onMouseDown(cell: Cell) {
    setTrace([cell]);
  }

  function onMouseEnter(cell: Cell) {
    if (!trace.length) return;
    const last = trace[trace.length - 1];
    const dr = Math.abs(cell.row - last.row);
    const dc = Math.abs(cell.col - last.col);
    if (
      dr <= 1 &&
      dc <= 1 &&
      !trace.some((c) => c.row === cell.row && c.col === cell.col)
    ) {
      const newTrace = [...trace, cell];
      const prefix = newTrace.map((c) => c.letter).join("");
      if (trie?.isPrefix(prefix)) {
        setTrace(newTrace);
      }
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

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 text-center select-none"
      onMouseUp={onMouseUp}
    >
      <h1 className="text-3xl font-bold mb-4">Professor Lex</h1>

      <div className="flex justify-center gap-10 text-lg mb-4 font-medium text-gray-700">
        <p>Time: {time}s</p>
        <p>Score: {score}</p>
      </div>

      <div className="inline-block border-2 border-white bg-white shadow-md p-1">
        {grid.map((row, ri) => (
          <div key={ri} className="flex">
            {row.map((c) => {
              const tracing = trace.some(
                (t) => t.row === c.row && t.col === c.col
              );
              return (
                <div
                  key={`${c.row}-${c.col}`}
                  className={`w-12 h-12 border text-lg font-semibold flex items-center justify-center cursor-pointer ${
                    tracing ? "bg-yellow-300" : "bg-white"
                  }`}
                  onMouseDown={() => onMouseDown(c)}
                  onMouseEnter={() => onMouseEnter(c)}
                >
                  {c.letter.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">
          Found Words ({foundWords.length})
        </h3>
        <ul className="mt-2 list-disc list-inside text-gray-700">
          {foundWords.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>

      {time === 0 && (
        <div className="mt-6 text-red-600 text-xl font-bold">
          <h2>Game Over!</h2>
          <p className="mt-1">Your score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
