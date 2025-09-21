import { useLocation, useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";
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
          className="p-2 rounded bg-[#1F574A] hover:bg-[#286D5D] text-white"
          title="Go Home"
          aria-label="Go Home"
        >
          <HomeIcon className="w-5 h-5" />
        </button>
        <div className="text-sm text-gray-300">Single Player</div>
      </div>
      <Game mode={GameMode.SinglePlayer} gridSize={gridSize} time={time} />
    </div>
  );
}

export default SinglePlayer;
