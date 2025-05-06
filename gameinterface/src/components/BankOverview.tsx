import React, { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { bankLocations, getItemsForLocation, getTotalItemCount, getTotalItemValue } from "@/data/items";
import { Item } from "@/types/items";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queueToast } from "@/utils/toastManager";

const BankOverview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedEnchantment, setSelectedEnchantment] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  
  const totalCount = getTotalItemCount();
  const totalValue = getTotalItemValue();
  
  // Apply filters based on search query and dropdown selections
  const filteredLocations = bankLocations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'item-common';
      case 'uncommon': return 'item-uncommon';
      case 'rare': return 'item-rare';
      case 'epic': return 'item-epic';
      case 'legendary': return 'item-legendary';
      default: return '';
    }
  };

  const renderItemTooltip = (item: Item) => (
    <div className="p-2 max-w-xs">
      <p className="font-bold">{item.name}</p>
      <p className="capitalize text-xs">{item.rarity} {item.type}</p>
      {item.enchantment && <p className="text-xs">Enchantment: {item.enchantment}</p>}
      {item.tier && <p className="text-xs">Tier: {item.tier}</p>}
      <p className="text-game-primary">Value: {item.value} gold</p>
    </div>
  );

  const toggleLocation = (locationName: string) => {
    if (expandedLocation === locationName) {
      setExpandedLocation(null);
    } else {
      setExpandedLocation(locationName);
    }
  };

  return (
    <div className="game-ui">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl text-game-primary font-bold mb-2">Bank Overview</h2>
        
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-game-secondary" />
            <input
              type="text"
              placeholder="Search..."
              className="game-search pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // Make sure the input is properly accessible and focusable
              aria-label="Search locations"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="game-select w-24 bg-game-dark">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-game-dark border-game-primary z-50">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="weapon">Weapons</SelectItem>
                <SelectItem value="armor">Armor</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
                <SelectItem value="consumable">Consumables</SelectItem>
                <SelectItem value="material">Materials</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="game-select w-20 bg-game-dark">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent className="bg-game-dark border-game-primary z-50">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem>
                <SelectItem value="2">Tier 2</SelectItem>
                <SelectItem value="3">Tier 3</SelectItem>
                <SelectItem value="4">Tier 4</SelectItem>
                <SelectItem value="5">Tier 5</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedEnchantment} onValueChange={setSelectedEnchantment}>
              <SelectTrigger className="game-select w-32 bg-game-dark">
                <SelectValue placeholder="Enchantment" />
              </SelectTrigger>
              <SelectContent className="bg-game-dark border-game-primary z-50">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="burning">Burning</SelectItem>
                <SelectItem value="freezing">Freezing</SelectItem>
                <SelectItem value="knowledge">Knowledge</SelectItem>
                <SelectItem value="protection">Protection</SelectItem>
                <SelectItem value="shadow">Shadow</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
              <SelectTrigger className="game-select w-24 bg-game-dark">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent className="bg-game-dark border-game-primary z-50">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="1">Normal</SelectItem>
                <SelectItem value="2">Good</SelectItem>
                <SelectItem value="3">Excellent</SelectItem>
                <SelectItem value="4">Masterpiece</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 border-t border-b border-game-tertiary py-2">
          <div className="grid grid-cols-12 font-bold text-game-primary mb-2">
            <div className="col-span-6">Location</div>
            <div className="col-span-3 text-center">Item count</div>
            <div className="col-span-3 text-center">Est. Value</div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredLocations.filter(location => !location.isSubLocation).map((location, index) => {
              const locationItems = getItemsForLocation(location.name);
              const itemCount = locationItems.length;
              const itemValue = locationItems.reduce((sum, item) => sum + item.value, 0);
              
              return (
                <div key={index}>
                  <div
                    className={`location-row cursor-pointer ${
                      expandedLocation === location.name ? 'bg-game-tertiary bg-opacity-60' : ''
                    }`}
                    onClick={() => toggleLocation(location.name)}
                  >
                    <div className="flex items-center col-span-6">
                      {expandedLocation === location.name ? (
                        <ChevronDown size={16} className="mr-1 text-game-primary" />
                      ) : (
                        <ChevronRight size={16} className="mr-1 text-game-primary" />
                      )}
                      <span className="font-bold">{location.name}</span>
                    </div>
                    <div className="flex justify-end">
                      <div className="text-center mr-8">{itemCount}</div>
                      <div className="text-center w-24">{itemValue.toFixed(2)} g</div>
                    </div>
                  </div>
                  
                  {expandedLocation === location.name && (
                    <div className="py-2 px-4 bg-game-tertiary bg-opacity-30 mb-2 rounded-md">
                      <TooltipProvider>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-2">
                          {locationItems.map((item) => (
                            <Tooltip key={item.id}>
                              <TooltipTrigger asChild>
                                <div className={`game-item ${getRarityClass(item.rarity)} w-full aspect-square flex items-center justify-center text-2xl`}>
                                  <div>
                                    <div>{item.icon}</div>
                                    {item.tier && (
                                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                        T{item.tier}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="game-ui border-game-primary">
                                {renderItemTooltip(item)}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-between border-t border-game-tertiary pt-2">
          <div className="font-bold">Total:</div>
          <div className="flex gap-8">
            <div className="font-bold">{totalCount}</div>
            <div className="font-bold">{totalValue.toFixed(2)} g</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankOverview;
