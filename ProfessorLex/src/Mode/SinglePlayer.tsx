import { useLocation, useNavigate } from "react-router-dom";
import Game from "../Game/Game";
import { GameMode } from "../Enums/GameMode";

function SinglePlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gridSize, time } = location.state || { gridSize: 5, time: 60 };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-4  bg-[#0A2F2F]/90 backdrop-blur-md text-white">
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1 rounded bg-[#1F574A] hover:bg-[#286D5D] text-white text-sm"
          title="Go Home"
        >
          Home
        </button>
        <div className="text-sm text-gray-300">Single Player</div>
      </div>
      <Game mode={GameMode.SinglePlayer} gridSize={gridSize} time={time} />
    </div>
  );
}

export default SinglePlayer;
