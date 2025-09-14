type Props = {
  gridSize: number;
  time: number;
  setGridSize: (value: number) => void;
  setTime: (value: number) => void;
};

const Config = ({ gridSize, time, setGridSize, setTime }: Props) => {
  return (
    <div className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3">
        <label htmlFor="gridSize" className="text-lg font-semibold text-white">
          Grid Size (e.g. 5 for 5×5)
        </label>
        <input
          id="gridSize"
          type="number"
          min={3}
          max={10}
          value={gridSize}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 3 && value <= 10) {
              setGridSize(value);
            }
          }}
          className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="time" className="text-lg font-semibold text-white">
          Time (seconds)
        </label>
        <input
          id="time"
          type="number"
          min={30}
          max={300}
          value={time}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 30 && value <= 300) {
              setTime(value);
            }
          }}
          className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
        />
      </div>
    </div>
  );
};

export default Config;
