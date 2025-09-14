import { useLocation } from "react-router-dom";
import Game from "../Game/Game";

function SinglePlayer() {
  const location = useLocation();
  const { gridSize, time } = location.state || { gridSize: 10, time: 120 };

  return (
    <div className="single-player">
      <Game gridSize={gridSize} time={time} />
    </div>
  );
}

export default SinglePlayer;
