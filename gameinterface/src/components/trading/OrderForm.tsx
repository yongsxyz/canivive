import React, { useState, useEffect } from "react";
import { Item } from "@/types/items";
import { getSuggestedPrices } from "./marketUtils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface OrderFormProps {
  type: "buy" | "sell";
  item: Item;
  onPlaceOrder: (type: "buy" | "sell", quantity: number, price: number) => void;
  playerGold?: number;
  playerItemCount?: number;
}

const OrderForm: React.FC<OrderFormProps> = ({
  type,
  item,
  onPlaceOrder,
  playerGold,
  playerItemCount
}) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(item.value);
  const [total, setTotal] = useState(item.value);

  // Get suggested prices when item changes
  useEffect(() => {
    const suggestedPrices = getSuggestedPrices(item);
    setPrice(type === 'buy' ? suggestedPrices.buy : suggestedPrices.sell);
  }, [item, type]);

  // Update total when quantity or price changes
  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    if (price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    onPlaceOrder(type, quantity, price);
  };

  const maxQuantity = type === 'buy' && playerGold
    ? Math.floor(playerGold / price)
    : type === 'sell' && playerItemCount
      ? playerItemCount
      : 999;

  return (
    <div className="w-full bg-black bg-opacity-20 rounded-md border border-game-secondary p-3">
      <div className="font-bold text-sm mb-2">
        {type === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1">Quantity (Max: {maxQuantity})</label>
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, maxQuantity))}
            className="game-search w-full"
          />
        </div>

        <div>
          <label className="block text-xs mb-1">Price per Item (gold)</label>
          <input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value) || 1)}
            className="game-search w-full"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {type === 'buy' ? 'Suggested buy price:' : 'Suggested sell price:'} {type === 'buy' ? getSuggestedPrices(item).buy : getSuggestedPrices(item).sell} gold
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs font-semibold">Total:</div>
            <div className="text-game-gold font-bold">{total} gold</div>
          </div>

          <Button
            variant="default"
            size="sm"
            type="submit"
            className={`${type === 'buy' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'} font-bold transition-colors`}
          >
            Place {type === 'buy' ? 'Buy' : 'Sell'} Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;