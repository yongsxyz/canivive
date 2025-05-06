import React, { useState, useEffect } from "react";
import { Box, Hammer, Search } from "lucide-react";
import RecipeList from "./RecipeList";
import RecipeDetails from "./RecipeDetails";
import { Item } from "@/types/items";
import { Recipe } from "@/types/crafting";
import { getAllRecipeDetails } from "@/data/recipes";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/context/InventoryContext";


interface CraftingSystemProps {
}

const CATEGORIES = [
  { id: "all", label: "All", icon: <Box size={16} /> },
  { id: "weapon", label: "Weapons", icon: "🗡️" },
  { id: "armor", label: "Armor", icon: "🛡️" },
  { id: "pants", label: "pants", icon: "👖" },
  { id: "cape", label: "cape", icon: "🚩" },
  { id: "legs", label: "legs", icon: "🦶" },
  { id: "potion", label: "Potions", icon: "🧪" },
  { id: "head", label: "Headgear", icon: "🪖" },
  { id: "accessory", label: "Accessories", icon: "💍" },
  { id: "food", label: "Food", icon: "🍎" },
  { id: "material", label: "Materials", icon: "🔨" },
];

const CraftingSystem: React.FC<CraftingSystemProps> = ({ 

}) => {
  const { inventoryItems, setInventoryItems} = useInventory();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [craftingProgress, setCraftingProgress] = useState<number | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [craftingAmount, setCraftingAmount] = useState(1);
  
  // Load recipes on component mount
  useEffect(() => {
    const loadedRecipes = getAllRecipeDetails();
    setRecipes(loadedRecipes);
    // Select the first recipe by default if available
    if (loadedRecipes.length > 0) {
      setSelectedRecipe(loadedRecipes[0]);
    }
  }, []);
  
  // Filter recipes by category, search, tier and rarity
  const getFilteredRecipes = () => {
    let filtered = recipes;
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(recipe => recipe.output.type === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.output.name.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by tier
    if (selectedTier !== "all") {
      filtered = filtered.filter(recipe => 
        recipe.output.tier === parseInt(selectedTier)
      );
    }
    
    // Filter by rarity
    if (selectedRarity !== "all") {
      filtered = filtered.filter(recipe => 
        recipe.output.rarity === selectedRarity
      );
    }
    
    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();
  
  // Handle recipe selection
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCraftingAmount(1); // Reset crafting amount when selecting a new recipe
  };
  
  // Calculate max possible crafts based on available resources
  const calculateMaxPossibleCrafts = (recipe: Recipe): number => {
    if (!recipe) return 0;
    
    const possibleCrafts = recipe.required.map(ingredient => {
      const playerIngredient = inventoryItems.find(item => item.id === ingredient.itemId);
      const playerCount = playerIngredient ? (playerIngredient.count || 1) : 0;
      return Math.floor(playerCount / ingredient.quantity);
    });
    
    // Return the minimum possible craft count based on available ingredients
    const maxCrafts = Math.min(...possibleCrafts);
    return Math.min(maxCrafts, 10); // Cap at 10 crafts maximum
  };
  
  // Handle batch crafting process
  const handleCraft = (recipe: Recipe, amount: number) => {
    if (!recipe || amount <= 0) return;
    
    // Check if the player has all required ingredients for the entire batch
    const hasAllIngredients = recipe.required.every(ingredient => {
      const playerIngredient = inventoryItems.find(item => item.id === ingredient.itemId);
      const playerCount = playerIngredient ? (playerIngredient.count || 1) : 0;
      return playerCount >= (ingredient.quantity * amount);
    });
    
    if (!hasAllIngredients) {
      toast({
        title: "Missing Ingredients",
        description: `You don't have enough ingredients to craft ${amount}x ${recipe.output.name}.`,
        variant: "destructive",
      });
      return;
    }
    
    // Start crafting process
    setIsCrafting(true);
    setCraftingProgress(0);
    
    // Calculate crafting time based on recipe complexity, item rarity, and batch size
    // Increase time for each additional item (10% more time per additional item)
    const baseCraftingTime = recipe.craftingTime || getCraftingTimeByRarity(recipe.output.rarity);
    // For batch crafting, each additional item takes 10% more time
    const totalCraftingTime = baseCraftingTime * (1 + (0.1 * (amount - 1))) * amount;
    
    const interval = 100; // Update every 100ms
    const steps = totalCraftingTime * 10; // Total steps for progress bar
    let currentStep = 0;
    
    const craftingInterval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setCraftingProgress(progress);
      
      if (currentStep >= steps) {
        clearInterval(craftingInterval);
        completeCrafting(recipe, amount);
      }
    }, interval);
  };
  
  const getCraftingTimeByRarity = (rarity: string): number => {
    switch (rarity) {
      case 'legendary': return 6; // 6 seconds
      case 'epic': return 4; // 4 seconds
      case 'rare': return 3; // 3 seconds
      case 'uncommon': return 2; // 2 seconds
      default: return 1; // 1 second
    }
  };
  
  const completeCrafting = (recipe: Recipe, amount: number) => {
    // Remove ingredients from inventory
    let updatedInventory = [...inventoryItems];
    
    // Remove each ingredient multiplied by the amount
    recipe.required.forEach(ingredient => {
      const totalRequired = ingredient.quantity * amount;
      let remainingQuantity = totalRequired;
      
      // Find matching items
      while (remainingQuantity > 0) {
        const index = updatedInventory.findIndex(item => item.id === ingredient.itemId);
        
        if (index === -1) break; // Should never happen if we checked correctly
        
        const item = updatedInventory[index];
        const itemCount = item.count || 1;
        
        if (itemCount <= remainingQuantity) {
          // Remove the entire stack
          updatedInventory.splice(index, 1);
          remainingQuantity -= itemCount;
        } else {
          // Reduce the stack
          updatedInventory[index] = {
            ...item,
            count: itemCount - remainingQuantity
          };
          remainingQuantity = 0;
        }
      }
    });
    
    // Add crafted items to inventory
    // Try to stack them if possible
    const craftedItem: Item = {
      ...recipe.output,
      id: `crafted-${recipe.output.id}-${Date.now()}`, // Generate unique ID
      count: amount
    };
    
    // Find existing stack of the same item type if stackable
    if (craftedItem.stackable) {
      const existingStack = updatedInventory.find(item => 
        item.name === craftedItem.name && 
        item.type === craftedItem.type && 
        item.rarity === craftedItem.rarity && 
        item.tier === craftedItem.tier
      );
      
      if (existingStack) {
        existingStack.count = (existingStack.count || 1) + amount;
      } else {
        updatedInventory.push(craftedItem);
      }
    } else {
      // If not stackable, add individual items
      for (let i = 0; i < amount; i++) {
        updatedInventory.push({
          ...recipe.output,
          id: `crafted-${recipe.output.id}-${Date.now()}-${i}`,
          count: 1
        });
      }
    }
    
    // Update inventory
    setInventoryItems(updatedInventory);
    
    // Show success message
    toast({
      title: "Crafting Successful",
      description: `You have successfully crafted ${amount}x ${recipe.output.name}!`,
    });
    
    // Reset crafting state
    setIsCrafting(false);
    setCraftingProgress(null);
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (isCrafting) {
        setIsCrafting(false);
        setCraftingProgress(null);
      }
    };
  }, [isCrafting]);
  
  return (
    <div className="game-ui">
      <div className="flex items-center gap-2 mb-4">
        <Hammer className="text-game-primary" size={24} />
        <h2 className="text-xl text-game-primary font-bold">Crafting Workshop</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2 justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1.5 h-4 w-4 text-game-secondary" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="game-search pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger className="game-select w-24 bg-game-dark">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent className="bg-game-dark border-game-primary z-50">
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="1">Tier 1</SelectItem>
              <SelectItem value="2">Tier 2</SelectItem>
              <SelectItem value="3">Tier 3</SelectItem>
              <SelectItem value="4">Tier 4</SelectItem>
              <SelectItem value="5">Tier 5</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedRarity} onValueChange={setSelectedRarity}>
            <SelectTrigger className="game-select w-28 bg-game-dark">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent className="bg-game-dark border-game-primary z-50">
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
      
      <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 bg-game-dark border border-game-tertiary flex flex-wrap">
          {CATEGORIES.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="data-[state=active]:bg-game-tertiary data-[state=active]:text-white"
            >
              <span className="flex items-center gap-2">
                {typeof category.icon === 'string' ? category.icon : category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecipeList 
            recipes={filteredRecipes} 
            onSelectRecipe={handleSelectRecipe} 
            selectedRecipeId={selectedRecipe?.id || null}
            categoryId={activeCategory}
          />
          <RecipeDetails 
            recipe={selectedRecipe} 
            inventory={inventoryItems}
            onCraft={handleCraft}
            craftingProgress={craftingProgress}
            craftingAmount={craftingAmount}
            setCraftingAmount={setCraftingAmount}
            calculateMaxPossibleCrafts={calculateMaxPossibleCrafts}
          />
        </div>
      </Tabs>
    </div>
  );
};

export default CraftingSystem;