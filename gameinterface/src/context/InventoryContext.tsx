

import React, { createContext, useContext, useState, ReactNode } from "react";

import { Item } from "@/types/items";
import { items } from "@/data/items";

// const myItems: Item[] = [


//   {
//     id: "crown-kings-99",
//     name: "Crown of Kings",
//     type: "accessory",
//     icon: "👑",
//     rarity: "epic",
//     value: 5,
//     weight: 0.3,
//     stackable: true,
//     maxStack: 20,
//     count: 20,
//     tier: 4,
//     stats: {
//       health: 500,
//       damage: 500,
//     },
//     location: "Personal Chest",
//   },

//   {
//     id: "potion-1",
//     name: "Minor Health Potion",
//     type: "potion",
//     icon: "🧪",
//     rarity: "common",
//     value: 15,
//     weight: 0.2,
//     stackable: true,
//     maxStack: 10,
//     count: 10,
//     consumableStats: {
//       health: 20,
//     },
//     location: "Personal Chest",
//   },

//   {
//     id: "multi-buff-1",
//     name: "Adventurer's Brew",
//     type: "potion",
//     rarity: "epic",
//     value: 120,
//     icon: "🌟",
//     weight: 0.6,
//     stackable: true,
//     maxStack: 3,
//     count: 2,
//     consumableStats: {
//       health: 25,
//       damage: 10,
//       armor: 10,
//       stamina: 25,
//       hungry: 15,
//       thirst: 15,
//       mood: 15
//     },
//     buffDuration: {
//       health: 5,
//       damage: 5,
//       armor: 5,
//       stamina: 5,
//       hungry: 5,
//       thirst: 5,
//       mood: 5
//     },
//     description: "An all-purpose mixture that temporarily enhances all attributes."
//   }
// ]



import { stackItems, getDefaultWeight, calculateTotalWeight } from "@/utils/inventoryManager";

import { MAX_SLOT_DEFAULT, MAX_WEIGHT_DEFAULT } from "@/config/constants";

type InventoryOptions = {
  maxSlots: number;
  maxWeight: number;
  currentWeight: number;
  totalItems: number;
};

type InventoryContextType = {
  inventoryItems: Item[] | null;
  setInventoryItems: React.Dispatch<React.SetStateAction<Item[] | null>>;
  inventoryOptions: InventoryOptions;
  setInventoryOptions: React.Dispatch<React.SetStateAction<InventoryOptions>>;
  updateInventoryAndStats: (updatedItems: Item[]) => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventoryItems, setInventoryItems] = useState<Item[] | null>(() => {
    if (!items || items.length === 0) return null;

    const allItems = [...items];
    const itemsWithWeightAndStack = allItems.map(item => ({
      ...item,
      weight: item.weight || getDefaultWeight(item.type),
      stackable: item.stackable !== undefined
        ? item.stackable
        : ["material", "accessory", "food", "potion", "misc"].includes(item.type),
    }));

    return stackItems(itemsWithWeightAndStack);
  });

  const [inventoryOptions, setInventoryOptions] = useState<InventoryOptions>(() => {
    const stacked = inventoryItems || [];
    return {
      maxSlots: MAX_SLOT_DEFAULT,
      maxWeight: MAX_WEIGHT_DEFAULT,
      currentWeight: calculateTotalWeight(stacked),
      totalItems: stacked.length,
    };
  });

  const updateInventoryAndStats = (updatedItems: Item[]) => {
    setInventoryItems(updatedItems);
    setInventoryOptions(prev => ({
      ...prev,
      currentWeight: calculateTotalWeight(updatedItems),
      totalItems: updatedItems.length,
    }));
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        setInventoryItems,
        inventoryOptions,
        setInventoryOptions,
        updateInventoryAndStats,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};
