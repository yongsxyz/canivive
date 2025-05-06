import { Item } from "@/types/items";

// Generate random price history data for a given item
export const generateMarketData = (item: Item, days = 30): any[] => {
  const basePrice = item.value;
  const volatility = getItemVolatility(item);
  const data = [];
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < days; i++) {
    // Add random fluctuation to price
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    currentPrice = Math.max(Math.round(currentPrice + change), Math.floor(basePrice * 0.5));
    
    // Add trend factor based on rarity (rare items tend to appreciate more)
    if (item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary') {
      currentPrice += Math.random() * (basePrice * 0.01);
    }
    
    data.push({
      day: i + 1,
      basePrice: basePrice,
      price: Math.round(currentPrice),
      volume: Math.floor(Math.random() * 100) + 1
    });
  }
  
  return data;
};

// Determine price volatility based on item properties
const getItemVolatility = (item: Item): number => {
  switch (item.rarity) {
    case 'common':
      return 0.02; // 2% volatility
    case 'uncommon':
      return 0.05; // 5% volatility
    case 'rare':
      return 0.08; // 8% volatility
    case 'epic':
      return 0.12; // 12% volatility
    case 'legendary':
      return 0.18; // 18% volatility
    default:
      return 0.05;
  }
};

// Calculate market average price for an item
export const calculateMarketAverage = (item: Item): number => {
  const data = generateMarketData(item, 7); // Use last 7 days
  const sum = data.reduce((total, day) => total + day.price, 0);
  return Math.round(sum / data.length);
};

// Generate suggested buy/sell prices
export const getSuggestedPrices = (item: Item): { buy: number, sell: number } => {
  const marketAvg = calculateMarketAverage(item);
  
  return {
    buy: Math.round(marketAvg * 0.95), // Suggest buying 5% below market
    sell: Math.round(marketAvg * 1.05), // Suggest selling 5% above market
  };
};
