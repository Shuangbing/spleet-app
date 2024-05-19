import { useTranslations } from "next-intl";
import React from "react";

interface OverlayProps {
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isVisible, children, onClose }) => {
  const t = useTranslations("Global");
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
      <div
        className="fixed left-[50%] top-[50%] z-50 grid w-11/12 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg bg-white dark:bg-gray-800"
        tabIndex={-1}
      >
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-semibold">{t("error")}</h2>
          <p className="text-sm text-muted-foreground">{children}</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
