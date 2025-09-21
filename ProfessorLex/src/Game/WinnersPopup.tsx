import { useEffect, useState } from "react";

type PlayerLite = { id: string; name: string; score: number };

type WinnersPopupProps = {
  players: PlayerLite[]; // already sorted desc by score
  durationMs?: number; // default 8000
  onClose: () => void;
};

export default function WinnersPopup({
  players,
  durationMs = 8000,
  onClose,
}: WinnersPopupProps) {
  const [remaining, setRemaining] = useState(Math.ceil(durationMs / 1000));

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(Math.ceil(left / 1000));
      if (left <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 250);
    return () => clearInterval(interval);
  }, [durationMs, onClose]);

  const [first, second, third, ...rest] = players;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-[#0A2F2F]/95 border border-[#2F6F5F]/40 rounded-3xl shadow-2xl w-full max-w-3xl text-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2F6F5F]/30">
          <h3 className="text-xl font-semibold">Winners</h3>
          <div className="text-sm text-[#BFE2D5]">Closing in {remaining}s</div>
        </div>

        {/* Podium */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-end justify-center gap-6">
            {/* Second */}
            <PodiumPlace rank={2} player={second} color="#9CA3AF" />
            {/* First */}
            <PodiumPlace rank={1} player={first} color="#F59E0B" />
            {/* Third */}
            <PodiumPlace rank={3} player={third} color="#D97706" />
          </div>
        </div>

        {/* Others */}
        {rest.length > 0 && (
          <div className="px-6 pt-4 pb-6 border-t border-[#2F6F5F]/20">
            <div className="text-sm mb-2 text-[#BFE2D5]">Others</div>
            <div className="flex flex-wrap gap-2">
              {rest.map((p, i) => (
                <span
                  key={p.id}
                  className="px-3 py-1 rounded-full bg-[#0A2F2F] border border-[#2F6F5F]/30 text-[#E6FFF6] text-sm"
                  title={`#${i + 4}`}
                >
                  {p.name} ·{" "}
                  <span className="font-bold text-[#3A8A75]">{p.score}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-4 bg-[#072421] border-t border-[#2F6F5F]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2F6F5F] hover:bg-[#3A8A75] text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PodiumPlace({
  rank,
  player,
  color,
}: {
  rank: 1 | 2 | 3;
  player?: PlayerLite;
  color: string; // hex for medal accent
}) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
  const barHeightClass =
    rank === 1 ? "h-28 md:h-36" : rank === 2 ? "h-24 md:h-28" : "h-20 md:h-24";
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl" style={{ color }}>
        {medal}
      </div>
      <div
        className={`mt-2 w-40 md:w-48 ${barHeightClass} bg-[#0E3A33] border border-[#2F6F5F]/30 rounded-t-lg flex items-center justify-center text-center px-2`}
      >
        {player ? (
          <div>
            <div className="font-semibold truncate" title={player.name}>
              {player.name}
            </div>
            <div className="text-sm text-[#3A8A75] font-bold">
              {player.score}
            </div>
          </div>
        ) : (
          <div className="text-[#2F6F5F]">—</div>
        )}
      </div>
      <div className="w-40 md:w-48 h-2 bg-[#1A4E45] rounded-b" />
    </div>
  );
}
