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
    <>
      <Config
        gridSize={gridSize}
        setGridSize={setGridSize}
        time={time}
        setTime={setTime}
      />
      <button
        onClick={() => {
          // Ensure valid values before starting
          const validGridSize = Math.min(Math.max(3, gridSize), 10);
          const validTime = Math.min(Math.max(30, time), 300);
          navigate("/singleplayer", {
            state: {
              gridSize: validGridSize,
              time: validTime,
            },
          });
        }}
        className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
      >
        Start Game
      </button>
    </>
  );
}

export default SinglePlayerConfig;
