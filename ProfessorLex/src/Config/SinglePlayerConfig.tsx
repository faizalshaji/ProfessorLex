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
          navigate("/singleplayer", {
            state: {
              gridSize,
              time,
            },
          });
        }}
        className="w-full py-3 mt-6 bg-[#2F6F5F] hover:bg-[#3A8A75] backdrop-blur-sm text-white font-semibold rounded-xl shadow-lg shadow-[#1A472F]/20 hover:shadow-[#2F6F5F]/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={gridSize < 5 || gridSize > 10 || time < 30 || time > 300}
      >
        Start Game
      </button>
    </div>
  );
}

export default SinglePlayerConfig;
