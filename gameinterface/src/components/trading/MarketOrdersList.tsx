import React from "react";
import { Item } from "@/types/items";
import { TrashIcon } from "lucide-react";
import { getRarityClass } from "@/utils/inventoryManager";
import { ItemIcon } from "@/data/icon";

interface MarketOrdersListProps {
  type: "buy" | "sell";
  orders: ({ item: Item, price: number, quantity: number, originalIndex: number })[];
  onCancelOrder: (type: "buy" | "sell", index: number) => void;
}

const MarketOrdersList: React.FC<MarketOrdersListProps> = ({
  type,
  orders,
  onCancelOrder
}) => {
  const handleCancel = (index: number) => {
    onCancelOrder(type, index);
  };

  return (
    <div className="w-full bg-black bg-opacity-20 rounded-md border border-game-secondary">
      <div className="p-2 text-sm font-bold text-game-gold border-b border-game-secondary">
        {type === 'buy' ? 'Your Buy Orders' : 'Your Sell Orders'}
      </div>
      <div className="h-[200px] overflow-x-hidden scrollbar scrollbar-thin">
        {orders.length > 0 ? (
          <div className="divide-y divide-game-secondary">
            {orders.map((order, index) => (
              <div key={index} className="p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`game-item ${getRarityClass(order.item.rarity)} w-10 h-10 flex items-center justify-center item-${order.item.rarity}`}>
            
                    <ItemIcon icon={order.item.icon} alt={order.item.name} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{order.item.name}</div>
                    <div className="text-xs">{order.quantity}x at {order.price} gold each</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-game-gold font-medium">
                    {order.price * order.quantity} gold
                  </div>
                  <button
                    onClick={() => handleCancel(order.originalIndex)}

                    className="p-1 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No {type} orders placed
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOrdersList;
