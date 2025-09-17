import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";
import Game from "../Game/Game";
import type { Room, RoomPlayer } from "../utils/firebase";
import { startGame, updatePlayerScore } from "../utils/firebase";

function Multiplayer() {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const location = useLocation();
  const { gridSize, time, playerId, playerName, isHost } = location.state || {};
  const [room, setRoom] = useState<Room | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!roomName || !playerId || !playerName) {
      navigate("/");
      return;
    }

    const db = getDatabase();
    const roomRef = ref(db, `rooms/${roomName}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val() as Room;
      if (data) {
        setRoom(data);
        setGameStarted(data.gameState === "playing");
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [roomName, navigate, playerId, playerName]);

  if (!room) return <div>Loading...</div>;

  if (!roomName || !playerId) {
    return <div>Invalid game session</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Room: {room.name}</h2>
          <p className="text-sm text-gray-400">ID: {room.id}</p>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Players</h3>
          <div className="space-y-2">
            {Object.values(room.players || {}).map((player: RoomPlayer) => (
              <div
                key={player.id}
                className={`p-2 rounded ${
                  player.isHost ? "bg-purple-900/50" : "bg-gray-700/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {player.name} {player.isHost && "👑"}
                  </span>
                  <span>{player.score || 0}</span>
                </div>
                {gameStarted && (
                  <div className="text-xs text-gray-400 mt-1">
                    Found: {(player.foundWords || []).length} words
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost && !gameStarted && (
          <button
            onClick={async () => {
              if (room) {
                // Generate a random grid or get it from the Board component
                const grid = Array(gridSize)
                  .fill(null)
                  .map(() =>
                    Array(gridSize)
                      .fill(null)
                      .map(() =>
                        String.fromCharCode(65 + Math.floor(Math.random() * 26))
                      )
                  );
                await startGame(roomName, grid);
              }
            }}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Start Game
          </button>
        )}

        {!isHost && !gameStarted && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Waiting for host to start the game...
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1">
        <Game
          gridSize={gridSize}
          time={time}
          gameStarted={gameStarted}
          roomId={roomName}
          playerId={playerId}
          onUpdateScore={(words) => {
            updatePlayerScore(roomName, playerId, words.length * 10, words);
          }}
        />
      </div>
    </div>
  );
}

export default Multiplayer;
