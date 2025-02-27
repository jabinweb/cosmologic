'use client';

import { createContext, useContext, useState } from 'react';

interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const FullscreenContext = createContext<FullscreenContextType>({
  isFullscreen: false,
  toggleFullscreen: () => {},
});

export function FullscreenProvider({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export const useFullscreen = () => useContext(FullscreenContext);
