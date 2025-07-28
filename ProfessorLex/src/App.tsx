import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import SinglePlayer from "./Mode/SinglePlayer";
import Multiplayer from "./Mode/MultiPlayer";

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
