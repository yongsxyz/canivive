import React, { useState, useEffect } from "react";
import { ArrowUp, Weight, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Item } from "@/types/items";
import ItemTooltip from "@/components/character/ItemTooltip";
import { getRarityClass } from "@/utils/inventoryManager";
import { ItemIcon } from "@/data/icon";

interface LootContainerProps {
    items: Item[];
    onTakeItem: (item: Item) => void;
    onTakeAll: () => void;
}


const LootContainer: React.FC<LootContainerProps> = ({ items, onTakeItem, onTakeAll }) => {

    // Tooltips
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const handleMouseEnterItem = (item: Item, e: React.MouseEvent) => {
        setHoveredItem(item);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
        setShowTooltip(true);
    };

    const handleMouseMoveTooltip = (e: React.MouseEvent) => {
        if (showTooltip) {
            setTooltipPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseLeaveItem = () => {
        setShowTooltip(false);
        setHoveredItem(null);
    };
    
    const totalItems = items?.length || "";


    return (
        <div className="game-ui mt-4 game-ui mt-4 w-full md:w-[30%] transform  origin-top-left mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Package className="text-game-gold" size={20} />
                    <h2 className="text-xl font-bold text-game-primary">Loot Chest</h2>
                </div>
                {items.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 hover:bg-game-tertiary hover:scale-105 transition-all duration-200"
                        onClick={onTakeAll}
                    >
                        <ArrowUp size={14} className="text-game-gold animate-pulse" />
                        Take All ({totalItems})
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2 max-h-[600px] md:max-h-[600px] overflow-y-auto pr-2 scrollbar scrollbar-thin">
                {items.map((item) => {
                    const totalItemWeight = item.weight ? item.weight * (item.count || 1) : 0;

                    return (

                        <div
                            className={`
              game-item ${getRarityClass(item.rarity)} 
              hover:scale-105 transition-all duration-200 ease-out
              rounded-md overflow-hidden
              shadow-md hover:shadow-lg
              bg-gradient-to-br from-gray-800 to-gray-900
                            w-full aspect-square flex items-center justify-center text-2xl relative 
                  `}
                            onMouseEnter={(e) => handleMouseEnterItem(item, e)}
                            onMouseMove={handleMouseMoveTooltip}
                            onMouseLeave={handleMouseLeaveItem}
                            onDoubleClick={() => {
                                onTakeItem(item);
                                toast({
                                    title: "Item Looted",
                                    description: `${item.name} has been added to your inventory.`
                                });
                            }}
                        >
                            <div className="z-10 p-1 flex items-center justify-center">
                                <ItemIcon icon={item.icon} alt={item.name} />
                            </div>

                            {item.tier && (
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-gray-600">
                                    T{item.tier}
                                </div>
                            )}

                            {item.count && item.count > 1 && (
                                <div className="absolute top-1 right-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-gray-600">
                                    ×{item.count}
                                </div>
                            )}

                            {item.weight && (
                                <div className="absolute bottom-1 left-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center border border-gray-600">
                                    <Weight size={10} className="mr-1" />
                                    {totalItemWeight.toFixed(1)}
                                </div>
                            )}

                        </div>
                    );
                })}
                {/* DISINI  */}
                {showTooltip && hoveredItem && (
                    <ItemTooltip
                        item={hoveredItem}
                        mousePosition={tooltipPosition}
                    />
                )}

            </div>
        </div>
    );
};

export default LootContainer;