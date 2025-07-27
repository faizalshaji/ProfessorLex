import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup/Popup";

function Home() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  function createRoom() {
    const roomName = Math.random().toString(36).substring(2, 8);
    navigate(`/multiplayer/${roomName}`);
  }

  function handleJoinRoom() {
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }
    navigate(`/multiplayer/${roomName}`);
  }

  return (
    <div className="home">
      <h1>Professor Lex</h1>
      <div className="menu">
        <button onClick={() => navigate("/singleplayer")}>Single Player</button>
        <button onClick={() => setShowPopup(true)}>Join Room</button>
        <button onClick={createRoom}>Create Room</button>
      </div>

      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Join Room"
      >
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
            setError("");
          }}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleJoinRoom}>Join</button>
      </Popup>
    </div>
  );
}

export default Home;
