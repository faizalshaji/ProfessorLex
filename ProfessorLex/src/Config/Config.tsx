import { useState, useEffect } from "react";

type Props = {
  gridSize: number;
  time: number;
  setGridSize: (value: number) => void;
  setTime: (value: number) => void;
};

const Config = ({ gridSize, time, setGridSize, setTime }: Props) => {
  const [gridSizeError, setGridSizeError] = useState("");
  const [timeError, setTimeError] = useState("");

  // Validate inputs whenever they change
  useEffect(() => {
    if (gridSize < 5 || gridSize > 10) {
      setGridSizeError("Grid size must be between 5 and 10");
    } else {
      setGridSizeError("");
    }
  }, [gridSize]);

  useEffect(() => {
    if (time < 30 || time > 300) {
      setTimeError("Time must be between 30 seconds and 5 minutes");
    } else {
      setTimeError("");
    }
  }, [time]);

  return (
    <div className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3">
        <label htmlFor="gridSize" className="text-lg font-semibold text-white">
          Grid Size
        </label>
        <input
          id="gridSize"
          type="number"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value) || 5)}
          className={`bg-gray-700 border ${
            gridSizeError ? "border-red-500" : "border-gray-600"
          } text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            gridSizeError ? "focus:ring-red-500" : "focus:ring-purple-500"
          } text-lg`}
        />
        {gridSizeError ? (
          <span className="text-red-500 text-sm">{gridSizeError}</span>
        ) : (
          <span className="text-gray-400 text-sm">
            Must be between 5 and 10
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="time" className="text-lg font-semibold text-white">
          Time (seconds)
        </label>
        <input
          id="time"
          type="number"
          value={time}
          onChange={(e) => setTime(Number(e.target.value) || 60)}
          className={`bg-gray-700 border ${
            timeError ? "border-red-500" : "border-gray-600"
          } text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            timeError ? "focus:ring-red-500" : "focus:ring-purple-500"
          } text-lg`}
        />
        {timeError ? (
          <span className="text-red-500 text-sm">{timeError}</span>
        ) : (
          <span className="text-gray-400 text-sm">
            Must be between 30 and 300 seconds (5 minutes)
          </span>
        )}
      </div>
    </div>
  );
};

export default Config;
