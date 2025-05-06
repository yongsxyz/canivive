import GameSettings from "@/components/settings/GameSettings";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  showSettings: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SettingsContext.Provider value={{ showSettings, toggleSettings, closeSettings }}>
      {children}
      {showSettings && <GameSettings onClose={closeSettings} />}
    </SettingsContext.Provider>
  );
};

// Use default export for `useSettings` to avoid HMR issues
const useGameSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};

export default useGameSettings;
