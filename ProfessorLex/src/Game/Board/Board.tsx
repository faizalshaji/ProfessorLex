import { useEffect, useRef, useState } from "react";
import Trie from "trie-prefix-tree";
import Cell from "./Cell";
import FoundWords from "../FoundWords/FoundWords";
import GameOver from "../GameOver";
import {
  playValidWord,
  playInvalidWord,
  playGameOver,
  playSelectLetter,
} from "../../utils/sound";

type CellType = { letter: string; row: number; col: number };

const GRID_SIZE = 10;
const CELL_SIZE = 48;

interface BoardProps {
  onWordsChange: (words: string[]) => void;
  gridSize?: number;
  initialTime?: number;
}

function Board({ onWordsChange, gridSize = 5, initialTime = 60 }: BoardProps) {
  const GRID_SIZE = gridSize;
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [trace, setTrace] = useState<CellType[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(initialTime);
  const [isGameOver, setIsGameOver] = useState(false);
  const [trie, setTrie] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameOverSoundPlayed = useRef(false);

  useEffect(() => {
    loadTrie().then((t) => {
      setTrie(t);
      initGrid();
    });
    const timer = setInterval(() => {
      setTime((t) => {
        const newTime = Math.max(0, t - 1);
        if (newTime === 0 && !gameOverSoundPlayed.current) {
          setIsGameOver(true);
          playGameOver();
          gameOverSoundPlayed.current = true;
        }
        return newTime;
      });
    }, 1000);
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

  const restartGame = async () => {
    try {
      // Reset game state first
      setFoundWords([]);
      onWordsChange([]);
      setTrace([]);
      setScore(0);
      setTime(initialTime); // Use the initialTime prop
      setIsGameOver(false);
      gameOverSoundPlayed.current = false;

      // Initialize new grid
      initGrid();

      // Ensure we have the trie
      if (!trie) {
        const t = await loadTrie();
        setTrie(t);
      }
    } catch (error) {
      console.error("Error restarting game:", error);
    }
  };
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
    if (!trace.length || isGameOver || time === 0) return;

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
      playSelectLetter();
    }
  }

  function onMouseDown(cell: CellType) {
    if (isGameOver || time === 0) return;
    setTrace([cell]);
    playSelectLetter();
  }

  function onMouseUp() {
    if (isGameOver || time === 0) return;
    if (!trace.length || !trie) {
      setTrace([]);
      return;
    }
    const word = trace.map((c) => c.letter).join("");
    if (word.length > 2) {
      if (trie.hasWord(word) && !foundWords.includes(word)) {
        const newWords = [...foundWords, word];
        setFoundWords(newWords);
        onWordsChange(newWords);
        setScore((s) => s + word.length);
        console.log("Playing valid word sound...");
        playValidWord();
      } else {
        console.log("Playing invalid word sound...");
        playInvalidWord();
      }
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
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 2.5;

    // Gap between cells is 8px (gap-2 in Tailwind)
    const GAP = 8;
    const TOTAL_CELL_SIZE = CELL_SIZE + GAP;
    const EXTEND_INTO_CELL = 6;
    // Diagonal adjustment factor (1/√2) to normalize diagonal lengths
    const DIAGONAL_FACTOR = 0.707;

    for (let i = 0; i < trace.length - 1; i++) {
      const from = trace[i];
      const to = trace[i + 1];

      // Calculate cell centers
      const x1 = from.col * TOTAL_CELL_SIZE + CELL_SIZE / 2;
      const y1 = from.row * TOTAL_CELL_SIZE + CELL_SIZE / 2;
      const x2 = to.col * TOTAL_CELL_SIZE + CELL_SIZE / 2;
      const y2 = to.row * TOTAL_CELL_SIZE + CELL_SIZE / 2;

      // Calculate direction
      const dx = to.col - from.col;
      const dy = to.row - from.row;

      // Calculate arrow points (extending into cells)
      let startX = x1,
        startY = y1,
        endX = x2,
        endY = y2;
      let extend = EXTEND_INTO_CELL;

      if (dx === 0) {
        // Vertical movement
        startX = endX = x1;
        if (dy > 0) {
          startY = y1 + CELL_SIZE / 2 - extend;
          endY = y2 - CELL_SIZE / 2 + extend;
        } else {
          startY = y1 - CELL_SIZE / 2 + extend;
          endY = y2 + CELL_SIZE / 2 - extend;
        }
      } else if (dy === 0) {
        // Horizontal movement
        startY = endY = y1;
        if (dx > 0) {
          startX = x1 + CELL_SIZE / 2 - extend;
          endX = x2 - CELL_SIZE / 2 + extend;
        } else {
          startX = x1 - CELL_SIZE / 2 + extend;
          endX = x2 + CELL_SIZE / 2 - extend;
        }
      } else {
        // Diagonal movement - adjust the extension length
        extend = EXTEND_INTO_CELL * DIAGONAL_FACTOR;

        if (dx > 0) {
          startX = x1 + CELL_SIZE / 2 - extend;
          endX = x2 - CELL_SIZE / 2 + extend;
        } else {
          startX = x1 - CELL_SIZE / 2 + extend;
          endX = x2 + CELL_SIZE / 2 - extend;
        }
        if (dy > 0) {
          startY = y1 + CELL_SIZE / 2 - extend;
          endY = y2 - CELL_SIZE / 2 + extend;
        } else {
          startY = y1 - CELL_SIZE / 2 + extend;
          endY = y2 + CELL_SIZE / 2 - extend;
        }
      }

      // Calculate angle and draw smaller arrowhead
      const angle = Math.atan2(endY - startY, endX - startX);
      const headlen = 6;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headlen * Math.cos(angle - Math.PI / 6),
        endY - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headlen * Math.cos(angle + Math.PI / 6),
        endY - headlen * Math.sin(angle + Math.PI / 6)
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
        {isGameOver && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-4xl font-bold text-red-400 mb-6">
                Game Over!
              </h2>
              <p className="text-3xl font-semibold text-white mb-4">
                Score: {score}
              </p>
              <p className="text-xl text-emerald-400 mb-2">
                Found Words: {foundWords.length}
              </p>
              <button
                onClick={restartGame}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
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

      {time === 0 && <GameOver score={score} />}
    </div>
  );
}

export default Board;
