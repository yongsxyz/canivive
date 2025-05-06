import React from "react";
import { Recipe } from "@/types/crafting";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Item } from "@/types/items";
import { Check, AlertCircle, Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemIcon } from "@/data/icon";

interface RecipeDetailsProps {
  recipe: Recipe | null;
  inventory: Item[];
  onCraft: (recipe: Recipe, amount: number) => void;
  craftingProgress: number | null;
  craftingAmount: number;
  setCraftingAmount: (amount: number) => void;
  calculateMaxPossibleCrafts: (recipe: Recipe) => number;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ 
  recipe, 
  inventory, 
  onCraft,
  craftingProgress,
  craftingAmount,
  setCraftingAmount,
  calculateMaxPossibleCrafts
}) => {
  if (!recipe) {
    return (
      <div className="game-ui min-h-[450px] flex items-center justify-center">
        <p className="text-game-light">Select a recipe to view details</p>
      </div>
    );
  }

  // Check if player has the required ingredients for batch crafting
  const maxPossibleCrafts = calculateMaxPossibleCrafts(recipe);
  const canCraft = maxPossibleCrafts >= craftingAmount;

  // Get ingredient status for batch crafting
  const getIngredientStatus = (ingredient: { itemId: string; name: string; quantity: number; icon: string; tier?: number }) => {
    const playerIngredient = inventory.find(item => item.id === ingredient.itemId);
    const playerCount = playerIngredient ? (playerIngredient.count || 1) : 0;
    const requiredForBatch = ingredient.quantity * craftingAmount;
    return {
      available: playerCount,
      required: requiredForBatch,
      hasEnough: playerCount >= requiredForBatch,
      item: playerIngredient
    };
  };

  // Handle crafting amount adjustment
  const increaseCraftingAmount = () => {
    if (craftingAmount < maxPossibleCrafts && craftingAmount < 10) {
      setCraftingAmount(craftingAmount + 1);
    }
  };

  const decreaseCraftingAmount = () => {
    if (craftingAmount > 1) {
      setCraftingAmount(craftingAmount - 1);
    }
  };

  const setMaxCraftingAmount = () => {
    setCraftingAmount(maxPossibleCrafts > 0 ? Math.min(maxPossibleCrafts, 10) : 1);
  };

  return (
    <div className="game-ui min-h-[450px] flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-12 h-12 flex items-center justify-center game-item ${
          recipe.output.rarity === 'common' ? 'item-common' :
          recipe.output.rarity === 'uncommon' ? 'item-uncommon' :
          recipe.output.rarity === 'rare' ? 'item-rare' :
          recipe.output.rarity === 'epic' ? 'item-epic' :
          recipe.output.rarity === 'legendary' ? 'item-legendary' : ''
        }`}>
          <ItemIcon icon={recipe.output.icon} alt={recipe.output.name} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-game-primary">{recipe.output.name}</h3>
          <p className="text-xs capitalize">{recipe.output.rarity} {recipe.output.type}</p>
          {recipe.output.tier && (
            <p className="text-xs">Tier {recipe.output.tier}</p>
          )}
        </div>
      </div>
      
      <p className="text-sm mb-3 text-game-light">{recipe.description}</p>
      
      <div className="flex-grow overflow-hidden">
        <h4 className="font-bold text-sm mb-2 border-b border-game-tertiary pb-1">Required Ingredients:</h4>

          <div className="space-y-2 max-h-[420px] overflow-y-auto overflow-x-hidden pr-2 scrollbar scrollbar-thin">
            {recipe.required.map((ingredient, index) => {
              const status = getIngredientStatus(ingredient);
              return (
                <div key={index} className="flex items-center justify-between bg-game-dark/30 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center game-item">
                      <ItemIcon icon={ingredient.icon} alt={ingredient.name} />
                    </div>
                    <div>
                      <span className="text-sm">{ingredient.name}</span>
                      {ingredient.tier && (
                        <span className="text-xs ml-1 text-gray-400">(T{ingredient.tier})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm ${status.hasEnough ? 'text-green-500' : 'text-red-500'}`}>
                      {status.available}/{status.required}
                    </span>
                    {status.hasEnough ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <AlertCircle size={14} className="text-red-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

      </div>
      
      {craftingProgress !== null ? (
        <div className="mt-4">
          <p className="text-sm mb-1 text-center">Crafting in progress...</p>
          <Progress value={craftingProgress} className="h-3" />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Craft Amount:</div>
            <div className="flex items-center border border-game-tertiary rounded-md">
              <button 
                className="px-2 py-1 text-game-light hover:bg-game-tertiary/30 transition-colors"
                onClick={decreaseCraftingAmount}
                disabled={craftingAmount <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="px-3 py-1 border-l border-r border-game-tertiary min-w-[40px] text-center">
                {craftingAmount}
              </div>
              <button 
                className="px-2 py-1 text-game-light hover:bg-game-tertiary/30 transition-colors"
                onClick={increaseCraftingAmount}
                disabled={craftingAmount >= maxPossibleCrafts || craftingAmount >= 10}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              className="text-xs flex-1"
              variant="outline"
              onClick={() => setCraftingAmount(1)}
            >
              Set to 1
            </Button>
            <Button 
              className="text-xs flex-1"
              variant="outline"
              onClick={setMaxCraftingAmount}
              disabled={maxPossibleCrafts <= 0}
            >
              Set to Max ({maxPossibleCrafts > 10 ? 10 : maxPossibleCrafts})
            </Button>
          </div>
          
          <Button 
            className={`w-full ${canCraft ? 'bg-game-primary hover:bg-game-tertiary' : 'bg-game-dark'}`}
            onClick={() => onCraft(recipe, craftingAmount)}
            disabled={!canCraft}
          >
            {canCraft ? `Craft ${craftingAmount}x Item${craftingAmount > 1 ? 's' : ''}` : 'Missing Ingredients'}
          </Button>
          
          {!canCraft && craftingAmount > 1 && (
            <p className="text-red-500 text-xs mt-1 text-center">
              You don't have enough materials to craft {craftingAmount}x items.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;