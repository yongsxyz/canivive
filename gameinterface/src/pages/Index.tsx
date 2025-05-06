
import React, { useState, useEffect } from "react";
import CharacterEquipment from "@/components/CharacterEquipment";
import { Coins, Gem, User } from "lucide-react";
import LevelBadge from "@/components/character/LevelBadge";
import BankOverview from "@/components/BankOverview";
import TradingSystem from "@/components/trading/TradingSystem";
import CraftingSystem from "@/components/crafting-system/CraftingSystem";

import { useGameCurrency } from '@/context/GameCurrencyContext';
import LootManager from "@/components/loot/LootManager";
import { Item } from "@/types/items";


import { useInventory } from "@/context/InventoryContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authcontext";


const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);


  if (isLoading || !isAuthenticated) {
    return null;
  }

  const [activeTab, setActiveTab] = useState("character");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'k' || e.key === 'K') {
        setActiveTab("bank");
      }
    };

    const handleKeyPressCharacter = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'i') {
        setActiveTab("character");
      }
    };


    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keydown", handleKeyPressCharacter);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keydown", handleKeyPressCharacter);
    };

  }, []);


  const { goldBalance, setGoldBalance, gemBalance, setGemBalance } = useGameCurrency();

  const handleGoldBalanceChange = (newBalance: number) => {
    setGemBalance(newBalance);
  };

  const mintGold = () => {
    setGemBalance(gemBalance + 1000000);
  };


  return (
    <div className="min-h-screen bg-futuristic bg-cover flex flex-col p-4">
      <button
        onClick={mintGold}
        className="mt-4 w-fit px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded"
      >
        Mint Gold
      </button>
      {/* Character equipment */}
      {activeTab === "bank" && <BankOverview />}
      {activeTab === "character" && <CharacterEquipment />}

      <TradingSystem
        goldBalance={gemBalance}
        onGoldBalanceChange={handleGoldBalanceChange}
      />
      <br></br>

      <CraftingSystem
      />

      <LootManager
        UniqueLoot="test"

      />

    </div>
  );
};

export default Index;
