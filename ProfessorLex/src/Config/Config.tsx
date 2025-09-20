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

  const parseNumber = (val: string) => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="space-y-8 bg-[#0A2F2F]/90 backdrop-blur-md p-6 rounded-xl border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)]">
      <div className="flex flex-col gap-3">
        <label htmlFor="gridSize" className="text-lg font-semibold text-white">
          Grid Size
        </label>
        <input
          id="gridSize"
          type="text"
          value={gridSize}
          onChange={(e) => setGridSize(parseNumber(e.target.value))}
          className={`bg-[#2F6F5F]/40 border ${
            gridSizeError ? "border-red-500" : "border-[#2F6F5F]/50"
          } text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            gridSizeError ? "focus:ring-red-500" : "focus:ring-[#3A8A75]"
          } text-lg transition-all duration-200`}
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
          type="text"
          value={time}
          onChange={(e) => setTime(parseNumber(e.target.value))}
          className={`bg-[#2F6F5F]/40 border ${
            timeError ? "border-red-500" : "border-[#2F6F5F]/50"
          } text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
            timeError ? "focus:ring-red-500" : "focus:ring-[#3A8A75]"
          } text-lg transition-all duration-200`}
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
