import { useLocation } from "react-router-dom";
import Game from "../Game/Game";
import { GameMode } from "../Enums/GameMode";

function SinglePlayer() {
  const location = useLocation();
  const { gridSize, time } = location.state || { gridSize: 5, time: 60 };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1">
        <Game mode={GameMode.SinglePlayer} gridSize={gridSize} time={time} />
      </div>
    </div>
  );
}

export default SinglePlayer;
