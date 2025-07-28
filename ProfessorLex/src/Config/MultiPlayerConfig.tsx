import { useState } from "react";
import Config from "./Config";

type Props = {
  gridSize: number;
  setGridSize: (val: number) => void;
  time: number;
  setTime: (val: number) => void;
  roomName: string;
  setRoomName: (val: string) => void;
  error: string;
  setError: (val: string) => void;
  onCreate: () => void;
  onJoin: () => void;
};

function MultiplayerConfig({
  gridSize,
  setGridSize,
  time,
  setTime,
  roomName,
  setRoomName,
  error,
  setError,
  onCreate,
  onJoin,
}: Props) {
  const [multiMode, setMultiMode] = useState<"join" | "create">("join");

  return (
    <>
      {/* Radio Buttons */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="multiMode"
            value="join"
            checked={multiMode === "join"}
            onChange={() => setMultiMode("join")}
            className="form-radio text-purple-500"
          />
          Join
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="multiMode"
            value="create"
            checked={multiMode === "create"}
            onChange={() => setMultiMode("create")}
            className="form-radio text-purple-500"
          />
          Create
        </label>
      </div>

      {multiMode === "join" ? (
        <>
          <input
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={onJoin}
            className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md"
          >
            Join Room
          </button>
        </>
      ) : (
        <>
          <Config
            gridSize={gridSize}
            setGridSize={setGridSize}
            time={time}
            setTime={setTime}
          />
          <button
            onClick={onCreate}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md"
          >
            Create Room
          </button>
        </>
      )}
    </>
  );
}

export default MultiplayerConfig;
