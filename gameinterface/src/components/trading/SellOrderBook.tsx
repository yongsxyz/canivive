import React from "react";
import { Item } from "@/types/items";
import { Button } from "@/components/ui/button";
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

// Helper function to merge identical orders
const mergeOrders = (orders: MarketOrderEntry[]): MarketOrderEntry[] => {
  const mergedMap = new Map<string, MarketOrderEntry>();
  
  orders.forEach(order => {
    const key = `${order.item.id}|${order.price}|${order.owner}`;
    
    if (mergedMap.has(key)) {
      // Update quantity for existing order
      const existingOrder = mergedMap.get(key)!;
      existingOrder.quantity += order.quantity;
    } else {
      // Add new order to map
      mergedMap.set(key, { ...order });
    }
  });
  
  return Array.from(mergedMap.values());
};

const MarketOrderBook: React.FC<MarketOrderBookProps> = ({
  orders,
  type,
  currentUser,
  onOrderAction,
}) => {

  const entries = type === "buy" ? orders.sell : orders.buy;
  
  // Merge identical orders
  const mergedEntries = mergeOrders(entries);
  
  return (
    <div className="w-full bg-black bg-opacity-20 rounded-md border border-game-secondary">
      <div className="p-2 text-sm font-bold text-game-gold border-b border-game-secondary">
        {type === "buy" ? "Buy Order Book (Market)" : "Sell Order Book (Market)"}
      </div>
      <div className="h-[200px] overflow-y-auto">
        {mergedEntries.length > 0 ? (
          <div className="divide-y divide-game-secondary">
            {mergedEntries.map((order, index) => (
              <div key={`${order.item.id}-${order.price}-${order.owner}-${index}`} className="p-2 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 flex items-center justify-center item-${order.item.rarity}`}>
                  <ItemIcon icon={order.item.icon} alt={order.item.name} />
                  </div>
                  <div>
                    <div className="font-medium">{order.item.name}</div>
                    <div className="text-xs">{order.quantity}x @ {order.price} gold</div>
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
