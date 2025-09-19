type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const PopupDialog = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-yellow-500 p-6 rounded-xl w-72 max-w-[80%] shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PopupDialog;
