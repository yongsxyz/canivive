import React, { useState, useRef, useEffect, useCallback } from "react";
import { Item } from "@/types/items";

import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Move, Weight, Trash, ArrowDown, Split, Layers, X, ArrowUp, CirclePlay, Trash2, LayoutPanelTop, Table, Grid3x3 } from "lucide-react";
import ItemTooltip from "./ItemTooltip";
import Modal from "react-modal";
import { useSound } from '@/hooks/useSounds';

import { ItemIcon } from "@/data/icon";


import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRarityClass } from "@/utils/inventoryManager";
import { queueToast } from "@/utils/toastManager";

Modal.setAppElement('#root');

interface InventoryGridProps {
  items: Item[];
  viewMode: "grid" | "list";
  onEquipItem?: (itemId: string) => void;
  onUseItem?: (itemId: string) => void;
  onDropItem?: (itemId: string) => void;
  onTrashItem?: (itemId: string) => void;
  onSplitItem?: (itemId: string, amount: number) => void;
  onMoveItem?: (fromIndex: number, toIndex: number) => void;
  cooldownActive?: boolean;
  onStackAllItems?: () => void;
  onUnstackAllItems?: () => void;
  inventoryOptions?: {
    maxSlots: number;
    maxWeight: number;
    currentWeight: number;
    totalItems: number;
  };
  isStorageOpen?: boolean; 
  onMoveToStorage?: (itemId: string) => void; 
}

interface DragInfo {
  isDragging: boolean;
  itemIndex: number | null;
  draggedItem: Item | null;
  initialX: number;
  initialY: number;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({
  items,
  viewMode,
  onEquipItem,
  onUseItem,
  onDropItem,
  onTrashItem,
  onSplitItem,
  onMoveItem,
  onStackAllItems,
  onUnstackAllItems,
  cooldownActive,
  inventoryOptions,
  isStorageOpen,
  onMoveToStorage
}) => {
  
  // Fixed values instead of props
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitItemId, setSplitItemId] = useState<string | null>(null);
  const [splitAmount, setSplitAmount] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isProcessingSplit, setIsProcessingSplit] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);



  // Tooltips
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterItem = (item: Item, e: React.MouseEvent) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    if (dragInfo.isDragging) return;

    tooltipTimeoutRef.current = setTimeout(() => {
      setHoveredItem(item);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
      setShowTooltip(true);
    }, 100);
  };

  const handleMouseLeaveItem = useCallback(() => {
    if (dragInfo.isDragging) return;
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(false);
    setHoveredItem(null);
  }, []);

  const handleMouseMoveTooltip = useCallback((e: React.MouseEvent) => {
    if (dragInfo.isDragging) return;
    if (showTooltip) {
      requestAnimationFrame(() => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      });
    }
  }, [showTooltip]);


  const [dragInfo, setDragInfo] = useState<DragInfo>({
    isDragging: false,
    itemIndex: null,
    draggedItem: null,
    initialX: 0,
    initialY: 0
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [isDropAnimating, setIsDropAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items]);

  useEffect(() => {
    const cleanup = () => {
      setDragInfo({
        isDragging: false,
        itemIndex: null,
        draggedItem: null,
        initialX: 0,
        initialY: 0
      });
      setDropTarget(null);
      setIsDropAnimating(false);
      resetSplitState();
    };

    return cleanup;
  }, []);

  useEffect(() => {
    if (splitModalOpen || contextMenuOpen) {
      setDragInfo({
        isDragging: false,
        itemIndex: null,
        draggedItem: null,
        initialX: 0,
        initialY: 0
      });
    }
  }, [splitModalOpen, contextMenuOpen]);

  const calculateEmptyCells = () => {
    if (viewMode !== "grid" || !inventoryOptions) return [];
    const totalSlots = Math.min(50, inventoryOptions.maxSlots);
    const itemCount = items.length;
    const emptyCells = Math.max(0, totalSlots - itemCount);
    return Array(emptyCells).fill(null);
  };

  const emptyCells = calculateEmptyCells();

  const handleSplitClick = (item: Item) => {
    if (isProcessingSplit) return;

    if (!item.count || item.count <= 1 || !item.stackable) {
      queueToast(
        "Cannot Split Item",
        "This item cannot be split.",
        "destructive"
      );
      return;
    }

    setDragInfo({
      isDragging: false,
      itemIndex: null,
      draggedItem: null,
      initialX: 0,
      initialY: 0
    });

    setSelectedItem(item);
    setSplitItemId(item.id);
    setSplitAmount(Math.floor(item.count / 2));
    setSplitModalOpen(true);
  };

  const handleSplitConfirm = () => {
    if (isProcessingSplit || !splitItemId || !onSplitItem || !selectedItem) return;

    try {
      setIsProcessingSplit(true);
      const maxAmount = (selectedItem.count || 1) - 1;
      const validAmount = Math.max(1, Math.min(maxAmount, splitAmount));

      onSplitItem(splitItemId, validAmount);

      resetSplitState();

    } catch (error) {
      console.error("Error in split operation:", error);
      queueToast(
        "Split Failed",
        "There was an error splitting the item stack.",
        "destructive"
      );
    } finally {
      setIsProcessingSplit(false);
    }
  };

  const handleSplitCancel = () => {
    if (isProcessingSplit) return;
    resetSplitState();
  };

  const resetSplitState = () => {
    setSplitModalOpen(false);
    setSplitItemId(null);
    setSelectedItem(null);
    setSplitAmount(1);
    setIsProcessingSplit(false);

    setDragInfo({
      isDragging: false,
      itemIndex: null,
      draggedItem: null,
      initialX: 0,
      initialY: 0
    });
  };

  const handleStackAll = () => {
    if (onStackAllItems) {
      setDragInfo({
        isDragging: false,
        itemIndex: null,
        draggedItem: null,
        initialX: 0,
        initialY: 0
      });

      onStackAllItems();
      queueToast(
        "Items Stacked",
        "All stackable items have been combined."
      );
    }
  };

  const handleUnstackAll = () => {
    if (onUnstackAllItems) {
      setDragInfo({
        isDragging: false,
        itemIndex: null,
        draggedItem: null,
        initialX: 0,
        initialY: 0
      });

      onUnstackAllItems();
      queueToast(
        "Items Unstacked",
        "All stacked items have been separated."
      );
    }
  };

  const handleMouseDown = (event: React.MouseEvent, index: number, item: Item) => {
    if (event.button !== 0 || splitModalOpen || isProcessingSplit || contextMenuOpen) return;

    event.preventDefault();

    const uniqueId = `${item.id}-drag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const uniqueItem = {
      ...item,
      _dragId: uniqueId
    };

    setDragInfo({
      isDragging: true,
      itemIndex: index,
      draggedItem: uniqueItem,
      initialX: event.clientX,
      initialY: event.clientY
    });

    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const findDropTarget = (x: number, y: number): number | null => {
    if (!containerRef.current) return null;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const itemRef = itemRefs.current[i];
      if (!itemRef) continue;

      const rect = itemRef.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return i;
      }
    }

    const emptySlots = containerRef.current.querySelectorAll('.game-item-empty');
    for (let i = 0; i < emptySlots.length; i++) {
      const rect = emptySlots[i].getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return items.length + i;
      }
    }

    return null;
  };

  useEffect(() => {

    if (!dragInfo.isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (dragInfo.isDragging) {
        setMousePosition({
          x: event.clientX,
          y: event.clientY
        });

        const currentDropTarget = findDropTarget(event.clientX, event.clientY);
        setDropTarget(currentDropTarget);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!dragInfo.isDragging) return;

      const dropTarget = findDropTarget(event.clientX, event.clientY);

      if (dragInfo.itemIndex !== null && dropTarget !== null && dropTarget !== dragInfo.itemIndex) {
        setIsDropAnimating(true);

        setTimeout(() => {
          if (onMoveItem) {
            onMoveItem(dragInfo.itemIndex!, dropTarget);
          }
          setIsDropAnimating(false);

          setDragInfo({
            isDragging: false,
            itemIndex: null,
            draggedItem: null,
            initialX: 0,
            initialY: 0
          });
          setDropTarget(null);
        }, 200);
      } else {
        setIsDropAnimating(false);
        setDragInfo({
          isDragging: false,
          itemIndex: null,
          draggedItem: null,
          initialX: 0,
          initialY: 0
        });
        setDropTarget(null);
      }
    };

    if (dragInfo.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo, onMoveItem]);

  const renderDraggedItem = () => {
    if (!dragInfo.isDragging || !dragInfo.draggedItem) return null;

    const draggedItem = dragInfo.draggedItem;
    const isStackable = draggedItem.stackable && (draggedItem.count || 0) > 1;
    const totalItemWeight = draggedItem.weight ? draggedItem.weight * (draggedItem.count || 1) : 0;

    const style = {
      position: 'fixed' as const,
      left: mousePosition.x - 30,
      top: mousePosition.y - 30,
      zIndex: 1000,
      opacity: 0.8,
      pointerEvents: 'none' as const,
      transform: 'scale(1.05)',
      transition: 'none',
      filter: 'none'
    };

    return (
      <div style={style} className={`game-item ${getRarityClass(draggedItem.rarity)} w-16 h-16 flex items-center justify-center text-2xl relative`}>
        <div><ItemIcon icon={draggedItem.icon} alt={draggedItem.name} /></div>
        {draggedItem.tier && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
            T{draggedItem.tier}
          </div>
        )}
        {draggedItem.count && draggedItem.count > 1 && (
          <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
            {draggedItem.count}
          </div>
        )}
        {draggedItem.weight && (
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded flex items-center">
            <Weight size={10} className="mr-0.5" />
            {totalItemWeight.toFixed(1)}
          </div>
        )}
        {draggedItem.durability !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 px-1">
            <Progress
              value={draggedItem.durability}
              className="h-1 bg-gray-700"
              indicatorClassName="bg-green-500"
            />
          </div>
        )}
      </div>
    );
  };

  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#1A1F2C',
      borderRadius: '0.5rem',
      border: '1px solid #9b87f5',
      padding: '1.5rem',
      maxWidth: '28rem',
      width: '100%',
    },
  };

  const handleGridChange = (size) => {
    if (containerRef.current) {
      const classUpdates = {
        6: { base: 1, sm: 4, md: 3, lg: 6 },
        8: { base: 2, sm: 4, md: 4, lg: 7 },
        10: { base: 3, sm: 4, md: 5, lg: 9 }
      };



      const updates = classUpdates[size];
      containerRef.current.className = containerRef.current.className
        .replace(/grid-cols-\d+/g, `grid-cols-${updates.base}`)
        .replace(/sm:grid-cols-\d+/g, `sm:grid-cols-${updates.sm}`)
        .replace(/md:grid-cols-\d+/g, `md:grid-cols-${updates.md}`)
        .replace(/lg:grid-cols-\d+/g, `lg:grid-cols-${updates.lg}`);

      //queueToast("Grid Size Changed", `Grid size changed to ${size}x${size}`);
    }
  };

  const playTickSound = useSound('/tick.wav');

  return (
    <div className="relative">
      {inventoryOptions && (
        <div className="mb-2 flex flex-col space-y-1">
          <div className="flex justify-between">
            <span >Slot: {inventoryOptions.totalItems}/{inventoryOptions.maxSlots}</span>
            <span>Berat: {inventoryOptions.currentWeight.toFixed(1)}/{inventoryOptions.maxWeight.toFixed(1)} kg</span>
          </div>
          <Progress
            value={(inventoryOptions.currentWeight / inventoryOptions.maxWeight) * 100}
            className="h-2 bg-gray-700"
            indicatorClassName="bg-green-500"
          />
        </div>
      )}

      <div className="flex justify-end mb-2 gap-2 flex-wrap">
        {/* Button Unstack dan Stack */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-initial flex items-center gap-1 hover:bg-game-tertiary hover:scale-105 transition-all duration-200"
            disabled={cooldownActive}
            onClick={handleUnstackAll}
          >
            <ArrowDown size={14} className="text-game-gold" />
            <span className="truncate">Unstack</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-initial flex items-center gap-1 hover:bg-game-tertiary hover:scale-105 transition-all duration-200"
            onClick={handleStackAll}
            disabled={cooldownActive}
          >
            <Layers size={14} className="text-game-gold" />
            <span className="truncate">Stack</span>
          </Button>
        </div>

        {/* Button Grid Controls */}
        <div className="flex gap-2 w-full sm:w-auto">
          {[6, 8, 10].map((size) => (
            <Button
              key={size}
              variant="outline"
              size="sm"
              className="flex-1 flex justify-center items-center hover:bg-game-tertiary hover:scale-105 transition-all duration-200"
              onClick={() => handleGridChange(size)}
            >
              {size === 6 && <LayoutPanelTop color="#ffd700" size={20} />}
              {size === 8 && <Table color="#ffd700" size={20} />}
              {size === 10 && <Grid3x3 color="#ffd700" size={20} />}
            </Button>
          ))}
        </div>
      </div>

      <div
        className={`${viewMode === "grid"
          ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 max-h-[600px] overflow-y-auto pr-2 scrollbar scrollbar-thin"
          : "flex flex-col gap-1 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 scrollbar scrollbar-thin"
          } ${items.length > 40
            ? "max-h-[600px] overflow-y-auto pr-2 scrollbar scrollbar-thin scrollbar-thumb-game-primary/70 scrollbar-track-game-dark hover:scrollbar-thumb-game-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full transition-colors"
            : ""
          }`}
        ref={containerRef}
      >
        {items.map((item, index) => {
          const handleEquip = () => {
            if (isStorageOpen && onMoveToStorage) {
              onMoveToStorage(item.id);
              return;
            }

            if (onEquipItem) {
              onEquipItem(item.id);
            }
          };

          const handleUse = () => {
            if (isStorageOpen && onMoveToStorage) {
              onMoveToStorage(item.id);
              return;
            }
          
            if (onUseItem && (item.type === "food" || item.type === "potion")) {
              onUseItem(item.id);
            }
          };

          const handleDrop = () => {
            if (onDropItem) {
              onDropItem(item.id);
            } else {
              queueToast(
                "Item Dropped",
                `${item.name} has been dropped to the ground.`,
                "destructive"
              );
            }
          };

          const handleTrash = () => {
            if (onTrashItem) {
              onTrashItem(item.id);
            } else {
              queueToast(
                "Item Trashed",
                `${item.name} has been permanently destroyed.`,
                "destructive"
              );
            }
          };

          const isConsumable = item.type === "food" || item.type === "potion";
          const isStackable = item.stackable && (item.count || 0) > 1;
          const totalItemWeight = item.weight ? item.weight * (item.count || 1) : 0;

          const isDragged = dragInfo.isDragging && dragInfo.itemIndex === index;
          const isDropping = index === dropTarget && !isDragged;

          const itemKey = `item-${item.id}-${index}-${isStackable ? item.count : ''}`;

          return (
            <div
              key={itemKey}
              ref={el => itemRefs.current[index] = el}
              onMouseEnter={(e) => handleMouseEnterItem(item, e)}
              onMouseMove={handleMouseMoveTooltip}
              onMouseLeave={handleMouseLeaveItem}

              onMouseDown={(e) => handleMouseDown(e, index, item)}
              className={`
                  
                  ${isDragged ? 'opacity-30' : 'opacity-100'} 
                  ${isDropping ? 'scale-90 z-10' : 'scale-100'}
                  transition-all duration-200
                `}
              onDoubleClick={isConsumable ? handleUse : handleEquip}
            >
              <ContextMenu onOpenChange={(open) => {
                setContextMenuOpen(open);
                if (open) {
                  setShowTooltip(false);
                  setHoveredItem(null);
                }
              }}>
                <ContextMenuTrigger asChild>
                  <div>
                    {viewMode === "grid" ? (


                      <div className={`
              game-item ${getRarityClass(item.rarity)} 
              w-full aspect-square flex items-center justify-center text-2xl relative 
              ${contextMenuOpen ? 'cursor-default' : 'cursor-grab'} 
              ${isDragged ? 'transform scale-110 opacity-80 z-50 shadow-xl' : ''} 
              ${isDropping ? 'ring-2 ring-primary-500' : ''}
              hover:scale-105 transition-all duration-200 ease-out
              rounded-md overflow-hidden
              shadow-md hover:shadow-lg
              bg-gradient-to-br from-gray-800 to-gray-900
            `}
                        onMouseEnter={playTickSound}
                      >
                        {/* Konten utama item */}
                        <div className="z-10 p-1 flex items-center justify-center">
                          <ItemIcon icon={item.icon} alt={item.name} />
                        </div>

                        {/* Badge tier di kanan bawah */}
                        {item.tier && (
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-gray-600">
                            T{item.tier}
                          </div>
                        )}

                        {/* Badge jumlah item di kanan atas */}
                        {item.count && item.count > 1 && (
                          <div className="absolute top-1 right-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-gray-600">
                            ×{item.count}
                          </div>
                        )}

                        {/* Berbadge item di kiri bawah */}
                        {item.weight && (
                          <div className="absolute bottom-1 left-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center border border-gray-600">
                            <Weight size={10} className="mr-1" />
                            {totalItemWeight.toFixed(1)}
                          </div>
                        )}

                        {/* Bar durability di bagian bawah */}
                        {item.durability !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700/80">
                            <div
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${item.durability}%` }}
                            />
                          </div>
                        )}

                        {/* Overlay efek hover */}
                        <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-all duration-300" />

                      </div>




                    ) : (
                      <div onMouseEnter={playTickSound} className={`
                          bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-md flex items-center gap-3 
                          ${contextMenuOpen ? 'cursor-default' : 'cursor-grab'} ${isDragged ? 'border-2 border-gray-500' : ''}
                          ${isDropping ? 'ring-2 ring-gray-500' : ''}
                          hover:bg-opacity-60 transition-all duration-200 relative
                        `}>
                        {/* Icon with count and durability */}
                        <div className={`game-item ${getRarityClass(item.rarity)} w-16 h-16 flex items-center justify-center relative flex-shrink-0`}>
                          <ItemIcon icon={item.icon} alt={item.name} />
                          {item.durability !== undefined && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700/80 rounded-b">
                              <div
                                className="h-full bg-green-500 transition-all duration-300 rounded-b"
                                style={{ width: `${item.durability}%` }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="font-bold text-base md:text-md truncate">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-400 flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="capitalize">{item.rarity} {item.type}</span>
                            {item.count > 1 && (
                              <span className="bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border border-gray-600 ">
                                ×{item.count}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                          <div className="text-game-gold text-sm sm:text-base whitespace-nowrap hidden sm:block">
                            {item.value} <span className="text-sm">gold</span>
                          </div>

                          {item.weight && (
                            <div className="flex items-center text-sm text-gray-300 whitespace-nowrap">
                              <Weight size={14} className="mr-1 text-gray-400" />
                              <span className="hidden sm:inline">{totalItemWeight.toFixed(1)} kg</span>
                              <span className="sm:hidden">{totalItemWeight.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="game-ui border-game-primary z-50">
                  <ContextMenuItem onClick={handleEquip} disabled={!onEquipItem} className="flex items-center gap-2">
                    <ArrowUp size={16} className="text-blue-400" />
                    Equip
                  </ContextMenuItem>
                  {isConsumable && (
                    <ContextMenuItem onClick={handleUse} disabled={!onUseItem} className="flex items-center gap-2">
                      <CirclePlay size={16} className="text-green-500" />
                      Use
                    </ContextMenuItem>
                  )}
                  <ContextMenuSeparator />
                  {isStackable && (
                    <ContextMenuItem onClick={() => handleSplitClick(item)} disabled={!onSplitItem || !item.stackable || (item.count || 0) <= 1} className="flex items-center gap-2">
                      <Split size={16} className="text-purple-400" />
                      Split Stack
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem onClick={handleDrop} className="text-orange-400 flex items-center gap-2">
                    <ArrowDown size={16} />
                    Drop
                  </ContextMenuItem>
                  <ContextMenuItem onClick={handleTrash} className="text-red-500 flex items-center gap-2">
                    <Trash2 size={16} />
                    Destroy
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          );
        })}

        {viewMode === "grid" && emptyCells.map((_, index) => (
          <div
            key={`empty-${index}`}
            className="game-item-empty w-full aspect-square border border-dashed border-gray-600 bg-gray-800 bg-opacity-30 rounded-md transform hover:scale-105 transition-transform duration-200"
          />
        ))}

      </div>

      {renderDraggedItem()}

      <Modal
        isOpen={splitModalOpen}
        onRequestClose={handleSplitCancel}
        style={customModalStyles}
        contentLabel="Split Stack Modal"
      // closeTimeoutMS={200}
      >
        <div className="text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-game-primary font-bold">Split Stack</h2>
            <button
              onClick={handleSplitCancel}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-300 mb-4">How many items do you want to split off?</p>

          {selectedItem && (
            <div className="flex items-center gap-4 mb-6 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
              <div className={`game-item ${getRarityClass(selectedItem.rarity)} w-16 h-16 flex items-center justify-center text-3xl relative shrink-0`}>
                {/* <div>{selectedItem.icon}</div> */}
                <ItemIcon icon={selectedItem.icon} alt={selectedItem.name} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedItem.name}</h3>
                <p className="text-sm text-gray-300 capitalize">{selectedItem.rarity} {selectedItem.type}</p>
                <p className="text-sm text-game-gold mt-1">Stack: {selectedItem.count}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Original Stack</span>
              <span className="text-sm font-bold">
                {selectedItem ? selectedItem.count! - splitAmount : 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">New Stack</span>
              <span className="text-sm font-bold text-game-primary">{splitAmount}</span>
            </div>

            <Slider
              min={1}
              max={Math.max(1, (selectedItem?.count || 2) - 1)}
              step={1}
              value={[splitAmount]}
              onValueChange={(value) => setSplitAmount(value[0])}
              className="w-full"
            />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSplitAmount(Math.max(1, splitAmount - 1))}
                disabled={splitAmount <= 1}
                className="h-8 w-8"
              >
                -
              </Button>
              <Input
                type="number"
                min={1}
                max={(selectedItem?.count || 1) - 1}
                value={splitAmount}
                onChange={(e) => setSplitAmount(Number(e.target.value))}
                className="w-20 h-8 bg-game-dark text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSplitAmount(Math.min((selectedItem?.count || 2) - 1, splitAmount + 1))}
                disabled={splitAmount >= ((selectedItem?.count || 2) - 1)}
                className="h-8 w-8"
              >
                +
              </Button>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleSplitCancel}
              disabled={isProcessingSplit}
              className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSplitConfirm}
              className="bg-game-primary hover:bg-game-secondary text-white"
              disabled={!selectedItem || isProcessingSplit || splitAmount < 1 || splitAmount >= (selectedItem?.count || 1)}
            >
              Split Stack
            </Button>
          </div>
        </div>
      </Modal>


      {showTooltip && !dragInfo.isDragging && !contextMenuOpen && hoveredItem && (
        <ItemTooltip
          item={hoveredItem}
          mousePosition={tooltipPosition}
        />
      )}

    </div>
  );
};

export default InventoryGrid;
