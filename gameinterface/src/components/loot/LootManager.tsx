// lootmanager.tsx
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import LootContainer from "./LootContainer";
import { Item } from "@/types/items";
import { useInventory } from "@/context/InventoryContext";
import { useInventoryLimits } from "@/utils/inventoryManager";

interface LootManagerProps {
    UniqueLoot?: string;
    lootItems?: Item[];
    type?: string;
    rarity?: string;
    onLootItem?: (item: Item) => void;
}

const LootManager: React.FC<LootManagerProps> = ({
    UniqueLoot,
}) => {

    const { inventoryItems, setInventoryItems, updateInventoryAndStats, inventoryOptions } = useInventory();
    const { wouldExceedSlotLimit } = useInventoryLimits();

    const [lootItems, setLootItems] = useState<Item[]>(() => [

        {
            id: "loot-1",
            name: "Ancient Sword",
            type: "weapon",
            rarity: "rare",
            icon: "⚔️",
            value: 1500,
            weight: 4.5,
            tier: 3,
        },
        {
            id: "loot-2",
            name: "Health Potion",
            type: "potion",
            rarity: "common",
            icon: "🧪",
            value: 50,
            weight: 0.3,
            count: 5,
            stackable: true,
        },
        {
            id: "loot-3",
            name: "Dragon Scale",
            type: "material",
            rarity: "epic",
            icon: "🔰",
            value: 2500,
            weight: 1.2,
            count: 3,
            stackable: true,
        },

    ]);

    const handleTakeItem = (item: Item) => {

        if (!item) return;

        if (wouldExceedSlotLimit(inventoryItems, [item])) {
            toast({
                title: "Inventory Full",
                description: `Cannot add ${item.name}, inventory slots are full!`,
                variant: "destructive",
            });
            return;
        }



        const newInventory = [...inventoryItems];

        if (item.stackable) {
            const existingStack = newInventory.find(
                (i) =>
                    i.name === item.name &&
                    i.type === item.type &&
                    i.rarity === item.rarity &&
                    (i.count || 0) < (i.maxStack || 50)
            );

            if (existingStack) {
                existingStack.count = (existingStack.count || 1) + (item.count || 1);
                setInventoryItems(newInventory);
                updateInventoryAndStats(newInventory);
                return;
            }
        }

        newInventory.push(item);
        setInventoryItems(newInventory);
        updateInventoryAndStats(newInventory);
        setLootItems((prev) => prev.filter((i) => i.id !== item.id));

    };


    const handleTakeAll = () => {

        if (inventoryItems.length + lootItems.length > inventoryOptions.maxSlots) {
            toast({
                title: "Cannot Take All",
                description: "You don't have enough inventory slots!",
                variant: "destructive",
            });
            return;
        }

        const updatedInventory = [...inventoryItems];
        lootItems.forEach((item) => {
            if (item.stackable) {
                const existingStack = updatedInventory.find(
                    (i) =>
                        i.name === item.name &&
                        i.type === item.type &&
                        i.rarity === item.rarity &&
                        (i.count || 0) < (i.maxStack || 50)
                );

                if (existingStack) {
                    existingStack.count = (existingStack.count || 1) + (item.count || 1);
                } else {
                    updatedInventory.push(item);
                }
            } else {
                updatedInventory.push(item);
            }
        });

        setInventoryItems(updatedInventory);
        setLootItems([]);
        updateInventoryAndStats(updatedInventory);

        toast({
            title: "Items Looted",
            description: "All loots items have been added to your inventory.",
        });
    };

    return (
        <LootContainer
            items={lootItems}
            onTakeItem={handleTakeItem}
            onTakeAll={handleTakeAll}
        />
    );
};

export default LootManager;
