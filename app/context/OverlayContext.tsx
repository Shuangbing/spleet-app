"use client";
import Overlay from "@/components/ui/overlay";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface OverlayContextType {
  isVisible: boolean;
  content: ReactNode;
  showOverlay: (content: ReactNode) => void;
  hideOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

const OverlayWrapper: React.FC = () => {
  const { isVisible, content, hideOverlay } = useOverlay();
  return (
    <Overlay isVisible={isVisible} onClose={hideOverlay}>
      {content}
    </Overlay>
  );
};

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const showOverlay = (content: ReactNode) => {
    setContent(content);
    setIsVisible(true);
  };

  const hideOverlay = () => {
    setIsVisible(false);
    setContent(null);
  };

  return (
    <OverlayContext.Provider
      value={{ isVisible, content, showOverlay, hideOverlay }}
    >
      <OverlayWrapper />
      {children}
    </OverlayContext.Provider>
  );
};

export function useOverlay(): OverlayContextType {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
}
