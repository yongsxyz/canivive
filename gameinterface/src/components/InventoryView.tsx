import React, { useState } from "react";
import { items } from "@/data/items";
import { Item } from "@/types/items";
import { Search, Grid, List, Move } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getTranslation } from "./settings/TranslationUtils";
import { getRarityClass } from "@/utils/inventoryManager";
import { ItemIcon } from "@/data/icon";

const InventoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inventoryItems, setInventoryItems] = useState(items);
  
  // Get language from localStorage
  const language = localStorage.getItem('settings') 
    ? JSON.parse(localStorage.getItem('settings') || '{}').language || 'en'
    : 'en';
  
  const t = (key: string) => getTranslation(key, language);
  
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" ? true : item.type === selectedCategory;
    const matchesRarity = selectedRarity === "all" ? true : item.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });
  
  const totalValue = filteredItems.reduce((sum, item) => sum + item.value, 0);
  
  const renderItemTooltip = (item: Item) => (
    <div className="p-2 max-w-xs">
      <p className="font-bold">{item.name}</p>
      <p className="capitalize text-xs">{t(item.rarity)} {t(item.type)}</p>
      {item.enchantment && <p className="text-xs">{t("enchantment")}: {item.enchantment}</p>}
      {item.tier && <p className="text-xs">{t("tier")}: {item.tier}</p>}
      <p className="text-game-gold">{t("value")}: {item.value} {t("gold")}</p>
    </div>
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(inventoryItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setInventoryItems(items);
  };
  
  return (
    <div className="game-ui">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-game-gold font-bold mb-2">{t("inventory")}</h2>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-game-brown' : 'bg-game-dark-brown hover:bg-game-brown'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} className="text-game-beige" />
            </button>
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-game-brown' : 'bg-game-dark-brown hover:bg-game-brown'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} className="text-game-beige" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-game-brown" />
            <input
              type="text"
              placeholder={t("search") + "..."}
              className="game-search pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="game-select w-28">
                <SelectValue placeholder={t("type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                <SelectItem value="weapon">{t("weapons")}</SelectItem>
                <SelectItem value="armor">{t("armor")}</SelectItem>
                <SelectItem value="accessory">{t("accessories")}</SelectItem>
                <SelectItem value="consumable">{t("consumables")}</SelectItem>
                <SelectItem value="material">{t("materials")}</SelectItem>
                <SelectItem value="misc">{t("miscellaneous")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="game-select w-28">
                <SelectValue placeholder={t("rarity")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allRarities")}</SelectItem>
                <SelectItem value="common">{t("common")}</SelectItem>
                <SelectItem value="uncommon">{t("uncommon")}</SelectItem>
                <SelectItem value="rare">{t("rare")}</SelectItem>
                <SelectItem value="epic">{t("epic")}</SelectItem>
                <SelectItem value="legendary">{t("legendary")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="mt-4">
            {viewMode === 'grid' ? (
              <Droppable droppableId="inventory-grid" direction="horizontal">
                {(provided) => (
                  <div 
                    className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <TooltipProvider>
                      {filteredItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`game-item ${getRarityClass(item.rarity)} w-full aspect-square flex items-center justify-center text-2xl relative`}>
                                    <div className="flex flex-col items-center">
                                      <div><ItemIcon icon={item.icon} alt={item.name} /></div>

                                      
                                      {snapshot.isDragging && (
                                        <div className="absolute -top-2 -right-2 bg-game-brown rounded-full p-1">
                                          <Move size={14} className="text-game-beige" />
                                        </div>
                                      )}
                                      {item.tier && (
                                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                          T{item.tier}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="game-ui border-game-gold">
                                  {renderItemTooltip(item)}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </TooltipProvider>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ) : (
              <Droppable droppableId="inventory-list">
                {(provided) => (
                  <div 
                    className="flex flex-col gap-1" 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {filteredItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-game-light-brown bg-opacity-40 p-2 rounded-md flex items-center gap-3 ${snapshot.isDragging ? 'border-2 border-game-gold' : ''}`}
                          >
                            <div className={`game-item ${getRarityClass(item.rarity)} w-10 h-10 flex items-center justify-center`}>
                            <ItemIcon icon={item.icon} alt={item.name} />
                            </div>
                            <div className="flex-grow">
                              <div className="font-bold">{item.name}</div>
                              <div className="text-xs capitalize">{item.rarity} {item.type}</div>
                            </div>
                            <div className="text-game-gold">{item.value} gold</div>
                            <div className="text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                              {item.tier ? `T${item.tier}` : '-'}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        </DragDropContext>
        
        <div className="flex justify-between items-center pt-2 border-t border-game-brown">
          <div className="font-bold">{t("totalItems")}: {filteredItems.length}</div>
          <div className="font-bold text-game-gold">{t("estValue")}: {totalValue} {t("gold")}</div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
