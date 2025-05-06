
import React, { useRef, useState } from "react";
import { Item } from "@/types/items";
import { X } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ItemTooltip from "./ItemTooltip";
import { getRarityClass } from "@/utils/inventoryManager";
import { ItemIcon } from "@/data/icon";

interface EquipmentSlotProps {
  slotId: string;
  name: string;
  icon: React.ReactNode;
  item: Item | null;
  onUnequip?: (slotId: string) => void;
}

const EquipmentSlot: React.FC<EquipmentSlotProps> = ({
  slotId,
  name,
  icon,
  item,
  onUnequip
}) => {
  const handleDoubleClick = () => {
    if (item && onUnequip) {
      onUnequip(slotId);
    }
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative">
      <div
        ref={itemRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseMove={handleMouseMove}
        className={`equipment-slot ${item ? 'filled' : ''}`}
        data-slot-id={slotId}
        onDoubleClick={handleDoubleClick}
      >
        {item ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`game-item ${getRarityClass(item.rarity)} w-full h-full flex items-center justify-center`}>
                  <div className="relative ">
                  <ItemIcon icon={item.icon} alt={item.name} />
                  </div>
                </div>
              </TooltipTrigger>

              {showTooltip && (
                <ItemTooltip
                  item={item}
                  mousePosition={mousePosition}
                  triggerRef={itemRef}
                />
              )}

            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="empty-slot flex items-center justify-center opacity-50">
            {icon}
          </div>

        )}
      </div>
      <div className="text-center mt-1">
        {name}
      </div>
    </div>
  );
};

export default EquipmentSlot;
