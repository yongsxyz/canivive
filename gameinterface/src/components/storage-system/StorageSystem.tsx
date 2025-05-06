// StorageSystem.tsx
import React, { useState } from "react";
import { Item } from "@/types/items";
import { Progress } from "@/components/ui/progress";
import { Box, Archive, MoveDown, MoveUp, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StorageItemGrid from "@/components/storage-system/StorageItemGrid";

interface StorageSystemProps {
  inventoryItems: Item[];
  storageItems: Item[];
  maxStorageSlots: number;
  maxStorageWeight: number;
  onMoveToStorage: (itemId: string) => void;
  onMoveToInventory: (itemId: string) => void;
  isOpen: boolean;
  onToggleStorage: () => void;
  onMoveAllToStorage: () => void; 
  onMoveAllToInventory: () => void; 
}

const StorageSystem: React.FC<StorageSystemProps> = ({
  inventoryItems,
  storageItems,
  maxStorageSlots,
  maxStorageWeight,
  onMoveToStorage,
  onMoveToInventory,
  isOpen,
  onToggleStorage,
  onMoveAllToStorage,
  onMoveAllToInventory
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  
  // Calculate current storage weight
  const currentStorageWeight = storageItems.reduce((total, item) => {
    const count = item.count || 1;
    const weight = item.weight || 0;
    return total + (weight * count);
  }, 0);
  
  // Filter storage items based on search query, category, and rarity
  const filteredStorageItems = storageItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" ? true : item.type === selectedCategory;
    const matchesRarity = selectedRarity === "all" ? true : item.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  // If storage is closed, just show the toggle button
  if (!isOpen) {
    return (
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={onToggleStorage}
          className="flex items-center gap-2 bg-game-tertiary hover:bg-game-secondary text-game-light"
        >
          <Box size={16} />
          Open Storage
        </Button>
      </div>
    );
  }

  return (
    <div className="game-ui h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-game-primary flex items-center gap-2">
          <Archive size={18} />
          Storage System
        </h3>
        <Button 
          onClick={onToggleStorage}
          variant="outline" 
          className="text-xs flex items-center gap-1 bg-game-dark hover:bg-game-tertiary"
        >
          <Box size={14} />
          Close Storage
        </Button>
      </div>
      

      
      {/* Storage capacity info */}
      <div className="mb-4 flex flex-col space-y-1">
        <div className="flex justify-between text-xs">
          <span>Slots: {storageItems.length}/{maxStorageSlots}</span>
          <span>Weight: {currentStorageWeight.toFixed(1)}/{maxStorageWeight.toFixed(1)} kg</span>
        </div>
        <Progress 
          value={(currentStorageWeight / maxStorageWeight) * 100} 
          className="h-2 bg-gray-700" 
        />
      </div>
      
      {/* Filter controls */}
      <div className="mb-4 p-2 bg-game-dark bg-opacity-40 rounded-md">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search storage..."
              className="pl-8 w-full h-9 bg-game-dark border border-game-secondary rounded-md text-game-light px-3 py-1 focus:outline-none focus:ring-1 focus:ring-game-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-game-dark border-game-secondary text-game-light h-8 text-xs flex-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="weapon">Weapons</SelectItem>
                <SelectItem value="armor">Armor</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
                <SelectItem value="bag">Bags</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="potion">Potions</SelectItem>
                <SelectItem value="material">Materials</SelectItem>
                <SelectItem value="misc">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="bg-game-dark border-game-secondary text-game-light h-8 text-xs flex-1">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Transfer controls */}
      <div className="flex mb-4 justify-between">
        <Button 
          onClick={() => {
            if (inventoryItems.length > 0) {
              onMoveAllToStorage();
            }
          }}
          variant="outline" 
          className="text-xs flex-1 mr-2 flex items-center justify-center gap-1 bg-game-tertiary hover:bg-game-secondary"
          disabled={inventoryItems.length === 0}
        >
          <MoveDown size={14} />
          Move All to Storage
        </Button>
        <Button 
               onClick={() => {
                if (storageItems.length > 0) {
                  onMoveAllToInventory();
                }
              }}
          variant="outline" 
          className="text-xs flex-1 ml-2 flex items-center justify-center gap-1 bg-game-tertiary hover:bg-game-secondary"
          disabled={filteredStorageItems.length === 0}
        >
          <MoveUp size={14} />
          Move All to Inventory
        </Button>
      </div>


      {/* Storage items grid */}
      <StorageItemGrid 
        items={filteredStorageItems} 
        onItemClick={onMoveToInventory} 
      />
    </div>
  );
};

export default StorageSystem;