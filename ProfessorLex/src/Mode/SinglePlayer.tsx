import { useLocation } from "react-router-dom";
import Game from "../Game/Game";

function SinglePlayer() {
  const location = useLocation();
  const { gridSize, time } = location.state || { gridSize: 5, time: 60 };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1">
        <Game 
          gridSize={gridSize} 
          time={time} 
          gameStarted={true} 
          roomId="single-player"
          playerId="player1"
          onUpdateScore={() => {}}
        />
      </div>
    </div>
  );
}

export default SinglePlayer;
