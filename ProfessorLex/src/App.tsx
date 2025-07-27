import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import SinglePlayer from "./GameMode/SinglePlayer/SinglePlayer";
import Multiplayer from "./GameMode/MultiPlayer/MultiPlayer";

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
