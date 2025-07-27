import "./Popup.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};
const PopupDialog = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-dialog">
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
export default PopupDialog;
