import React, { createContext, useContext, useState } from 'react';

type GameCurrencyContextType = {
  goldBalance: number;
  setGoldBalance: React.Dispatch<React.SetStateAction<number>>;
  gemBalance: number;
  setGemBalance: React.Dispatch<React.SetStateAction<number>>;
};

const GameCurrencyContext = createContext<GameCurrencyContextType | undefined>(undefined);

export const GameCurrencyProvider = ({ children }) => {
  const [goldBalance, setGoldBalance] = useState(0);
  const [gemBalance, setGemBalance] = useState(0);

  return (
    <GameCurrencyContext.Provider value={{
      goldBalance,
      setGoldBalance,
      gemBalance,
      setGemBalance
    }}>
      {children}
    </GameCurrencyContext.Provider>
  );
};

// Custom hook supaya gampang dipakai
export const useGameCurrency = () => useContext(GameCurrencyContext);
