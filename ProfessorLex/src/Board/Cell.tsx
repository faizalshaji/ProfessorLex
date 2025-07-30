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
}: CellProps) {
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
    </div>
  );
}
