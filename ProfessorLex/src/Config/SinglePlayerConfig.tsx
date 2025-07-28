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
          navigate("/singleplayer", { state: { gridSize, time } });
        }}
        className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
      >
        Start Game
      </button>
    </>
  );
}

export default SinglePlayerConfig;
