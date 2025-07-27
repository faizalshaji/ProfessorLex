type Props = {
  gridSize: number;
  time: number;
  setGridSize: (value: number) => void;
  setTime: (value: number) => void;
};

const Configuration = ({ gridSize, time, setGridSize, setTime }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="gridSize" className="text-sm font-medium text-gray-700">
          Grid Size (e.g. 3 for 3×3)
        </label>
        <input
          id="gridSize"
          type="number"
          min={1}
          value={gridSize}
          onChange={(e) => setGridSize(parseInt(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="time" className="text-sm font-medium text-gray-700">
          Time (seconds)
        </label>
        <input
          id="time"
          type="number"
          min={1}
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Configuration;
