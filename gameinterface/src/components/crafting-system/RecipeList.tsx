import React from "react";
import { Recipe } from "@/types/crafting";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ItemIcon } from "@/data/icon";

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  selectedRecipeId: string | null;
  categoryId: string;
}

const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  onSelectRecipe, 
  selectedRecipeId,
  categoryId
}) => {
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'item-common';
      case 'uncommon': return 'item-uncommon';
      case 'rare': return 'item-rare';
      case 'epic': return 'item-epic';
      case 'legendary': return 'item-legendary';
      default: return '';
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="game-ui min-h-[450px] flex items-center justify-center">
        <p className="text-game-light">No recipes available in this category.</p>
      </div>
    );
  }

  return (
    <div className="game-ui min-h-[450px] flex flex-col">
      <h3 className="text-lg font-bold mb-2 text-game-primary">Craftings Items ({recipes.length})</h3>

      <TooltipProvider>
        <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 scrollbar scrollbar-thin">
          {recipes.map(recipe => (
            <Tooltip key={recipe.id}>
              <TooltipTrigger asChild>
                <div 
                  className={`
                    w-full p-2 flex items-center gap-3 cursor-pointer
                    ${selectedRecipeId === recipe.id ? 'border-2 border-game-gold shadow-lg shadow-game-gold/30' : ''}
                  `}
                  onClick={() => onSelectRecipe(recipe)}
                >
                  <div 
                  
                  className={`
                    game-item ${getRarityClass(recipe.output.rarity)} 
 text-center text-2xl w-12 h-12 flex items-center justify-center hover:scale-110 hover:brightness-125 transition-transform duration-200
                  `}
                 >
                    
                    <ItemIcon icon={recipe.output.icon} alt={recipe.output.name} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{recipe.output.name}</div>
                    <div className="text-xs capitalize">{recipe.output.rarity} {recipe.output.type}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="game-ui border-game-primary">
                <div className="p-2 max-w-xs">
                  <p className="font-bold">{recipe.output.name}</p>
                  <p className="capitalize text-xs">{recipe.output.rarity} {recipe.output.type}</p>
                  <p className="text-xs mt-1">{recipe.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default RecipeList;