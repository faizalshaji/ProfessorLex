import { useParams } from "react-router-dom";
import Board from "../Board/Board";

function Multiplayer() {
  const { roomName } = useParams();

  return (
    <div className="multiplayer">
      <p>Room Name: {roomName}</p>
      <Board></Board>
    </div>
  );
}

export default Multiplayer;
