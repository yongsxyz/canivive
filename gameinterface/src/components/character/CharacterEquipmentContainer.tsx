import React, { useState, useEffect, useMemo } from "react";
import { useCooldown } from "@/hooks/useCooldown";
import { Search, Grid, List, Coins, Gem } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import CharacterProfile from "./CharacterProfile";
import StatsDisplay from "./StatsDisplay";
import BuffDisplay from "./BuffDisplay";
import EquipmentSection, { EquipmentSlot, createDefaultEquipmentSlots } from "./EquipmentSection";
import InventoryGrid from "./InventoryGrid";
import StorageSystem from "../storage-system/StorageSystem";
import TransferModal from "../storage-system/StorageModal";
import { useGameCurrency } from '@/context/GameCurrencyContext';


import { items } from "@/data/items";
import { Item } from "@/types/items";
import { Buff } from "@/types/buffs";

import {
  stackItems,
  useInventoryLimits,
  getBagCapacity,
  canStackWithItem,
  getDefaultWeight
} from "@/utils/inventoryManager";

const MAX_STAT_VALUE = 100;

type ActiveBuff = Buff;

interface CharacterEquipmentContainerProps {
}

import { useInventory } from "@/context/InventoryContext";
import { MAX_SLOT_DEFAULT, MAX_WEIGHT_DEFAULT } from "@/config/constants";

const CharacterEquipmentContainer: React.FC<CharacterEquipmentContainerProps> = () => {
  const { goldBalance, setGoldBalance, gemBalance } = useGameCurrency();
  const { inventoryItems, setInventoryItems, updateInventoryAndStats, setInventoryOptions, inventoryOptions } = useInventory();
  const { wouldExceedSlotLimit } = useInventoryLimits();
  const { onCooldown, triggerCooldown } = useCooldown(3000);
  const [equippedItems, setEquippedItems] = useState<EquipmentSlot[]>(createDefaultEquipmentSlots());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);



  const baseStats = {
    damage: 10,
    health: 100,
    armor: 100,
    hungry: 100,
    thirst: 100,
    stamina: 100,
    mood: 100,
  };

  const [stats, setStats] = useState(baseStats);
  const [buffStats, setBuffStats] = useState<{ [key: string]: number }>({});
  const [equipmentMaxBonus, setEquipmentMaxBonus] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    const bagItem = equippedItems.find(slot => slot.id === "bag")?.item;
    const capacity = bagItem ? getBagCapacity(bagItem) : { slots: 0, weight: 0 };

    const newOptions = {
      maxSlots: MAX_SLOT_DEFAULT + capacity.slots,
      maxWeight: MAX_WEIGHT_DEFAULT + capacity.weight
    };

    setInventoryOptions(prev => {
      if (
        prev.maxSlots === newOptions.maxSlots &&
        prev.maxWeight === newOptions.maxWeight
      ) {
        return prev; // no change, no re-render
      }
      return { ...prev, ...newOptions };
    });
  }, [equippedItems]);



  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" ? true : item.type === selectedCategory;
    const matchesRarity = selectedRarity === "all" ? true : item.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const totalValue = filteredItems.reduce((sum, item) => {
    const count = item.count || 1;
    return sum + (item.value * count);
  }, 0);

  const equipmentMaxBonuss = useMemo(() => {
    const maxStatBonuses = {
      damage: 0,
      health: 0,
      armor: 0,
      hungry: 0,
      thirst: 0,
      stamina: 0,
      mood: 0,
    };

    for (const slot of equippedItems) {
      const stats = slot.item?.stats;
      if (!stats) continue;

      if (stats.damage) maxStatBonuses.damage += stats.damage;
      if (stats.health) maxStatBonuses.health += stats.health;
      if (stats.armor) maxStatBonuses.armor += stats.armor;
      if (stats.hungry) maxStatBonuses.hungry += stats.hungry;
      if (stats.thirst) maxStatBonuses.thirst += stats.thirst;
      if (stats.stamina) maxStatBonuses.stamina += stats.stamina;
      if (stats.mood) maxStatBonuses.mood += stats.mood;
    }

    return maxStatBonuses;
  }, [equippedItems]);

  useEffect(() => {
    setEquipmentMaxBonus(equipmentMaxBonuss);
  }, [equipmentMaxBonuss]);


  useEffect(() => {
    return () => {
      activeBuffs.forEach(buff => {
        clearTimeout(buff.timerId);
      });
    };
  }, [activeBuffs]);


  const canEquipItemToSlot = (item: Item, slotId: string, slotType: string): boolean => {
    if (slotId === "hands" && item.type === "weapon") return true;

    if (item.type === "armor") {
      if (slotId === "head" && item.armorType === "head") return true;
      if (slotId === "body" && item.armorType === "body") return true;
      if (slotId === "pants" && item.armorType === "pants") return true;
      if (slotId === "legs" && item.armorType === "legs") return true;
      if (slotId === "cape" && item.armorType === "cape") return true;
    }

    if (slotId === "bag" && item.type === "bag") return true;

    if (slotId === "accessory" && item.type === "accessory") return true;

    return false;
  };

  const findAvailableSlotForItem = (item: Item): number | null => {
    for (let i = 0; i < equippedItems.length; i++) {
      const slot = equippedItems[i];
      if (!slot.item && canEquipItemToSlot(item, slot.id, slot.type)) {
        return i;
      }
    }
    return null;
  };

  const isAnyArmorEquipped = (): boolean => {
    return equippedItems.some(slot => slot.item?.type === "armor");
  };


  const handleEquipItem = (itemId: string) => {

    if (isStorageOpen) return;

    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = inventoryItems[itemIndex];

    let slotIndex: number | null = null;

    if (item.type === "armor" && item.armorType) {
      slotIndex = equippedItems.findIndex(
        slot => slot.id === item.armorType && !slot.item
      );
    } else {
      slotIndex = findAvailableSlotForItem(item);
    }

    if (slotIndex !== null && slotIndex >= 0) {
      const newInventory = [...inventoryItems];

      if (item.count && item.count > 1) {
        newInventory[itemIndex] = { ...item, count: item.count - 1 };
      } else {
        newInventory.splice(itemIndex, 1);
      }

      const itemToEquip = { ...item };
      if (itemToEquip.count) {
        itemToEquip.count = 1;
      }

      const newEquipped = [...equippedItems];
      newEquipped[slotIndex] = { ...newEquipped[slotIndex], item: itemToEquip };

      setEquippedItems(newEquipped);
      updateInventoryAndStats(newInventory);

      toast({
        title: "Item Equipped",
        description: `${item.name} equipped to ${equippedItems[slotIndex].name} slot.`,
      });
    } else {
      toast({
        title: "Cannot Equip Item",
        description: "No suitable equipment slot available for this item.",
        variant: "destructive",
      });
    }
  };

  const handleUnequipItem = (slotId: string) => {
    const slotIndex = equippedItems.findIndex(slot => slot.id === slotId);
    if (slotIndex === -1 || !equippedItems[slotIndex].item) return;

    const item = equippedItems[slotIndex].item!;

    if (item.type === "bag") {
      const currentTotalItems = inventoryItems.length;
      const bagCapacity = getBagCapacity(item);
      const newSlotLimit = inventoryOptions.maxSlots - bagCapacity.slots;

      if (currentTotalItems > newSlotLimit) {
        toast({
          title: "Cannot Unequip Bag",
          description: `Your inventory exceeds the default capacity without the bag (slots: ${currentTotalItems}/${newSlotLimit}.`,
          variant: "destructive",
        });
        return;
      }
    }


    if (wouldExceedSlotLimit(inventoryItems, [item])) {
      toast({
        title: "Inventory Full",
        description: `Cannot add ${item.name}, inventory slots are full!`,
        variant: "destructive",
      });
      return;
    }

    const newEquipped = [...equippedItems];
    newEquipped[slotIndex] = { ...newEquipped[slotIndex], item: null };

    if (item.stats) {
      const newStats = { ...stats };
      if (item.stats.health && stats.health > 100 && newStats.health > item.stats.health) {
        newStats.health -= item.stats.health;
      }
      if (item.stats.armor && stats.armor > 100 && newStats.armor > item.stats.armor) {
        newStats.armor -= item.stats.armor;
      }
      if (item.stats.hungry && stats.hungry > 100 && newStats.hungry > item.stats.hungry) {
        newStats.hungry -= item.stats.hungry;
      }
      if (item.stats.thirst && stats.thirst > 100 && newStats.thirst > item.stats.thirst) {
        newStats.thirst -= item.stats.thirst;
      }
      if (item.stats.stamina && stats.stamina > 100 && newStats.stamina > item.stats.stamina) {
        newStats.stamina -= item.stats.stamina;
      }
      if (item.stats.mood && stats.mood > 100 && newStats.mood > item.stats.mood) {
        newStats.mood -= item.stats.mood;
      }
      setStats(newStats);
    }

    const newInventory = [...inventoryItems];
    if (item.stackable) {
      const existingStackIndex = inventoryItems.findIndex(i =>
        i.name === item.name &&
        i.type === item.type &&
        i.rarity === item.rarity &&
        i.durability === item.durability &&
        (i.count || 0) < (i.maxStack || 50)
      );

      if (existingStackIndex !== -1) {
        newInventory[existingStackIndex] = {
          ...newInventory[existingStackIndex],
          count: (newInventory[existingStackIndex].count || 1) + 1
        };
      } else {
        newInventory.push({ ...item, count: 1 });
      }
    } else {
      newInventory.push(item);
    }

    setEquippedItems(newEquipped);
    updateInventoryAndStats(newInventory);

    toast({
      title: "Item Unequipped",
      description: `${item.name} unequipped from ${equippedItems[slotIndex].name} slot.`,
    });
  };

  const handleBuffExpire = (statType: string, value: number, itemName?: string) => {
    setBuffStats(prevBuffStats => {
      const newBuffStats = { ...prevBuffStats };
      newBuffStats[statType] = (newBuffStats[statType] || 0) - value;

      if (newBuffStats[statType] <= 0) {
        delete newBuffStats[statType];
      }

      return newBuffStats;
    });

    setStats(prevStats => {
      const newStats = { ...prevStats };

      if (statType === 'damage') {
        newStats.damage = Math.max(baseStats.damage, newStats.damage - value);
      } else {

        // LIER IYE BUG KEDEUI WE
        // const statKey = statType as keyof typeof newStats;
        // const equipmentBuff = equippedItems.reduce((sum, slot) => {
        //   if (slot.item?.stats?.[statKey]) {
        //     return sum + (slot.item.stats[statKey] as number);
        //   }
        //   return sum;
        // }, 0);
        // newStats[statKey] = Math.min(
        //   MAX_STAT_VALUE,
        //   Math.max(baseStats[statKey], baseStats[statKey] + equipmentBuff)
        // );

      }

      return newStats;
    });

    toast({
      title: "Buff Expired",
      description: `Your ${statType} buff from ${itemName || 'potion'} has worn off.`,
      variant: "destructive",
    });
  };

  const handleBuffExpiredById = (buffId: number) => {
    const buffToRemove = activeBuffs.find(buff => buff.timerId === buffId);
    if (buffToRemove) {
      clearTimeout(buffToRemove.timerId);
      setActiveBuffs(currentBuffs => currentBuffs.filter(buff => buff.timerId !== buffId));
      handleBuffExpire(buffToRemove.statType, buffToRemove.value, buffToRemove.itemName);
    }
  };

  const addPotionBuff = (statType: string, value: number, durationMinutes: number, itemName: string, itemId: string) => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + durationMinutes);


    const existingBuffIndex = activeBuffs.findIndex(buff =>
      buff.itemId === itemId
    );

    if (existingBuffIndex !== -1) {

      const existingBuff = activeBuffs[existingBuffIndex];
      clearTimeout(existingBuff.timerId);

      const newExpiresAt = new Date(existingBuff.expiresAt);
      newExpiresAt.setMinutes(newExpiresAt.getMinutes() + durationMinutes);

      const newTimerId = window.setTimeout(() => {
        handleBuffExpire(statType, value, itemName);
        setActiveBuffs(current => current.filter(buff => buff.timerId !== newTimerId));
      }, newExpiresAt.getTime() - Date.now());

      setActiveBuffs(prev => prev.map(buff =>
        buff.itemId === itemId && buff.statType === statType
          ? { ...buff, expiresAt: newExpiresAt, timerId: newTimerId }
          : buff
      ));

      toast({
        title: "Buff Extended",
        description: `${itemName} extended your ${statType} buff by ${durationMinutes} minutes.`,
      });

      return true;
    }

    setBuffStats(prevBuffStats => ({
      ...prevBuffStats,
      [statType]: (prevBuffStats[statType] || 0) + value
    }));

    const timerId = window.setTimeout(() => {
      handleBuffExpire(statType, value, itemName);
      setActiveBuffs(current => current.filter(buff => buff.timerId !== timerId));
    }, expiresAt.getTime() - Date.now());

    setActiveBuffs(current => [
      ...current,
      {
        statType,
        value,
        expiresAt,
        timerId: timerId as unknown as number,
        itemName,
        itemId
      }
    ]);

    toast({
      title: "Buff Applied",
      description: `${itemName} gave you +${value} ${statType} for ${durationMinutes} minutes.`,
    });

    return true;
  };

  const handleUseItem = (itemId: string) => {
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = inventoryItems[itemIndex];

    if ((item.type === "food" || item.type === "potion") && item.consumableStats) {
      const newStats = { ...stats };
      let statsChanged = false;
      let buffAdded = false;

      if (item.type === "food") {
        if (item.consumableStats.damage) {
          newStats.damage += item.consumableStats.damage;
          statsChanged = true;
        }

        const applyStatChange = (statName: keyof typeof item.consumableStats) => {
          if (item.consumableStats && item.consumableStats[statName]) {
            const statValue = item.consumableStats[statName] as number;
            const buffValue = buffStats[statName] || 0;
            const equipmentBonus = equipmentMaxBonus[statName] || 0;
            const maxStatValue = MAX_STAT_VALUE + equipmentBonus + buffValue;
            newStats[statName] = Math.min(
              newStats[statName] + statValue,
              maxStatValue
            );
            statsChanged = true;
          }
        };

        applyStatChange('health');
        applyStatChange('armor');
        applyStatChange('hungry');
        applyStatChange('thirst');
        applyStatChange('stamina');
        applyStatChange('mood');
      }
      else if (item.type === "potion") {
        if (item.buffDuration) {
          Object.entries(item.buffDuration).forEach(([statType, duration]) => {
            if (item.consumableStats && item.consumableStats[statType as keyof typeof item.consumableStats]) {
              const value = item.consumableStats[statType as keyof typeof item.consumableStats] as number;
              const buffSuccess = addPotionBuff(statType, value, duration, item.name, item.id);
              if (buffSuccess) buffAdded = true;
            }
          });
        }

        if (!buffAdded && item.consumableStats) {
          if (item.consumableStats.damage) {
            newStats.damage += item.consumableStats.damage;
            statsChanged = true;
          }

          const applyStatChange = (statName: keyof typeof item.consumableStats) => {
            if (item.consumableStats && item.consumableStats[statName]) {
              const statValue = item.consumableStats[statName] as number;
              const buffValue = buffStats[statName] || 0;
              const maxStatValue = MAX_STAT_VALUE + buffValue;

              newStats[statName] = Math.min(
                newStats[statName] + statValue,
                maxStatValue
              );
              statsChanged = true;
            }
          };

          applyStatChange('health');
          applyStatChange('armor');
          applyStatChange('hungry');
          applyStatChange('thirst');
          applyStatChange('stamina');
          applyStatChange('mood');
        }
      }

      if (statsChanged || buffAdded) {
        if (statsChanged) setStats(newStats);

        const newInventory = [...inventoryItems];
        if (item.count && item.count > 1) {
          newInventory[itemIndex] = {
            ...item,
            count: item.count - 1
          };
        } else {
          newInventory.splice(itemIndex, 1);
        }

        updateInventoryAndStats(newInventory);

        if (item.type === "potion" && buffAdded) {
          toast({
            title: "Potion Used",
            description: `${item.name} consumed. Buffs applied for a limited time!`,
          });
        } else if (statsChanged) {
          toast({
            title: "Food Consumed",
            description: `${item.name} consumed. Stats increased!`,
          });

        }
      } else {
        toast({
          title: "Cannot Use Item",
          description: `The effects of this ${item.name} are already active.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDropItem = (itemId: string) => {
    if (window.confirm(`Are you sure you want to drop this item?`)) {
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return;

      const item = inventoryItems[itemIndex];
      const newInventory = [...inventoryItems];

      newInventory.splice(itemIndex, 1);
      updateInventoryAndStats(newInventory);

      toast({
        title: "Item Dropped",
        description: `${item.name} has been discarded.`,
      });
    }
  };

  const handleTrashItem = (itemId: string) => {
    if (window.confirm(`Are you sure you want to permanently destroy this item?`)) {
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return;

      const item = inventoryItems[itemIndex];
      const newInventory = [...inventoryItems];

      newInventory.splice(itemIndex, 1);
      updateInventoryAndStats(newInventory);

      toast({
        title: "Item Trashed",
        description: `${item.name} has been permanently destroyed.`,
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (result.destination) {
      const newInventory = [...inventoryItems];
      const sourceItem = newInventory[result.source.index];
      const targetItem = newInventory[result.destination.index];

      if (sourceItem.stackable &&
        targetItem.stackable &&
        canStackWithItem(sourceItem, targetItem)) {

        const sourceCount = sourceItem.count || 1;
        const targetCount = targetItem.count || 1;
        const maxStack = targetItem.maxStack || 50;
        const spaceInStack = maxStack - targetCount;

        if (spaceInStack > 0) {
          const amountToMove = Math.min(sourceCount, spaceInStack);

          toast({
            title: "Items Stacked",
            description: `Added ${amountToMove} ${sourceItem.name} to the stack.`,
            className: "animate-fade-in",
          });

          newInventory[result.destination.index] = {
            ...targetItem,
            count: targetCount + amountToMove
          };

          if (sourceCount <= amountToMove) {
            newInventory.splice(result.source.index, 1);
          } else {
            newInventory[result.source.index] = {
              ...sourceItem,
              count: sourceCount - amountToMove
            };
          }

          setInventoryItems(newInventory);
          return;
        }
      }

      [newInventory[result.source.index], newInventory[result.destination.index]] = [newInventory[result.destination.index], newInventory[result.source.index]];

      toast({
        title: "Items Swapped",
        description: `Swapped positions of items.`,
        className: "animate-fade-in",
      });

      setInventoryItems(newInventory);
    }
  };

  const handleSplitItem = (itemId: string, amount: number) => {
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = inventoryItems[itemIndex];
    if (!item.stackable || !item.count || item.count <= 1 || amount >= item.count) {
      toast({
        title: "Cannot Split Item",
        description: "Invalid split amount or non-stackable item.",
        variant: "destructive",
      });
      return;
    }

    if (wouldExceedSlotLimit(inventoryItems, [item])) {
      toast({
        title: "Cannot Split Item",
        description: `Would exceed slot limit (${inventoryItems.length + 1}/${inventoryOptions.maxSlots})`,
        variant: "destructive",
      });
      return;
    }

    const newInventory = [...inventoryItems];

    /// DIDIE 
    const newItem = {
      ...item,
      id: `${item.id}`, /// id: `${item.id}-${Date.now()}`, or id coming
      count: amount
    };

    newInventory[itemIndex] = {
      ...item,
      count: item.count - amount
    };

    newInventory.push(newItem);

    updateInventoryAndStats(newInventory);

    toast({
      title: "Stack Split",
      description: `Split ${amount} items from ${item.name} stack.`,
      className: "animate-fade-in",
    });
  };

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex >= inventoryItems.length) {
      const newInventory = [...inventoryItems];
      const [movedItem] = newInventory.splice(fromIndex, 1);
      newInventory.push(movedItem);
      updateInventoryAndStats(newInventory);
      return;
    }

    const newInventory = [...inventoryItems];
    const sourceItem = newInventory[fromIndex];
    const targetItem = newInventory[toIndex];

    if (sourceItem.stackable &&
      targetItem.stackable &&
      canStackWithItem(sourceItem, targetItem)) {

      const sourceCount = sourceItem.count || 1;
      const targetCount = targetItem.count || 1;
      const maxStack = targetItem.maxStack || 50;
      const spaceInStack = maxStack - targetCount;

      if (spaceInStack > 0) {
        const amountToMove = Math.min(sourceCount, spaceInStack);

        toast({
          title: "Items Stacked",
          description: `Added ${amountToMove} ${sourceItem.name} to the stack.`,
          className: "animate-fade-in",
        });

        newInventory[toIndex] = {
          ...targetItem,
          count: targetCount + amountToMove
        };

        if (sourceCount <= amountToMove) {
          newInventory.splice(fromIndex, 1);
        } else {
          newInventory[fromIndex] = {
            ...sourceItem,
            count: sourceCount - amountToMove
          };
        }
        updateInventoryAndStats(newInventory);
        return;
      }
    }

    [newInventory[fromIndex], newInventory[toIndex]] = [newInventory[toIndex], newInventory[fromIndex]];

    toast({
      title: "Items Swapped",
      description: `Swapped positions of items.`,
      className: "animate-fade-in",
    });

    updateInventoryAndStats(newInventory);
  };

  const handleStackAllItems = () => {

    const canStack = triggerCooldown();
    if (!canStack) {
      toast({
        title: "Cooldown Active",
        description: `Please wait before stacking again.`,
        variant: "destructive",
      });
      return;
    }


    const stacked = stackItems(inventoryItems);
    const slotsSaved = inventoryItems.length - stacked.length;

    updateInventoryAndStats(stacked);

    toast({
      title: "Items Stacked",
      description: `Combined stackable items (Saved ${slotsSaved} slots, now ${stacked.length}/${inventoryOptions.maxSlots})`, // Fixed: using inventoryOptions directly
      className: "animate-scale-in bg-game-gold bg-opacity-20",
    });
  };


  const handleUnstackAllItems = () => {

    const canStack = triggerCooldown();
    if (!canStack) {
      toast({
        title: "Cooldown Active",
        description: `Please wait before stacking again.`,
        variant: "destructive",
      });
      return;
    }

    let totalAfterUnstack = 0;
    let totalWeightAfterUnstack = 0;

    inventoryItems.forEach(item => {
      const itemCount = (item.stackable && item.count && item.count > 1) ? item.count : 1;
      totalAfterUnstack += itemCount;
      totalWeightAfterUnstack += (item.weight || 0) * itemCount;
    });

    // Check both slot and weight limits
    if (totalAfterUnstack > inventoryOptions.maxSlots) {
      toast({
        title: "Cannot Unstack",
        description: `Would exceed slot limit (${totalAfterUnstack}/${inventoryOptions.maxSlots})`,
        className: "bg-red-500/20 text-red-300",
        duration: 3000
      });
      return;
    }

    // if (totalWeightAfterUnstack > inventoryOptions.maxWeight) {
    //   toast({
    //     title: "Cannot Unstack",
    //     description: `Would exceed weight limit (${totalWeightAfterUnstack.toFixed(1)}/${inventoryOptions.maxWeight}kg)`,
    //     className: "bg-red-500/20 text-red-300",
    //     duration: 3000
    //   });
    //   return;
    // }

    // Perform unstacking
    const unstacked: Item[] = [];
    inventoryItems.forEach(item => {
      if (item.stackable && item.count && item.count > 1) {
        for (let i = 0; i < item.count; i++) {
          unstacked.push({
            ...item,
            id: `${item.id}-${i}-${Date.now()}`,
            count: 1,
            weight: item.weight || getDefaultWeight(item.type) // Ensure each item has weight
          });
        }
      } else {
        unstacked.push(item);
      }
    });

    updateInventoryAndStats(unstacked);

    toast({
      title: "Items Unstacked",
      description: `Separated all stacks (Now ${unstacked.length}/${inventoryOptions.maxSlots} slots, ${totalWeightAfterUnstack.toFixed(1)}/${inventoryOptions.maxWeight}kg)`,
      className: "animate-scale-in bg-game-gold bg-opacity-20",
    });
  };



  ///////////////// STORAGE SYSTEM MANAGER (COMMING SOON CHANGE FILE)///////////////////////

  const [storageItems, setStorageItems] = useState<Item[]>([]);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [maxStorageSlots] = useState(99999999);
  const [maxStorageWeight] = useState(99999999);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [transferType, setTransferType] = useState<'toStorage' | 'toInventory'>('toStorage');
  const [transferAmount, setTransferAmount] = useState(1);


  const handleMoveToStorage = (itemId: string) => {
    const item = inventoryItems.find(item => item.id === itemId);
    if (!item) return;

    setSelectedItem(item);
    setTransferType('toStorage');
    setTransferAmount(1);
    setTransferModalOpen(true);
  };

  const handleMoveToInventory = (itemId: string) => {
    const item = storageItems.find(item => item.id === itemId);
    if (!item) return;

    setSelectedItem(item);
    setTransferType('toInventory');
    setTransferAmount(1);
    setTransferModalOpen(true);
  };

  const handleConfirmMoveToStorage = (itemId: string, amount: number) => {
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    // Check storage limits
    if (storageItems.length >= maxStorageSlots) {
      toast({
        title: "Storage Full",
        description: "Cannot store more items. Storage slots are full.",
        variant: "destructive"
      });
      return;
    }

    const item = inventoryItems[itemIndex];
    let newInventory = [...inventoryItems];
    let newStorage = [...storageItems];

    // Calculate total weight if item is moved
    const itemWeight = (item.weight || 0) * amount;
    const newTotalWeight = storageItems.reduce((total, storageItem) => {
      return total + (storageItem.weight || 0) * (storageItem.count || 1);
    }, 0) + itemWeight;

    if (newTotalWeight > maxStorageWeight) {
      toast({
        title: "Storage Overweight",
        description: "Cannot store item. Storage weight limit exceeded.",
        variant: "destructive"
      });
      return;
    }

    // Try to stack in storage if possible
    if (item.stackable) {
      const existingStackIndex = storageItems.findIndex(storageItem =>
        canStackWithItem(storageItem, item)
      );

      if (existingStackIndex !== -1) {
        const existingItem = newStorage[existingStackIndex];
        const maxStack = existingItem.maxStack || 50;
        const currentCount = existingItem.count || 1;
        const itemCount = amount;

        if (currentCount < maxStack) {
          const spaceInStack = maxStack - currentCount;
          const amountToMove = Math.min(itemCount, spaceInStack);

          newStorage[existingStackIndex] = {
            ...existingItem,
            count: currentCount + amountToMove
          };

          if (item.count && item.count <= amountToMove) {
            newInventory.splice(itemIndex, 1);
          } else {
            newInventory[itemIndex] = {
              ...item,
              count: (item.count || 1) - amountToMove
            };
          }

          setStorageItems(newStorage);
          updateInventoryAndStats(newInventory);

          toast({
            title: "Item Stored",
            description: `Added ${amountToMove} ${item.name} to storage stack.`,
          });
          return;
        }
      }
    }

    // If not stackable or no existing stack, move the items
    if (item.count && item.count > amount) {
      // Move partial stack
      newInventory[itemIndex] = {
        ...item,
        count: item.count - amount
      };
      newStorage.push({
        ...item,
        count: amount,
        id: `${item.id}-${Date.now()}`
      });
    } else {
      // Move the whole item
      newInventory.splice(itemIndex, 1);
      newStorage.push(item);
    }

    setStorageItems(newStorage);
    updateInventoryAndStats(newInventory);

    toast({
      title: "Item Stored",
      description: `${amount} ${item.name} moved to storage.`,
    });
  };

  const handleConfirmMoveToInventory = (itemId: string, amount: number) => {
    const itemIndex = storageItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = storageItems[itemIndex];
    let newStorage = [...storageItems];
    let newInventory = [...inventoryItems];

    // Check inventory limits
    if (wouldExceedSlotLimit(newInventory, [{ ...item, count: amount }])) {
      toast({
        title: "Inventory Full",
        description: "Cannot retrieve item. Inventory slots are full.",
        variant: "destructive"
      });
      return;
    }

    // Try to stack in inventory if possible
    if (item.stackable) {
      const existingStackIndex = inventoryItems.findIndex(invItem =>
        canStackWithItem(invItem, item)
      );

      if (existingStackIndex !== -1) {
        const existingItem = newInventory[existingStackIndex];
        const maxStack = existingItem.maxStack || 50;
        const currentCount = existingItem.count || 1;
        const itemCount = amount;

        if (currentCount < maxStack) {
          const spaceInStack = maxStack - currentCount;
          const amountToMove = Math.min(itemCount, spaceInStack);

          newInventory[existingStackIndex] = {
            ...existingItem,
            count: currentCount + amountToMove
          };

          if (item.count && item.count <= amountToMove) {
            newStorage.splice(itemIndex, 1);
          } else {
            newStorage[itemIndex] = {
              ...item,
              count: (item.count || 1) - amountToMove
            };
          }

          setInventoryItems(newInventory);
          setStorageItems(newStorage);
          updateInventoryAndStats(newInventory);

          toast({
            title: "Item Retrieved",
            description: `Added ${amountToMove} ${item.name} to inventory stack.`,
          });
          return;
        }
      }
    }

    // If not stackable or no existing stack, move the items
    if (item.count && item.count > amount) {
      newStorage[itemIndex] = {
        ...item,
        count: item.count - amount
      };
      newInventory.push({
        ...item,
        count: amount,
        id: `${item.id}-${Date.now()}`
      });
    } else {
      newStorage.splice(itemIndex, 1);
      newInventory.push(item);
    }

    setInventoryItems(newInventory);
    setStorageItems(newStorage);
    updateInventoryAndStats(newInventory);

    toast({
      title: "Item Retrieved",
      description: `${amount} ${item.name} moved to inventory.`,
    });
  };

  const handleMoveAllToStorage = () => {
    if (filteredItems.length === 0) {
      toast({
        title: "Inventory Empty",
        description: "No items to move to storage",
        variant: "destructive"
      });
      return;
    }

    let itemsToMove = [...filteredItems];
    const newStorage = [...storageItems];
    const newInventory: Item[] = [];
    let movedCount = 0;

    const addToStorageWithStack = (item: Item) => {
      if (item.stackable) {

        const existingStackIndex = newStorage.findIndex(
          sItem => canStackWithItem(sItem, item) &&
            (sItem.count || 1) < (sItem.maxStack || 50)
        );

        if (existingStackIndex >= 0) {
          const existingItem = newStorage[existingStackIndex];
          const spaceAvailable = (existingItem.maxStack || 50) - (existingItem.count || 1);
          const amountToAdd = Math.min(spaceAvailable, item.count || 1);

          newStorage[existingStackIndex] = {
            ...existingItem,
            count: (existingItem.count || 1) + amountToAdd
          };

          if ((item.count || 1) > amountToAdd) {
            return {
              ...item,
              count: (item.count || 1) - amountToAdd
            };
          }
          return null;
        }
      }

      newStorage.push({ ...item });
      return null;
    };

    while (itemsToMove.length > 0) {
      const item = itemsToMove.pop()!;
      const remainingItem = addToStorageWithStack(item);

      if (remainingItem) {
        itemsToMove.unshift(remainingItem);
      }
      movedCount += item.count || 1;
    }

    if (newStorage.length > maxStorageSlots) {
      toast({
        title: "Storage Full",
        description: `Cannot move all items after stacking (${newStorage.length}/${maxStorageSlots} slots)`,
        variant: "destructive"
      });
      return;
    }

    const totalWeight = newStorage.reduce((sum, item) => sum + (item.weight || 0) * (item.count || 1), 0);
    if (totalWeight > maxStorageWeight) {
      toast({
        title: "Overweight",
        description: `Cannot move all items after stacking (${totalWeight.toFixed(1)}/${maxStorageWeight}kg)`,
        variant: "destructive"
      });
      return;
    }

    // Update state
    setStorageItems(newStorage);
    setInventoryItems(newInventory);
    updateInventoryAndStats(newInventory);

    toast({
      title: "Items Moved",
      description: `Moved ${movedCount} items to storage (${newStorage.length} stacks)`,
      className: "bg-green-500/20 text-green-300"
    });
  };

  const handleMoveAllToInventory = () => {
    if (storageItems.length === 0) {
      toast({
        title: "Storage Empty",
        description: "No items to move to inventory",
        variant: "destructive"
      });
      return;
    }

    let itemsToMove = [...storageItems];
    const newInventory = [...inventoryItems];
    const newStorage: Item[] = [];
    let movedCount = 0;

    const addToInventoryWithStack = (item: Item) => {
      if (item.stackable) {

        const existingStackIndex = newInventory.findIndex(
          invItem => canStackWithItem(invItem, item) &&
            (invItem.count || 1) < (invItem.maxStack || 50)
        );

        if (existingStackIndex >= 0) {
          const existingItem = newInventory[existingStackIndex];
          const spaceAvailable = (existingItem.maxStack || 50) - (existingItem.count || 1);
          const amountToAdd = Math.min(spaceAvailable, item.count || 1);

          newInventory[existingStackIndex] = {
            ...existingItem,
            count: (existingItem.count || 1) + amountToAdd
          };

          if ((item.count || 1) > amountToAdd) {
            return {
              ...item,
              count: (item.count || 1) - amountToAdd
            };
          }
          return null;
        }
      }

      newInventory.push({ ...item });
      return null;
    };

    // Proses semua item
    while (itemsToMove.length > 0) {
      const item = itemsToMove.pop()!;
      const remainingItem = addToInventoryWithStack(item);

      if (remainingItem) {
        itemsToMove.unshift(remainingItem);
      }
      movedCount += item.count || 1;
    }

    if (newInventory.length > inventoryOptions.maxSlots) {
      toast({
        title: "Inventory Full",
        description: `Cannot move all items after stacking (${newInventory.length}/${inventoryOptions.maxSlots} slots)`,
        variant: "destructive"
      });
      return;
    }

    const totalWeight = newInventory.reduce((sum, item) => sum + (item.weight || 0) * (item.count || 1), 0);
    if (totalWeight > inventoryOptions.maxWeight) {
      toast({
        title: "Overweight",
        description: `Cannot move all items after stacking (${totalWeight.toFixed(1)}/${inventoryOptions.maxWeight}kg)`,
        variant: "destructive"
      });
      return;
    }

    // Update state
    setInventoryItems(newInventory);
    setStorageItems(newStorage);
    updateInventoryAndStats(newInventory);

    toast({
      title: "Items Retrieved",
      description: `Moved ${movedCount} items to inventory (${newInventory.length} stacks)`,
      className: "bg-green-500/20 text-green-300"
    });
  };

  const toggleStorage = () => {
    setIsStorageOpen(!isStorageOpen);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="game-ui md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-game-primary font-bold">Character Inventory</h2>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-game-tertiary' : 'bg-game-dark hover:bg-game-tertiary'} transition-colors duration-200`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} className="text-game-light" />
            </button>
            <button
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-game-tertiary' : 'bg-game-dark hover:bg-game-tertiary'} transition-colors duration-200`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} className="text-game-light" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-game-secondary" />
            <input
              type="text"
              placeholder="Search..."
              className="game-search pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="game-select w-38">
                <SelectValue placeholder="Type" />
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
              <SelectTrigger className="game-select w-38">
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
        </div>

        <InventoryGrid
          items={filteredItems}
          viewMode={viewMode}
          onEquipItem={isStorageOpen ? undefined : handleEquipItem}
          onUseItem={handleUseItem}
          onDropItem={handleDropItem}
          onTrashItem={handleTrashItem}
          onSplitItem={handleSplitItem}
          onMoveItem={handleMoveItem}
          cooldownActive={onCooldown}
          onStackAllItems={handleStackAllItems}
          onUnstackAllItems={handleUnstackAllItems}
          inventoryOptions={inventoryOptions}
          isStorageOpen={isStorageOpen}
          onMoveToStorage={handleMoveToStorage}
        />


        <div className="flex justify-between items-center pt-2 border-t border-game-secondary mt-4">
          <div className="font-bold">Total Items: {inventoryOptions.totalItems}</div>
          <div className="font-bold text-game-gold">Est. Value: {totalValue} gold</div>
        </div>
      </div>

      <div className="game-ui">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-game-primary font-bold">Character</h2>

          {/* Currency display */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Gem className="text-blue-300" size={20} />
              <span className="text-blue-300 font-bold">{goldBalance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-bold">{gemBalance}</span>
            </div>
          </div>
        </div>
        <CharacterProfile
          name="e52zm-c...w-5tuge-aqe"
          level={25}
          experiencePercentage={75}
        />

        <EquipmentSection
          equipment={equippedItems}
          onUnequipItem={handleUnequipItem}
        />

        <div className="w-full space-y-4">
          <StatsDisplay
            stats={stats}
            buffs={buffStats}
            equipmentMaxBonus={equipmentMaxBonus}
          />
          {activeBuffs.length > 0 && (
            <BuffDisplay
              buffs={activeBuffs}
              onBuffExpired={handleBuffExpiredById}
            />
          )}

        </div>
      </div>


      <StorageSystem
        inventoryItems={filteredItems}
        storageItems={storageItems}
        maxStorageSlots={maxStorageSlots}
        maxStorageWeight={maxStorageWeight}
        onMoveToStorage={handleMoveToStorage}
        onMoveToInventory={handleMoveToInventory}
        isOpen={isStorageOpen}
        onToggleStorage={toggleStorage}
        onMoveAllToStorage={handleMoveAllToStorage}
        onMoveAllToInventory={handleMoveAllToInventory}
      />




      {transferModalOpen && (
        <TransferModal
          selectedItem={selectedItem}
          transferType={transferType}
          transferAmount={transferAmount}
          setTransferAmount={setTransferAmount}
          setTransferModalOpen={setTransferModalOpen}
          handleConfirmMoveToStorage={handleConfirmMoveToStorage}
          handleConfirmMoveToInventory={handleConfirmMoveToInventory}
        />
      )}




    </div>
  );
};

export default CharacterEquipmentContainer;