import { createPortal } from "react-dom";

function Modal({ onClose, children }) {
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        className="relative min-w-[300px] rounded-md bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}

export default Modal;
