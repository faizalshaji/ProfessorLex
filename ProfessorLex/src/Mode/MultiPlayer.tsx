import { useLocation, useParams } from "react-router-dom";

import Game from "../Game/Game";

function Multiplayer() {
  const { roomName } = useParams();
  const location = useLocation();
  const { gridSize, time } = location.state || { gridSize: 5, time: 60 };

  return (
    <div className="multiplayer">
      <p>Room Name: {roomName}</p>
      <Game gridSize={gridSize} time={time} />
    </div>
  );
}

export default Multiplayer;
