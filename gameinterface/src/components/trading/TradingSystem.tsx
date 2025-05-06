import React, { useState, useEffect, useCallback,useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Item } from "@/types/items";
import { generateMarketData } from "./marketUtils";
import PriceHistoryChart from "./PriceHistoryChart";
import MarketOrdersList from "./MarketOrdersList";
import OrderForm from "./OrderForm";
import MarketOrderBook from "./MarketOrderBook";
import { items } from "@/data/items";
import { ItemIcon } from "@/data/icon";

import ItemTooltip from "@/components/character/ItemTooltip";

import { useInventory } from "@/context/InventoryContext"; // Adjust the import path as needed
import { getRarityClass, useInventoryLimits } from "@/utils/inventoryManager";

interface TradingSystemProps {
  goldBalance?: number;
  onGoldBalanceChange?: (newBalance: number) => void;
}

interface MarketOrderEntry {
  item: Item;
  price: number;
  quantity: number;
  owner: string;
}

const CURRENT_USER = "You";
const MARKET_USERS = ["TraderJoe", "Sally", "NPCVendor", "Baz", "Alina"];

const TradingSystem: React.FC<TradingSystemProps> = ({
  goldBalance = 1000,
  onGoldBalanceChange
}) => {

  const { inventoryItems, setInventoryItems, updateInventoryAndStats, setInventoryOptions, inventoryOptions } = useInventory();
  const { wouldExceedSlotLimit } = useInventoryLimits();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);

  const [marketOrders, setMarketOrders] = useState<{
    buy: MarketOrderEntry[];
    sell: MarketOrderEntry[];
  }>({
    buy: [],
    sell: []
  });

  useEffect(() => {
    if (selectedItem) {
      const historyData = generateMarketData(selectedItem);
      setMarketData(historyData);
    }
  }, [selectedItem]);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" ? true : item.type === selectedType;
    const matchesRarity = selectedRarity === "all" ? true : item.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });


  const filteredAllItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" ? true : item.type === selectedType;
    const matchesRarity = selectedRarity === "all" ? true : item.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
  };

  const handleOrderAction = (type: "buy" | "sell", index: number) => {
    if (type === "buy") {

      const order = marketOrders.sell[index];
      const totalCost = order.price * order.quantity;

      if (totalCost > goldBalance) {
        toast({
          title: "Insufficient Gold",
          description: `Need ${totalCost} gold to buy this order.`,
          variant: "destructive",
        });
        return;
      }

      if (wouldExceedSlotLimit(inventoryItems, [order.item])) {
        toast({
          title: "Inventory Full",
          description: `Cannot add ${order.item.name}, inventory slots are full!`,
          variant: "destructive",
        });
        return;
      }

      let added = false;
      const newInv = [...inventoryItems];
      for (let i = 0; i < newInv.length; i++) {
        const it = newInv[i];
        if (it.id === order.item.id && it.stackable) {
          newInv[i] = {
            ...it,
            count: (it.count || 1) + order.quantity
          };
          added = true;
          break;
        }
      }
      if (!added) {
        const itemToAdd = { ...order.item, count: order.quantity };
        newInv.push(itemToAdd);
      }

      setInventoryItems(newInv);

      if (onGoldBalanceChange) onGoldBalanceChange(goldBalance - totalCost);

      setMarketOrders(prev => ({
        ...prev,
        sell: prev.sell.filter((o, idx) => idx !== index)
      }));

      updateInventoryAndStats(newInv);

      toast({
        title: "Purchased from Market",
        description: `Bought ${order.quantity}x ${order.item.name} for ${totalCost} gold!`
      });


    } else if (type === "sell") {
      const order = marketOrders.buy[index];
      const playerItemCount = inventoryItems.reduce((t, item) =>
        item.id === order.item.id ? t + (item.count || 1) : t, 0
      );

      if (playerItemCount < order.quantity) {
        toast({
          title: "Insufficient Items",
          description: `You only have ${playerItemCount}x ${order.item.name}`,
          variant: "destructive",
        });
        return;
      }

      let remaining = order.quantity;
      const updatedInventory = [...inventoryItems];

      for (let i = 0; i < updatedInventory.length && remaining > 0; i++) {
        if (updatedInventory[i].id === order.item.id) {
          const n = updatedInventory[i].count || 1;
          if (n <= remaining) {
            remaining -= n;
            updatedInventory.splice(i, 1);
            i--;
          } else {
            updatedInventory[i] = { ...updatedInventory[i], count: n - remaining };
            remaining = 0;
          }
        }
      }

      setInventoryItems(updatedInventory);
      setMarketOrders(prev => ({
        ...prev,
        buy: prev.buy.filter((o, idx) => idx !== index)
      }));
      if (onGoldBalanceChange) onGoldBalanceChange(goldBalance + (order.price * order.quantity));

      toast({
        title: "Item Sold to Market",
        description: `You sold ${order.quantity}x ${order.item.name} for ${order.price * order.quantity} gold!`
      });

    }
  };

  const handlePlaceOrder = (type: "buy" | "sell", quantity: number, price: number) => {
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Please select an item first",
        variant: "destructive",
      });
      return;
    }

    if (type === "buy") {
      const totalCost = price * quantity;
      if (totalCost > goldBalance) {
        toast({
          title: "Insufficient Gold",
          description: `You need ${totalCost} gold for this order.`,
          variant: "destructive",
        });
        return;
      }
      if (onGoldBalanceChange) {
        onGoldBalanceChange(goldBalance - totalCost);
      }

      setMarketOrders(prev => ({
        ...prev,
        buy: [...prev.buy, {
          item: selectedItem,
          price,
          quantity,
          owner: CURRENT_USER
        }]
      }));

      toast({
        title: "Buy Order Placed",
        description: `Order for ${quantity}x ${selectedItem.name} at ${price} gold each`
      });

    } else if (type === "sell") {
      const playerItemCount = inventoryItems.reduce((total, item) => {
        if (item.id === selectedItem.id) {
          return total + (item.count || 1);
        }
        return total;
      }, 0);

      if (playerItemCount < quantity) {
        toast({
          title: "Insufficient Items",
          description: `You only have ${playerItemCount}x ${selectedItem.name}`,
          variant: "destructive",
        });
        return;
      }
      let remainingToRemove = quantity;
      const updatedInventory = [...inventoryItems];
      for (let i = 0; i < updatedInventory.length && remainingToRemove > 0; i++) {
        if (updatedInventory[i].id === selectedItem.id) {
          const itemCount = updatedInventory[i].count || 1;
          if (itemCount <= remainingToRemove) {
            remainingToRemove -= itemCount;
            updatedInventory.splice(i, 1);
            i--;
          } else {
            updatedInventory[i] = {
              ...updatedInventory[i],
              count: itemCount - remainingToRemove
            };
            remainingToRemove = 0;
          }
        }
      }


      setInventoryItems(updatedInventory);
      updateInventoryAndStats(updatedInventory);

      setMarketOrders(prev => ({
        ...prev,
        sell: [...prev.sell, {
          item: selectedItem,
          price,
          quantity,
          owner: CURRENT_USER
        }]
      }));

      toast({
        title: "Sell Order Placed",
        description: `Order for ${quantity}x ${selectedItem.name} at ${price} gold each`
      });
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setMarketOrders((prev) => {
        const exists = prev.buy.some(o => o.item.id === selectedItem.id)
          || prev.sell.some(o => o.item.id === selectedItem.id);
        if (exists) return prev;
        const buyOrders = [];
        const sellOrders = [];

        for (let i = 0; i < 3; i++) {
          buyOrders.push({
            item: selectedItem,
            price: Math.round(selectedItem.value * (0.9 + Math.random() * 0.15)),
            quantity: Math.floor(Math.random() * 3) + 1,
            owner: MARKET_USERS[Math.floor(Math.random() * MARKET_USERS.length)]
          });
        }
        for (let i = 0; i < 3; i++) {
          sellOrders.push({
            item: selectedItem,
            price: Math.round(selectedItem.value * (1.05 + Math.random() * 0.2)),
            quantity: Math.floor(Math.random() * 2) + 1,
            owner: MARKET_USERS[Math.floor(Math.random() * MARKET_USERS.length)]
          });
        }
        return {
          buy: [...prev.buy, ...buyOrders],
          sell: [...prev.sell, ...sellOrders]
        };
      });
    }
  }, [selectedItem]);

  const handleCancelOrder = (type: "buy" | "sell", index: number) => {
    const order = marketOrders[type][index];

    console.log("Cancelling order", index);

    if (!order || order.owner !== CURRENT_USER) {
      toast({
        title: "Cancel Failed",
        description: "You can only cancel your own orders.",
        variant: "destructive"
      });
      return;
    }

    if (type === "buy") {

      // Refund gold
      const refund = order.price * order.quantity;
      if (onGoldBalanceChange) {
        onGoldBalanceChange(goldBalance + refund);
      }

    } else if (type === "sell") {

      if (wouldExceedSlotLimit(inventoryItems, [order.item])) {
        toast({
          title: "Inventory Full",
          description: `Cannot add ${order.item.name}, inventory slots are full!`,
          variant: "destructive",
        });
        return;
      }

      // Refund item to inventory
      const updatedInventory = [...inventoryItems];
      let added = false;

      for (let i = 0; i < updatedInventory.length; i++) {
        if (updatedInventory[i].id === order.item.id && updatedInventory[i].stackable) {
          updatedInventory[i] = {
            ...updatedInventory[i],
            count: (updatedInventory[i].count || 1) + order.quantity
          };
          added = true;
          break;
        }
      }

      if (!added) {
        updatedInventory.push({ ...order.item, count: order.quantity });
      }

      setInventoryItems(updatedInventory);
      updateInventoryAndStats(updatedInventory);
    }

    // Remove the order from the market
    setMarketOrders(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));

    toast({
      title: "Order Cancelled",
      description: `Your ${type} order has been cancelled.`
    });
  };



  // Tooltips

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

  
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);



  return (
    <div className="game-ui mt-4">
      <h2 className="text-xl text-game-primary font-bold mb-4">Trading System</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-game-secondary" />
            <input
              type="text"
              placeholder="Search Items..."
              className="game-search pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="game-select w-full">
                <SelectValue placeholder="Item Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="weapon">Weapons</SelectItem>
                <SelectItem value="armor">Armor</SelectItem>
                <SelectItem value="accessory">Accessories</SelectItem>
                <SelectItem value="bag">Bags</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="potion">Potions</SelectItem>
                <SelectItem value="material">Materials</SelectItem>
                <SelectItem value="misc">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="game-select w-full">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[300px] overflow-x-hidden scrollbar scrollbar-thin bg-black bg-opacity-20 rounded-md border border-game-secondary">


            {activeTab === 'sell' && (
              <>
                <div className="p-2 text-sm text-game-gold font-bold sticky top-0 bg-game-dark bg-opacity-90 border-b border-game-secondary">
                  Available Items
                </div>
                <div className="divide-y divide-game-secondary">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <div
                        key={item.id}
                        onMouseEnter={(e) => handleMouseEnterItem(item, e)}
                        onMouseMove={handleMouseMoveTooltip}
                        onMouseLeave={handleMouseLeaveItem}
                        className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-game-tertiary hover:bg-opacity-25 ${selectedItem?.id === item.id ? 'bg-game-tertiary bg-opacity-40' : ''}`}
                        onClick={() => handleItemSelect(item)}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center game-item ${getRarityClass(item.rarity)}`}>
                        <ItemIcon icon={item.icon} alt={item.name} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-game-gold">{item.value} gold</div>
                        </div>
                        <div className="text-xs">
                          {item.count ? `×${item.count}` : ''}
                        </div>
                      </div>

                    ))

                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No items match your filters
                    </div>
                  )}
                </div>


              </>
            )}


            {activeTab === 'buy' && (
              <>
                <div className="p-2 text-sm text-game-gold font-bold sticky top-0 bg-game-dark bg-opacity-90 border-b border-game-secondary">
                  Market Items
                </div>
                <div className="divide-y divide-game-secondary">
                  {filteredAllItems.length > 0 ? (
                    filteredAllItems.map(item => (
                      <div
                        key={item.id}
                        onMouseEnter={(e) => handleMouseEnterItem(item, e)}
                        onMouseMove={handleMouseMoveTooltip}
                        onMouseLeave={handleMouseLeaveItem}
                        className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-game-tertiary hover:bg-opacity-25 ${selectedItem?.id === item.id ? 'bg-game-tertiary bg-opacity-40' : ''}`}
                        onClick={() => handleItemSelect(item)}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center game-item ${getRarityClass(item.rarity)}`}>
                        <ItemIcon icon={item.icon} alt={item.name} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-game-gold">{item.value} gold</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No items match your filters
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-black bg-opacity-20 p-2 rounded-md border border-game-secondary">
            <div className="text-sm text-game-gold font-bold">Your Balance</div>
            <div className="text-2xl font-bold">{goldBalance} gold</div>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          {selectedItem ? (
            <>
              <div className="bg-black bg-opacity-20 p-3 rounded-md border border-game-secondary">
                <div className="flex items-center gap-3 mb-3">
                  <div onMouseEnter={(e) => handleMouseEnterItem(selectedItem, e)}
                    onMouseMove={handleMouseMoveTooltip}
                    onMouseLeave={handleMouseLeaveItem} className={`w-10 h-10 flex items-center justify-center item-${selectedItem.rarity} game-item ${getRarityClass(selectedItem.rarity)}`}>
                    <ItemIcon icon={selectedItem.icon} alt={selectedItem.name} />
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedItem.name}</h3>
                    <div className="text-sm capitalize">{selectedItem.rarity} {selectedItem.type}</div>
                  </div>
                  <div className="ml-auto text-game-gold text-lg font-bold">
                    {selectedItem.value} gold
                  </div>
                </div>

                <div className="h-[200px] mb-2">
                  <PriceHistoryChart data={marketData} />
                </div>

                <div className="flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Base Price</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Market Price</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="buy" onValueChange={setActiveTab}>
                <TabsList className="w-full bg-game-dark/80 mb-4 rounded-lg p-1 border border-game-secondary">
                  <TabsTrigger
                    value="buy"
                    className="w-1/2 data-[state=active]:bg-game-primary data-[state=active]:text-white font-bold transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Buy Orders
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="w-1/2 data-[state=active]:bg-game-primary data-[state=active]:text-white font-bold transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Sell Orders
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buy">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <OrderForm
                      type="buy"
                      item={selectedItem}
                      onPlaceOrder={handlePlaceOrder}
                      playerGold={goldBalance}
                    />
                    <MarketOrdersList
                      type="buy"
                      orders={marketOrders.buy
                        .map((order, originalIndex) => ({ ...order, originalIndex }))
                        .filter(o => o.owner === CURRENT_USER)}
                      onCancelOrder={handleCancelOrder}
                    />

                  </div>
                  <div className="mt-2">
                    <MarketOrderBook
                      orders={marketOrders}
                      type="buy"
                      currentUser={CURRENT_USER}
                      onOrderAction={handleOrderAction}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="sell">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <OrderForm
                      type="sell"
                      item={selectedItem}
                      onPlaceOrder={handlePlaceOrder}
                      playerItemCount={inventoryItems.reduce((total, item) => {
                        if (item.id === selectedItem.id) {
                          return total + (item.count || 1);
                        }
                        return total;
                      }, 0)}
                    />
                    <MarketOrdersList
                      type="sell"
                      orders={marketOrders.sell
                        .map((order, originalIndex) => ({ ...order, originalIndex }))
                        .filter(o => o.owner === CURRENT_USER)}
                      onCancelOrder={handleCancelOrder}
                    />
                  </div>
                  <div className="mt-2">
                    <MarketOrderBook
                      orders={marketOrders}
                      type="sell"
                      currentUser={CURRENT_USER}
                      onOrderAction={handleOrderAction}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </>

          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground p-10">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-bold text-lg">Select an item to trade</h3>
                <p className="text-sm">View price history and place buy or sell orders</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* DISINI  */}
      {showTooltip && hoveredItem && (
        <ItemTooltip
          item={hoveredItem}
          mousePosition={tooltipPosition}
        />
      )}

    </div>
  );
};

export default TradingSystem;