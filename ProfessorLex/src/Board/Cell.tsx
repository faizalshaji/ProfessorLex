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
    if (!previousCell) return { icon: null, className: "" };

    const dr = cell.row - previousCell.row;
    const dc = cell.col - previousCell.col;

    if (dr === -1 && dc === 0)
      return {
        icon: <ArrowUpIcon className="w-4 h-4 text-yellow-500" />,
        className: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
      };
    if (dr === 1 && dc === 0)
      return {
        icon: <ArrowDownIcon className="w-4 h-4 text-yellow-500" />,
        className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      };
    if (dr === 0 && dc === -1)
      return {
        icon: <ArrowLeftIcon className="w-4 h-4 text-yellow-500" />,
        className: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
      };
    if (dr === 0 && dc === 1)
      return {
        icon: <ArrowRightIcon className="w-4 h-4 text-yellow-500" />,
        className: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
      };
    if (dr === -1 && dc === 1)
      return {
        icon: <ArrowUpRightIcon className="w-4 h-4 text-yellow-500" />,
        className: "top-0 right-0 -translate-y-1/2 translate-x-1/2",
      };
    if (dr === -1 && dc === -1)
      return {
        icon: <ArrowUpLeftIcon className="w-4 h-4 text-yellow-500" />,
        className: "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
      };
    if (dr === 1 && dc === 1)
      return {
        icon: <ArrowDownRightIcon className="w-4 h-4 text-yellow-500" />,
        className: "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
      };
    if (dr === 1 && dc === -1)
      return {
        icon: <ArrowDownLeftIcon className="w-4 h-4 text-yellow-500" />,
        className: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
      };

    return { icon: null, className: "" };
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
      {previousCell &&
        (() => {
          const { icon, className } = getDirection();
          return icon ? (
            <div className={`absolute ${className}`}>{icon}</div>
          ) : null;
        })()}
    </div>
  );
}
