import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Item } from "@/types/items";
import { Progress } from "@/components/ui/progress";
import { Shield, Heart, Swords, Coffee, Droplet, Zap, Smile, Clock, Award } from "lucide-react";
import { ItemIcon } from "@/data/icon";
interface ItemTooltipProps {
  item: Item;
  mousePosition: { x: number; y: number };
  triggerRef?: React.RefObject<HTMLElement>;
}

const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, mousePosition, triggerRef }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const [debouncedPosition, setDebouncedPosition] = useState(mousePosition);
  const [isVisible, setIsVisible] = useState(false);

  // Debounce mouse position updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPosition(mousePosition);
    }, 30);
    return () => clearTimeout(handler);
  }, [mousePosition]);

  // Positioning logic dengan requestAnimationFrame
  useEffect(() => {
    if (!tooltipRef.current) return;

    const timer = setTimeout(() => setIsVisible(true), 100);

    const calculatePosition = () => {
      requestAnimationFrame(() => {
        const { x, y } = debouncedPosition;
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let adjustedX = x + 15;
        let adjustedY = y + 15;

        if (x + tooltipWidth > windowWidth) adjustedX = x - tooltipWidth - 5;
        if (y + tooltipHeight > windowHeight) adjustedY = y - tooltipHeight - 5;
        if (adjustedX < 5) adjustedX = 5;
        if (adjustedY < 5) adjustedY = 5;

        setAdjustedPosition({ x: adjustedX, y: adjustedY });
      });
    };

    calculatePosition();

    const resizeHandler = () => requestAnimationFrame(calculatePosition);
    window.addEventListener('resize', resizeHandler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [debouncedPosition]);

  // Positioning logic
  useEffect(() => {
    if (!tooltipRef.current) return;

    const timer = setTimeout(() => setIsVisible(true), 500);

    const calculatePosition = () => {
      const { x, y } = mousePosition;
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let adjustedX = x + 15; // Offset from cursor
      let adjustedY = y + 15;

      // Adjust for right edge
      if (x + tooltipWidth > windowWidth) {
        adjustedX = x - tooltipWidth - 5;
      }

      // Adjust for bottom edge
      if (y + tooltipHeight > windowHeight) {
        adjustedY = y - tooltipHeight - 5;
      }

      // Adjust for left edge
      if (adjustedX < 5) {
        adjustedX = 5;
      }

      // Adjust for top edge
      if (adjustedY < 5) {
        adjustedY = 5;
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    };

    calculatePosition();

    window.addEventListener('resize', calculatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [mousePosition]);

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'damage': return <Swords size={14} className="text-red-500" />;
      case 'health': return <Heart size={14} className="text-green-500" />;
      case 'armor': return <Shield size={14} className="text-blue-500" />;
      case 'hungry': return <Coffee size={14} className="text-amber-500" />;
      case 'thirst': return <Droplet size={14} className="text-cyan-500" />;
      case 'stamina': return <Zap size={14} className="text-yellow-500" />;
      case 'mood': return <Smile size={14} className="text-pink-500" />;
      default: return null;
    }
  };

  const getStatColor = (value: number) => {
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-game-gold';
      default: return 'text-gray-300';
    }
  };

  const renderStats = (stats: any, title: string) => {
    if (!stats || Object.keys(stats).length === 0) return null;

    return (
      <div className="mt-3 border-t border-gray-600 pt-2">
        <p className="text-xs font-semibold mb-2 text-gray-300 truncate" title={title}>
          {title}:
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {Object.entries(stats).map(([stat, value]) => {
            if (value === undefined) return null;
            const numericValue = Number(value);
            const statName = stat.charAt(0).toUpperCase() + stat.slice(1);

            return (
              <div key={stat} className="flex items-start gap-2 min-w-0">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatIcon(stat)}
                </div>
                <div className="min-w-0">
                  <p className={`${getStatColor(numericValue)} truncate`} title={`${statName}: ${numericValue}`}>
                    <span className="font-medium">
                      {numericValue > 0 ? '+' : ''}{numericValue}
                    </span>
                    {' '}
                    <span className="truncate">{statName}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBuffDurations = () => {
    if (!item.buffDuration || Object.keys(item.buffDuration).length === 0) return null;

    return (
      <div className="mt-3 border-t border-gray-600 pt-2">
        <p className="text-xs font-semibold mb-2 text-gray-300 truncate">
          Buff Duration:
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-2">
          {Object.entries(item.buffDuration).map(([stat, duration]) => (
            <div
              key={stat}
              className="flex items-center gap-2 bg-gray-800/40 p-2 rounded-md hover:bg-gray-800/60 transition-colors"
            >
              {getStatIcon(stat)}
              <div className="flex-1 min-w-0">
                <div className="text-blue-300 text-xs sm:text-sm truncate">
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}
                </div>
              </div>
              <span className="text-blue-300 text-xs sm:text-sm font-medium bg-blue-900/20 px-2 py-1 rounded">
                {duration} min
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={`p-4 max-w-xs w-full bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-md shadow-lg border-l-4 z-[9999] transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      style={{
        borderLeftColor: getRarityColor(item.rarity).replace('text-', ''),
        position: 'fixed',
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
        pointerEvents: 'none'
      }}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="bg-gray-800 rounded-md p-2 flex items-center justify-center">
          <span className="text-2xl"><ItemIcon icon={item.icon} alt={item.name} /></span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-white">{item.name}</h3>
            {item.tier && (
              <span className="bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded-full">
                T{item.tier}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`capitalize text-xs ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </span>
            <span className="text-xs text-gray-400">
              {item.type === 'accessory'
                ? 'Accessories'
                : item.type === 'armor'
                  ? item.armorType
                  : item.type}
            </span>


          </div>
        </div>
      </div>

      {item.enchantment && (
        <div className="mt-2 text-sm text-purple-300 italic flex items-center gap-1.5">
          <Award size={14} />
          <span>Enchantment: {item.enchantment}</span>
        </div>
      )}

      {item.type !== 'food' && item.type !== 'potion' && renderStats(item.stats, "Stats")}
      {(item.type === 'food' || item.type === 'potion') && renderStats(item.consumableStats, "When Consumed")}
      {item.type === 'potion' && renderBuffDurations()}

      {item.durability !== undefined && (
        <div className="mt-3 border-t border-gray-600 pt-2">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-300">Durability:</span>
            <span className={item.durability > 50 ? "text-green-400" : item.durability > 25 ? "text-yellow-400" : "text-red-400"}>
              {item.durability}%
            </span>
          </div>
          <Progress
            value={item.durability}
            className="h-2 bg-gray-700"
            indicatorClassName={item.durability > 50 ? "bg-green-500" : item.durability > 25 ? "bg-yellow-500" : "bg-red-500"}
          />
        </div>
      )}

      <div className="mt-3 border-t border-gray-600 pt-2 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {item.weight && `Weight: ${item.weight} kg`}
          {item.count && item.count > 1 && ` × ${item.count}`}
        </div>
        <p className="text-game-gold font-bold">{item.value} gold</p>
      </div>
    </div>
  );

  return createPortal(tooltipContent, document.body);
};

export default ItemTooltip;