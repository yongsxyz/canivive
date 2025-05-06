import { Item } from "@/types/items";
import { useInventory } from "@/context/InventoryContext";

export const stackItems = (items: Item[]): Item[] => {
  // Create a deep copy to avoid modifying the original array
  const itemsCopy = JSON.parse(JSON.stringify(items));
  
  // Only stack items that are marked as stackable
  const stackableItems: Item[] = [];
  const nonStackableItems: Item[] = [];
  
  itemsCopy.forEach((item: Item) => {
    if (item.stackable) {
      stackableItems.push(item);
    } else {
      nonStackableItems.push(item);
    }
  });
  
  // Group stackable items by their key properties
  const groupedItems: { [key: string]: Item[] } = {};
  
  stackableItems.forEach((item) => {
    const key = `${item.name}-${item.type}-${item.rarity}-${item.tier || '0'}-${item.enchantment || 'none'}`;
    
    if (!groupedItems[key]) {
      groupedItems[key] = [];
    }
    
    groupedItems[key].push(item);
  });
  
  // Merge stacks while respecting maxStack
  const mergedItems: Item[] = [];
  
  Object.values(groupedItems).forEach((itemGroup) => {
    if (itemGroup.length === 0) return;
    
    let currentStack = { ...itemGroup[0] };
    currentStack.count = currentStack.count || 1;
    
    for (let i = 1; i < itemGroup.length; i++) {
      const item = itemGroup[i];
      const itemCount = item.count || 1;
      const maxStack = currentStack.maxStack || 50;
      
      // If the current stack is full, start a new one
      if ((currentStack.count || 0) >= maxStack) {
        mergedItems.push(currentStack);
        currentStack = { ...item };
        continue;
      }
      
      // Calculate how much can be added to the current stack
      const spaceInStack = maxStack - (currentStack.count || 0);
      const amountToAdd = Math.min(itemCount, spaceInStack);
      
      // Add to current stack
      currentStack.count = (currentStack.count || 0) + amountToAdd;
      
      // If there's leftover, create a new stack
      if (amountToAdd < itemCount) {
        const leftover = { ...item, count: itemCount - amountToAdd };
        mergedItems.push(leftover);
      }
    }
    
    mergedItems.push(currentStack);
  });
  
  // Combine stacked and non-stacked items
  return [...mergedItems, ...nonStackableItems];
};

export const unstackItems = (items: Item[]): Item[] => {
  const result: Item[] = [];
  
  items.forEach(item => {
    if (item.stackable && item.count && item.count > 1) {
      // Create individual items for each count
      for (let i = 0; i < item.count; i++) {
        result.push({
          ...item,
          id: `${item.id}-${i}-${Date.now()}${Math.random().toString(36).substr(2, 9)}`, // Create unique IDs
          count: 1
        });
      }
    } else {
      // Keep non-stackable items or items with count=1 as they are
      result.push({...item});
    }
  });
  
  return result;
};

export const calculateTotalWeight = (items: Item[]): number => {
  return items.reduce((sum, item) => {
    const count = item.count || 1;
    const weight = item.weight || 0;
    return sum + (weight * count);
  }, 0);
};

const DEFAULT_BAG_CAPACITY = { slots: 999999, weight: 999999 };

export const getBagCapacity = (bag: Item): { slots: number; weight: number } => {
  if (bag.type !== "bag") {
    return { slots: 0, weight: 0 };
  }
  
  return {
    slots: bag.capacityBonus?.slots ?? DEFAULT_BAG_CAPACITY.slots,
    weight: bag.capacityBonus?.weight ?? DEFAULT_BAG_CAPACITY.weight,
  };
};

export const canStackWithItem = (sourceItem: Item, targetItem: Item): boolean => {
  if (!sourceItem.stackable || !targetItem.stackable) {
    return false;
  }
  
  // Check if items are of the same type
  return sourceItem.name === targetItem.name &&
    sourceItem.type === targetItem.type &&
    sourceItem.rarity === targetItem.rarity &&
    sourceItem.tier === targetItem.tier &&
    sourceItem.enchantment === targetItem.enchantment &&
    sourceItem.durability === targetItem.durability &&
    ((targetItem.count || 0) < (targetItem.maxStack || 50));
};

export const mergeItemStacks = (sourceItem: Item, targetItem: Item): Item => {
  const sourceCount = sourceItem.count || 1;
  const targetCount = targetItem.count || 1;
  const maxStack = targetItem.maxStack || 50;
  
  // Calculate how much can be added to the target stack
  const spaceInStack = maxStack - targetCount;
  const amountToAdd = Math.min(sourceCount, spaceInStack);
  
  // Create a new item with the merged count
  return {
    ...targetItem,
    count: targetCount + amountToAdd
  };
};

export const getSourceItemAfterMerge = (sourceItem: Item, amountMerged: number): Item | null => {
  const sourceCount = sourceItem.count || 1;
  
  // If all items were merged, return null
  if (sourceCount <= amountMerged) {
    return null;
  }
  
  // Otherwise return the source item with reduced count
  return {
    ...sourceItem,
    count: sourceCount - amountMerged
  };
};

export function getDefaultWeight(type: string): number {
  switch (type) {
    case "weapon": return 3.0;
    case "armor": return 5.0;
    case "accessory": return 0.5;
    case "food": return 0.2;
    case "potion": return 0.3;
    case "material": return 0.1;
    case "bag": return 1.0;
    default: return 0.5;
  }
}

export const getRarityClass = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'item-common';
    case 'uncommon': return 'item-uncommon';
    case 'rare': return 'item-rare';
    case 'epic': return 'item-epic';
    case 'legendary': return 'item-legendary';
    default: return '';
  }
};



export const useInventoryLimits = () => {
  const { inventoryOptions } = useInventory();
  const wouldExceedSlotLimit = (
    currentItems: Item[],
    itemsToAdd: Item[] = [],
    itemsToRemove: string[] = [],
    maxSlots: number = inventoryOptions.maxSlots
  ): boolean => {
    const simulatedItems = [...currentItems];
    
    // Remove specified items
    itemsToRemove.forEach(id => {
      const index = simulatedItems.findIndex(item => item.id === id);
      if (index !== -1) simulatedItems.splice(index, 1);
    });
    
    // Add new items
    simulatedItems.push(...itemsToAdd);
  
    // Check against slot limit
    return simulatedItems.length > maxSlots;
  };
  

  return { wouldExceedSlotLimit };
};
