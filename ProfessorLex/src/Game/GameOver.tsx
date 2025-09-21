type GameOverProps = {
  score: number;
};

export default function GameOver({ score }: GameOverProps) {
  return (
    <div className="mt-4 text-red-400 text-xl font-bold">
      <h2>Game Over!</h2>
      <p className="mt-1 text-white">Your score: {score}</p>
    </div>
  );
}
