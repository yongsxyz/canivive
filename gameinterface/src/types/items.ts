
export interface Item {
  id: string;
  name: string;
  type: string;
  rarity: string;
  value: number;
  icon: string;
  description?: string;
  tier?: number;
  enchantment?: string;
  quality?: number;
  durability?: number;
  weight?: number;
  stackable?: boolean;
  count?: number;
  maxStack?: number;
  armorType?: string;
  stats?: {
    damage?: number;
    health?: number;
    armor?: number;
    hungry?: number;
    thirst?: number;
    stamina?: number;
    mood?: number;
  };
  consumableStats?: {
    damage?: number;
    health?: number;
    armor?: number;
    hungry?: number;
    thirst?: number;
    stamina?: number;
    mood?: number;
  };
  buffDuration?: {
    damage?: number; // in minutes
    health?: number;
    armor?: number;
    hungry?: number;
    thirst?: number;
    stamina?: number;
    mood?: number;
  };
  _dragId?: string; // for drag and drop functionality
  location?: string; // Location property for item positioning
  capacityBonus?: {
    slots?: number;
    weight?: number;
  }; // Capacity bonus for bags
}
