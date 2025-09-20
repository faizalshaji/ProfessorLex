type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const PopupDialog = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0A2F2F]/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#0A2F2F]/90 backdrop-blur-md p-6 rounded-xl w-96 max-w-[90%] border border-[#2F6F5F]/30 shadow-[0_0_40px_rgba(47,111,95,0.1)] text-center">
        <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
        <div className="mb-4">{children}</div>
        <button
          onClick={onClose}
          className="bg-[#2F6F5F] hover:bg-[#3A8A75] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1A472F]/20 hover:shadow-[#2F6F5F]/40"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PopupDialog;
