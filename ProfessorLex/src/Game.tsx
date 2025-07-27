import { useEffect, useState } from "react";
import Trie from "trie-prefix-tree";
import "./Game.scss";

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
    <div className="app" onMouseUp={onMouseUp}>
      <h1>Professor Lex</h1>
      <div className="info">
        <p>Time: {time}s</p>
        <p>Score: {score}</p>
      </div>
      <div className="grid">
        {grid.map((row, ri) => (
          <div key={ri} className="row">
            {row.map((c) => {
              const tracing = trace.some(
                (t) => t.row === c.row && t.col === c.col
              );
              return (
                <div
                  key={`${c.row}-${c.col}`}
                  className={`cell ${tracing ? "tracing" : ""}`}
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
      <div className="found">
        <h3>Found Words ({foundWords.length})</h3>
        <ul>
          {foundWords.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
      {time === 0 && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
