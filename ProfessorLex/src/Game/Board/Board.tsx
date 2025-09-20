import { useEffect, useRef, useState } from "react";
import Trie from "trie-prefix-tree";
import Cell from "./Cell";
import GameOver from "../GameOver";
import {
  playValidWord,
  playInvalidWord,
  playGameOver,
  playSelectLetter,
} from "../../Utils/sound";

type CellType = { letter: string; row: number; col: number };

const CELL_SIZE = 48;

interface BoardProps {
  onWordsChange: (words: string[]) => void;
  gridSize?: number;
  initialTime?: number;
  gameStarted?: boolean;
}

function Board({
  onWordsChange,
  gridSize = 5,
  initialTime = 60,
  gameStarted: isGameEnabled = false,
}: BoardProps) {
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
  const gameStarted = useRef(false);
  const initialLoadComplete = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load only happens once
    if (initialLoadComplete.current) return;

    // Initialize grid immediately with random letters
    initGrid();

    // Then load the trie and reinitialize grid with word validation
    loadTrie().then((t) => {
      setTrie(t);
      // Only reinitialize if game hasn't started
      if (!gameStarted.current) {
        initGrid();
      }
      initialLoadComplete.current = true;
    });
  }, []);

  // Separate timer effect that depends on isGameOver
  useEffect(() => {
    if (isGameOver || !isGameEnabled) return; // Don't start timer if game is over or not enabled

    const timer = setInterval(() => {
      setTime((t) => {
        if (t === initialTime) {
          // Game just started
          gameStarted.current = true;
        }
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
  }, [isGameOver, initialTime, isGameEnabled]); // Reset timer when isGameOver or isGameEnabled changes

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

  function finishLoading() {
    // Wait 500ms before hiding loading text for smoother experience
    setTimeout(() => setLoading(false), 500);
  }

  const restartGame = async () => {
    try {
      // Reset game started flag
      gameStarted.current = false;

      // Reset all game state synchronously
      setFoundWords([]);
      onWordsChange([]);
      setTrace([]);
      setScore(0);
      setTime(initialTime);

      // Initialize new grid
      initGrid();

      // Reset game over state last
      setIsGameOver(false);
      gameOverSoundPlayed.current = false;

      // Ensure we have the trie
      if (!trie) {
        const t = await loadTrie();
        setTrie(t);
      }
    } catch (error) {
      console.error("Error restarting game:", error);
    }
  };
  function findAllWords(grid: CellType[][]): string[] {
    const allWords: Set<string> = new Set();
    if (!trie) return [];

    const maxWordLength = Math.min(GRID_SIZE * 2, 8); // Scale with grid size, max 8

    function dfs(
      row: number,
      col: number,
      visited: boolean[][],
      currentWord: string
    ) {
      if (currentWord.length > maxWordLength) return; // Scale with grid size

      if (currentWord.length >= 3 && trie.hasWord(currentWord.toLowerCase())) {
        allWords.add(currentWord.toLowerCase());
      }

      const dirs = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      for (const [dx, dy] of dirs) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (
          newRow >= 0 &&
          newRow < GRID_SIZE &&
          newCol >= 0 &&
          newCol < GRID_SIZE &&
          !visited[newRow][newCol]
        ) {
          visited[newRow][newCol] = true;
          dfs(
            newRow,
            newCol,
            visited,
            currentWord + grid[newRow][newCol].letter
          );
          visited[newRow][newCol] = false;
        }
      }
    }

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const visited = Array(GRID_SIZE)
          .fill(null)
          .map(() => Array(GRID_SIZE).fill(false));
        visited[i][j] = true;
        dfs(i, j, visited, grid[i][j].letter);
      }
    }

    return Array.from(allWords);
  }

  function generateGrid(): CellType[][] {
    const randomLetter = () => {
      // More sophisticated letter distribution based on English letter frequency
      const letterPool = {
        vowels: { letters: "aeiou", weight: 0.38 },
        common: { letters: "rstln", weight: 0.35 },
        medium: { letters: "dcmpbg", weight: 0.2 },
        rare: { letters: "fhvwykjxqz", weight: 0.07 },
      };

      const rand = Math.random();
      let pool;
      if (rand < letterPool.vowels.weight) pool = letterPool.vowels;
      else if (rand < letterPool.vowels.weight + letterPool.common.weight)
        pool = letterPool.common;
      else if (
        rand <
        letterPool.vowels.weight +
          letterPool.common.weight +
          letterPool.medium.weight
      )
        pool = letterPool.medium;
      else pool = letterPool.rare;

      return pool.letters.charAt(
        Math.floor(Math.random() * pool.letters.length)
      );
    };

    const cells: CellType[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      cells.push([]);
      for (let c = 0; c < GRID_SIZE; c++) {
        cells[r].push({ letter: randomLetter(), row: r, col: c });
      }
    }
    return cells;
  }

  function calculateMinWords(size: number): number {
    // Increased minimum words for better gameplay:
    // 4x4 -> 25 words minimum
    // 5x5 -> 35 words minimum
    // 6x6 -> 50 words minimum
    // 7x7 -> 70 words minimum
    return Math.floor(Math.pow(size - 1, 2) * 1.5);
  }

  function calculateMaxWordLength(size: number): number {
    // Example formula: grid size * 1.5, capped at 12
    return Math.min(Math.floor(size * 1.5), 12);
  }

  function hasEnoughLongWords(words: string[], maxLength: number): boolean {
    const minLongLength = Math.floor(maxLength * 0.8); // 80% of max length
    const longWords = words.filter((w) => w.length >= minLongLength);
    return longWords.length >= Math.max(3, Math.floor(maxLength / 2));
    // At least 3 or half of maxLength words must be long
  }

  function initGrid() {
    setLoading(true); // Start loading

    if (!trie) {
      setGrid(generateGrid());
      finishLoading();
      return;
    }

    let attempts = 0;
    const maxAttempts = 100;
    const minRequiredWords = calculateMinWords(GRID_SIZE);
    const maxWordLength = calculateMaxWordLength(GRID_SIZE);

    let bestGrid = generateGrid();
    let bestWordCount = 0;

    while (attempts < maxAttempts) {
      const newGrid = generateGrid();
      const words = findAllWords(newGrid);
      const wordCount = words.length;

      if (
        wordCount >= minRequiredWords &&
        hasEnoughLongWords(words, maxWordLength)
      ) {
        console.log(
          `Grid generated with ${wordCount} words, enough long words near ${maxWordLength}`
        );
        setGrid(newGrid);
        finishLoading(); // <-- Stop loading once we find a valid grid
        return;
      }

      if (wordCount > bestWordCount) {
        bestGrid = newGrid;
        bestWordCount = wordCount;
      }

      attempts++;
    }

    console.log(`Fallback grid with ${bestWordCount} words`);
    setGrid(bestGrid);
    finishLoading();
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

  function calculateWordScore(wordLength: number): number {
    // Base score: 10 points per letter
    const baseScore = wordLength * 10;

    // Exponential bonus for letters over 3
    // For each letter over 3, multiply bonus by 1.5
    const extraLetters = Math.max(0, wordLength - 3);
    const bonus = extraLetters > 0 ? Math.pow(1.5, extraLetters - 1) * 20 : 0;

    return Math.floor(baseScore + bonus);
  }

  function onMouseUp() {
    if (isGameOver || time === 0) return;
    if (!trace.length || !trie) {
      setTrace([]);
      return;
    }
    const word = trace
      .map((c) => c.letter)
      .join("")
      .toLowerCase();
    if (word.length > 2) {
      if (trie.hasWord(word) && !foundWords.includes(word)) {
        const newWords = [...foundWords, word];
        setFoundWords(newWords);
        onWordsChange(newWords);
        const newScore = calculateWordScore(word.length);
        setScore((s) => s + newScore);
        playValidWord();
      } else {
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
      className="relative bg-gradient-to-br from-slate-900 to-gray-800 text-white p-6 text-center select-none"
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
        {loading && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white animate-pulse">
              Generating Board...
            </h2>
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
