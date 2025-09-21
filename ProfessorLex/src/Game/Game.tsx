import { useRef, useState } from "react";
import Board from "./Board/Board";
import FoundWords from "./FoundWords/FoundWords";
import { GameMode } from "../Enums/GameMode";

interface GameProps {
  mode: GameMode;
  gridSize?: number;
  time?: number;
  gameStarted?: boolean;
  roomId?: string;
  playerId?: string;
  onUpdateScore?: (words: string[]) => void;
  players?: Record<
    string,
    { id: string; name: string; score: number; isHost: boolean }
  >;
  isHost?: boolean;
  onStartGame?: () => void;
  onGameOver?: () => void;
  isWaiting?: boolean; // explicitly indicate pre-start state for MP
}

export default function Game({
  mode,
  gridSize,
  time,
  gameStarted = mode === GameMode.SinglePlayer,
  onUpdateScore,
  players,
  isHost,
  onStartGame,
  onGameOver,
  isWaiting,
}: GameProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [missedWords, setMissedWords] = useState<string[]>([]);
  const highlightMissedRef = useRef<((w: string) => void) | null>(null);

  const handleWordsChange = (words: string[]) => {
    setFoundWords(words);
    if (onUpdateScore) {
      onUpdateScore(words);
    }
  };

  // Always render the main layout; use overlay to indicate Waiting in MP

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Background Image */}
      <img
        src="/ProfessorLex/images/home.jpg"
        alt="Game Background"
        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col w-full h-full bg-gradient-to-b from-[#0A2F2F]/80 via-transparent to-[#0A2F2F]/80">
        {/* Main Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left Panel Placeholder */}
          <div className="w-64 flex-shrink-0">
            {mode === GameMode.MultiPlayer && (
              <div className="h-full bg-[#0A2F2F]/90 backdrop-blur-md border-r border-[#2F6F5F]/30 flex flex-col">
                <div className="p-4 border-b border-[#2F6F5F]/30">
                  <h3 className="text-lg font-semibold text-white">Players</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {players ? (
                    Object.values(players)
                      .sort((a, b) => {
                        const byScore = b.score - a.score;
                        return byScore !== 0
                          ? byScore
                          : a.name.localeCompare(b.name);
                      })
                      .map((player, idx) => (
                        <div
                          key={player.id}
                          className={`p-3 rounded-lg border backdrop-blur-sm transition-all duration-200 ${
                            player.isHost
                              ? "bg-[#2F6F5F]/20 border-[#2F6F5F]/30 hover:bg-[#2F6F5F]/30"
                              : "bg-[#0A2F2F]/40 border-[#2F6F5F]/20 hover:bg-[#0A2F2F]/60"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-white">
                              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-[#1F574A] text-white">
                                {idx + 1}
                              </span>
                              {player.name}
                              {player.isHost && player.score > 0 && (
                                <span className="text-[#3A8A75]">👑</span>
                              )}
                            </span>
                            <span className="text-[#3A8A75]">
                              {player.score}
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-[#2F6F5F] text-center mt-4">
                      No players yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Center Panel */}
          <div className="flex-1 overflow-hidden flex items-center justify-center relative">
            <div className="max-h-full p-6">
              {mode === GameMode.MultiPlayer && isWaiting ? (
                <div className="bg-[#0A2F2F]/90 backdrop-blur-md rounded-3xl p-10 border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)] text-center">
                  <div className="text-4xl mb-4">🎲</div>
                  <h2 className="text-2xl font-semibold mb-3 text-white">
                    Game Not Started
                  </h2>
                  {isHost ? (
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-[#2F6F5F] text-lg">
                        You’re the host. Start the game when ready.
                      </p>
                      <button
                        onClick={onStartGame}
                        className="mt-2 inline-flex items-center justify-center px-6 py-2 bg-[#2F6F5F] hover:bg-[#3A8A75] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1A472F]/20 hover:shadow-[#2F6F5F]/40"
                      >
                        Start Game
                      </button>
                    </div>
                  ) : (
                    <p className="text-[#2F6F5F] text-lg">
                      Waiting for the room owner to start the game...
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-[#0A2F2F]/90 backdrop-blur-md rounded-3xl p-8 border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)] hover:shadow-[0_0_50px_rgba(47,111,95,0.2)] transition-shadow duration-300 relative">
                  <Board
                    onWordsChange={handleWordsChange}
                    gridSize={gridSize}
                    initialTime={time}
                    gameStarted={gameStarted}
                    canPlayAgain={mode === GameMode.SinglePlayer || !!isHost}
                    onPlayAgain={
                      mode === GameMode.MultiPlayer && isHost
                        ? onStartGame
                        : undefined
                    }
                    onGameOver={
                      mode === GameMode.MultiPlayer && isHost
                        ? onGameOver
                        : undefined
                    }
                    onMissedWordsAvailable={(missed, highlight) => {
                      setMissedWords(missed);
                      highlightMissedRef.current = highlight;
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-72 bg-[#0A2F2F]/90 backdrop-blur-md border-l border-[#2F6F5F]/30 overflow-hidden flex flex-col">
            {/* Found Words Section */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="p-4 border-b border-[#2F6F5F]/30">
                <h3 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
                  <span>Found Words</span>
                  <span className="text-sm text-[#3A8A75]">({foundWords.length})</span>
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FoundWords words={foundWords} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#2F6F5F]/30" />

            {/* Missed Words Section */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="p-4 border-b border-[#2F6F5F]/30">
                <h3 className="text-xl font-semibold text-white tracking-wide flex items-center justify-between">
                  <span>Missed Words</span>
                  <span className="text-sm text-[#3A8A75]">({missedWords.length})</span>
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {missedWords.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {missedWords.map((w, idx) => (
                      <button
                        key={w + idx}
                        onClick={() => highlightMissedRef.current && highlightMissedRef.current(w)}
                        className="w-full text-left px-2 py-1 rounded hover:bg-[#2F6F5F]/30 text-[#BFE2D5]"
                        title="Click to highlight on board"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#2F6F5F] text-sm">No missed words yet</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#0A2F2F] border-t border-[#2F6F5F]/30 py-2 px-4 flex-none">
          <div className="w-full flex justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#2F6F5F]">🎲</span>
              <span className="text-white">
                Grid Size: {gridSize}x{gridSize}
              </span>
            </div>
            <div className="text-[#2F6F5F]">•</div>
            {mode === GameMode.MultiPlayer && (
              <div className="flex items-center gap-2">
                <span className="text-[#2F6F5F]">🎮</span>
                <span className="text-white">Multiplayer</span>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
