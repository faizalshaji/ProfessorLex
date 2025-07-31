import { useEffect, useRef, useState } from "react";
import Trie from "trie-prefix-tree";
import Cell from "./Cell";

type CellType = { letter: string; row: number; col: number };

const GRID_SIZE = 10;
const CELL_SIZE = 48;

function Board() {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [trace, setTrace] = useState<CellType[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(120);
  const [trie, setTrie] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadTrie().then((t) => {
      setTrie(t);
      initGrid();
    });
    const timer = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    drawArrows(trace);
  }, [trace]);

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
    const cells: CellType[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      cells.push([]);
      for (let c = 0; c < GRID_SIZE; c++) {
        cells[r].push({ letter: letters.pop()!, row: r, col: c });
      }
    }
    setGrid(cells);
  }

  function isAdjacent(a: CellType, b: CellType) {
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    return dr <= 1 && dc <= 1 && dr + dc > 0;
  }

  function onMouseEnter(cell: CellType) {
    if (!trace.length) return;

    const last = trace[trace.length - 1];
    const idxInTrace = trace.findIndex(
      (c) => c.row === cell.row && c.col === cell.col
    );

    if (idxInTrace !== -1 && idxInTrace < trace.length - 1) {
      setTrace(trace.slice(0, idxInTrace + 1));
      return;
    }

    const alreadyTraced = idxInTrace !== -1;
    if (!alreadyTraced && isAdjacent(last, cell)) {
      setTrace([...trace, cell]);
    }
  }

  function onMouseDown(cell: CellType) {
    setTrace([cell]);
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

  function drawArrows(trace: CellType[]) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous arrows
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ff4081";
    ctx.fillStyle = "#ff4081";
    ctx.lineWidth = 2;

    // Gap between cells is 8px (gap-2 in Tailwind)
    const GAP = 8;
    const TOTAL_CELL_SIZE = CELL_SIZE + GAP;

    for (let i = 0; i < trace.length - 1; i++) {
      const from = trace[i];
      const to = trace[i + 1];

      // Calculate center positions including gaps
      const x1 = from.col * TOTAL_CELL_SIZE + CELL_SIZE / 2;
      const y1 = from.row * TOTAL_CELL_SIZE + CELL_SIZE / 2;
      const x2 = to.col * TOTAL_CELL_SIZE + CELL_SIZE / 2;
      const y2 = to.row * TOTAL_CELL_SIZE + CELL_SIZE / 2;

      // Calculate angle and distances
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headlen = 8;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw arrowhead
      const arrowX = x2 - headlen * Math.cos(angle);
      const arrowY = y2 - headlen * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        arrowX - headlen * Math.cos(angle - Math.PI / 6),
        arrowY - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - headlen * Math.cos(angle + Math.PI / 6),
        arrowY - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-6 text-center select-none"
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

      <div className="relative inline-block">
        {/* Canvas over the grid */}
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * (CELL_SIZE + 8) - 8}
          height={GRID_SIZE * (CELL_SIZE + 8) - 8}
          className="absolute left-0 top-0 z-10 pointer-events-none"
        />
        {/* Grid cells */}
        <div
          className={`grid gap-2 z-0 relative ${
            {
              4: "grid-cols-4",
              5: "grid-cols-5",
              6: "grid-cols-6",
              7: "grid-cols-7",
              8: "grid-cols-8",
              9: "grid-cols-9",
              10: "grid-cols-10",
            }[GRID_SIZE]
          }`}
        >
          {grid.flat().map((cell) => {
            const isTracing = trace.some(
              (t) => t.row === cell.row && t.col === cell.col
            );
            const currentIdx = trace.findIndex(
              (t) => t.row === cell.row && t.col === cell.col
            );
            const previousCell = currentIdx > 0 ? trace[currentIdx - 1] : null;

            return (
              <Cell
                key={`${cell.row}-${cell.col}`}
                cell={cell}
                isTracing={isTracing}
                previousCell={previousCell}
                onMouseDown={() => onMouseDown(cell)}
                onMouseEnter={() => onMouseEnter(cell)}
              />
            );
          })}
        </div>
      </div>

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

      {time === 0 && (
        <div className="mt-8 text-red-400 text-xl font-bold">
          <h2>Game Over!</h2>
          <p className="mt-1 text-white">Your score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default Board;
