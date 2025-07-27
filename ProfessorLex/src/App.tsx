import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import SinglePlayer from "./GameMode/SinglePlayer";
import Multiplayer from "./GameMode/MultiPlayer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/singleplayer" element={<SinglePlayer />} />
      <Route path="/multiplayer/:roomName" element={<Multiplayer />} />
    </Routes>
  );
}

export default App;
