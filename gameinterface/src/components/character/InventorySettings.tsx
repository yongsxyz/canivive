
import React from 'react';
import { Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getTranslation } from "../settings/TranslationUtils";

interface InventorySettingsProps {
  onGridSizeChange: (size: number) => void;
  currentGridSize: number;
}

const InventorySettings: React.FC<InventorySettingsProps> = ({
  onGridSizeChange,
  currentGridSize
}) => {
  const gridOptions = [
    { size: 5, icon: <Grid2X2 size={18} /> },
    { size: 6, icon: <Grid3X3 size={18} /> },
    { size: 10, icon: <LayoutGrid size={18} /> }
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-game-dark rounded-lg">
      {gridOptions.map((option) => (
        <Button
          key={option.size}
          variant={currentGridSize === option.size ? "default" : "secondary"}
          size="sm"
          className={`p-2 ${currentGridSize === option.size ? 'bg-game-primary' : 'bg-game-dark hover:bg-game-secondary'}`}
          onClick={() => onGridSizeChange(option.size)}
          title={`${option.size} ${getTranslation("columns")}`}
        >
          {option.icon}
        </Button>
      ))}
    </div>
  );
};

export default InventorySettings;
