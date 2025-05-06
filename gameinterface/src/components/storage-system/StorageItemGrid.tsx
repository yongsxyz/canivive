// StorageItemGrid.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Weight } from "lucide-react";
import { Item } from "@/types/items";
import ItemTooltip from "../character/ItemTooltip";
import { ItemIcon } from "@/data/icon";
interface StorageItemGridProps {
    items: Item[];
    onItemClick: (itemId: string) => void;
}

const StorageItemGrid: React.FC<StorageItemGridProps> = ({ items, onItemClick }) => {
    // Calculate total weight for all items
    const totalWeight = items.reduce((sum, item) => {
        return sum + (item.weight || 0) * (item.count || 1);
    }, 0);

    // Calculate weight for individual item
    const getItemWeight = (item: Item) => {
        return (item.weight || 0) * (item.count || 1);
    };

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

    // Tooltips state
    const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnterItem = (item: Item, e: React.MouseEvent) => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);

        tooltipTimeoutRef.current = setTimeout(() => {
            setHoveredItem(item);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
            setShowTooltip(true);
        }, 100);
    };

    const handleMouseLeaveItem = useCallback(() => {
        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        setShowTooltip(false);
        setHoveredItem(null);
    }, []);

    const handleMouseMoveTooltip = useCallback((e: React.MouseEvent) => {
        if (showTooltip) {
            requestAnimationFrame(() => {
                setTooltipPosition({ x: e.clientX, y: e.clientY });
            });
        }
    }, [showTooltip]);

    return (
        <div className="storage-grid-container">
            {/* Total Weight Display */}
            <div className="total-weight-display mb-2 px-2 py-1 bg-gray-800 rounded-md text-sm flex items-center">
                <Weight size={16} className="mr-2 text-yellow-400" />
                <span className="font-medium">Total Weight:</span>
                <span className="ml-1 font-bold">
                    {totalWeight.toFixed(1)} kg
                </span>
                <span className="ml-2 text-gray-400">
                    ({items.length} items)
                </span>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 min-h-[300px] p-2 bg-game-dark bg-opacity-40 rounded-md overflow-y-auto max-h-[600px] pr-2 scrollbar scrollbar-thin">
                {items.map((item) => {
                    const itemWeight = getItemWeight(item);

                    return (
                        <div
                            key={item.id}
                            onMouseEnter={(e) => handleMouseEnterItem(item, e)}
                            onMouseMove={handleMouseMoveTooltip}
                            onMouseLeave={handleMouseLeaveItem}
                            className="cursor-pointer"
                            onClick={() => onItemClick(item.id)}
                        >
                            <div className={`game-item ${getRarityClass(item.rarity)} w-full aspect-square flex items-center justify-center text-2xl relative cursor-pointer hover:brightness-110`}>
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

                                <div className="absolute bottom-1 left-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center border border-gray-600">
                                    <Weight size={10} className="mr-1" />
                                    {itemWeight.toFixed(1)}
                                </div>

                                {item.durability !== undefined && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700/80">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-300"
                                            style={{ width: `${item.durability}%` }}
                                        />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-all duration-300" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Item Tooltip */}
            {showTooltip && hoveredItem && (
                <ItemTooltip
                    item={hoveredItem}
                    mousePosition={tooltipPosition}
                />
            )}
        </div>
    );
};

export default StorageItemGrid;