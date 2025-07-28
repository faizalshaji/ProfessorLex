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

type CellProps = {
  cell: { letter: string; row: number; col: number };
  onMouseDown: () => void;
  onMouseEnter: () => void;
  isTracing: boolean;
  previousCell: { row: number; col: number } | null;
};

export default function Cell({
  cell,
  onMouseDown,
  onMouseEnter,
  isTracing,
  previousCell,
}: CellProps) {
  const getDirection = () => {
    if (!previousCell) return null;
    const dr = cell.row - previousCell.row;
    const dc = cell.col - previousCell.col;

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
  };

  return (
    <div
      className={`relative w-12 h-12 border border-gray-300 text-lg font-bold flex items-center justify-center cursor-pointer transition 
          ${
            isTracing
              ? "bg-yellow-400 text-black scale-105"
              : "bg-white text-gray-800"
          }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {cell.letter.toUpperCase()}
      {previousCell && (
        <div className="absolute -bottom-2 right-0 p-0.5">{getDirection()}</div>
      )}
    </div>
  );
}
