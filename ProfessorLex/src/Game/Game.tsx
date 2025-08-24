import Board from "./Board/Board";

export default function Game() {
  return (
    <div className="flex h-screen w-screen">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center bg-blue-200">
        <span className="text-xl font-bold">I am Left</span>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex items-center justify-center bg-green-200">
        <Board></Board>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-red-200">
        <span className="text-xl font-bold">I am Right</span>
      </div>
    </div>
  );
}
