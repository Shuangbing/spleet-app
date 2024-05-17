// components/Overlay.tsx
import React from "react";
import { XIcon } from "../icons/XIcon";

interface OverlayProps {
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isVisible, children, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full mx-4">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Overlay;
