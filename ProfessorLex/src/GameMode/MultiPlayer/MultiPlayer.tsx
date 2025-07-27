import { useParams } from "react-router-dom";
import Game from "../../Game";

function Multiplayer() {
  const { roomName } = useParams();

  return (
    <div className="multiplayer">
      <p>Room Name: {roomName}</p>
      <Game></Game>
    </div>
  );
}

export default Multiplayer;
