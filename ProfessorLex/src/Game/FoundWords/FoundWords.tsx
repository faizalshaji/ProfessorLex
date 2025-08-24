type FoundWordsProps = {
  words: string[];
};

export default function FoundWords({ words }: FoundWordsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-pink-400">
        Found Words ({words.length})
      </h3>
      <ul className="mt-2 space-y-1 text-gray-100">
        {words.map((w) => (
          <li key={w} className="text-sm">
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}
