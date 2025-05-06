
import React, { useState } from "react";
import { Item } from "@/types/items";
import { Button } from "@/components/ui/button";
import { getRarityClass } from "@/utils/inventoryManager";
import ItemTooltip from "@/components/character/ItemTooltip";
import { ItemIcon } from "@/data/icon";
interface MarketOrderEntry {
  item: Item;
  price: number;
  quantity: number;
  owner: string;
}

interface MarketOrderBookProps {
  orders: {
    buy: MarketOrderEntry[];
    sell: MarketOrderEntry[];
  };
  type: "buy" | "sell";
  currentUser: string;
  onOrderAction: (
    orderType: "buy" | "sell",
    orderIndex: number
  ) => void;
}





const MarketOrderBook: React.FC<MarketOrderBookProps> = ({
  orders,
  type,
  currentUser,
  onOrderAction,
}) => {

  const entries = type === "buy" ? orders.sell : orders.buy;


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

  return (
    <div className="w-full bg-black bg-opacity-20 rounded-md border border-game-secondary">
      <div className="p-2 text-sm font-bold text-game-gold border-b border-game-secondary">
        {type === "buy" ? "Buy Order Book (Market)" : "Sell Order Book (Market)"}
      </div>
      <div className="h-[200px] overflow-x-hidden scrollbar scrollbar-thin">
        {entries.length > 0 ? (
          <div className="divide-y divide-game-secondary">
            {entries.map((order, index) => (
              <div key={index} className="p-2 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div onMouseEnter={(e) => handleMouseEnterItem(order.item, e)}
                    onMouseMove={handleMouseMoveTooltip}
                    onMouseLeave={handleMouseLeaveItem} className={`w-10 h-10 flex items-center justify-center game-item ${getRarityClass(order.item.rarity)} `}><ItemIcon icon={order.item.icon} alt={order.item.name} /> </div>
                  <div>
                    <div className="font-medium">{order.item.name}</div>
                    <div className="text-xs">{order.quantity}x * {order.price} gold</div>
                    <div className="text-[10px] text-game-primary italic">by {order.owner === currentUser ? "You" : order.owner}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {type === "buy" ? (
                    <Button size="sm"
                      disabled={order.owner === currentUser}
                      onClick={() => onOrderAction("buy", index)}
                      variant="default">
                      Buy
                    </Button>
                  ) : (
                    <Button size="sm"
                      disabled={order.owner === currentUser}
                      onClick={() => onOrderAction("sell", index)}
                      variant="default">
                      Sell
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {/* DISINI  */}
            {showTooltip && hoveredItem && (
              <ItemTooltip
                item={hoveredItem}
                mousePosition={tooltipPosition}
              />
            )}
          </div>

        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No market orders
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOrderBook;
