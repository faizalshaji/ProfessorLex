import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  initialName?: string;
  title?: string;
  confirmText?: string;
  onConfirm: (name: string) => void;
  onCancel?: () => void;
};

export default function NameModal({
  isOpen,
  initialName,
  title = "Enter your name",
  confirmText = "Save",
  onConfirm,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialName ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialName ?? "");
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name");
      return;
    }
    if (trimmed.length > 30) {
      setError("Name must be 30 characters or fewer");
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#0A2F2F]/95 border border-[#2F6F5F]/30 rounded-xl w-96 max-w-[90%] p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={`w-full px-4 py-3 bg-[#2F6F5F]/30 border ${
            error ? "border-red-500" : "border-[#2F6F5F]/50"
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A8A75]`}
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-5">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-[#2F6F5F]/40 text-gray-200 hover:bg-[#2F6F5F]/20"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-[#2F6F5F] hover:bg-[#3A8A75] text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
