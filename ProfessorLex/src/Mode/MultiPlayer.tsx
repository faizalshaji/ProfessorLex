import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import Game from "../Game/Game";
import type { Room, RoomPlayer } from "../Utils/firebase";
import { startGame, updatePlayerScore } from "../Utils/firebase";
import { GameMode } from "../Enums/GameMode";
import { GameState } from "../Enums/GameState";

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
        setGameStarted(data.gameState === GameState.Playing);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [roomName, navigate, playerId, playerName]);

  if (!room) return <div>Loading...</div>;
  if (!roomName || !playerId) return <div>Invalid game session</div>;

  const handleStartGame = async () => {
    if (!roomName || !gridSize) return;
    const grid = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      );
    await startGame(roomName, grid);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <h2 className="text-xl font-bold">Room: {room.id}</h2>
        {isHost && !gameStarted && (
          <button
            onClick={handleStartGame}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Start Game
          </button>
        )}
        {!isHost && !gameStarted && (
          <div className="text-sm text-gray-400">
            Waiting for host to start...
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Players List */}
        <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
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

        {/* Game Board */}
        <div className="flex-1">
          <Game
            mode={GameMode.MultiPlayer}
            gridSize={gridSize}
            time={time}
            gameStarted={gameStarted}
            roomId={roomName}
            playerId={playerId}
            isHost={isHost}
            players={room.players}
            onStartGame={handleStartGame}
            onUpdateScore={(words) => {
              const score = words.reduce((total, word) => {
                const wordLength = word.length;
                const baseScore = wordLength * 10;
                const extraLetters = Math.max(0, wordLength - 3);
                const bonus =
                  extraLetters > 0 ? Math.pow(1.5, extraLetters - 1) * 20 : 0;
                return total + Math.floor(baseScore + bonus);
              }, 0);
              updatePlayerScore(roomName, playerId, score, words);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Multiplayer;
