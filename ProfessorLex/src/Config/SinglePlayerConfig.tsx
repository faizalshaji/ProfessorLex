import { useNavigate } from "react-router-dom";
import Config from "./Config";

type Props = {
  gridSize: number;
  setGridSize: (val: number) => void;
  time: number;
  setTime: (val: number) => void;
};

function SinglePlayerConfig({ gridSize, setGridSize, time, setTime }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Config
        gridSize={gridSize}
        setGridSize={setGridSize}
        time={time}
        setTime={setTime}
      />
      <button
        onClick={() => {
          // Only proceed if values are valid
          if (gridSize >= 5 && gridSize <= 10 && time >= 30 && time <= 300) {
            navigate("/singleplayer", {
              state: {
                gridSize,
                time,
              },
            });
          }
        }}
        className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md transition-all"
        disabled={gridSize < 5 || gridSize > 10 || time < 30 || time > 300}
      >
        Start Game
      </button>
    </div>
  );
}

export default SinglePlayerConfig;
