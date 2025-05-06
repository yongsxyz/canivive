import React from "react";
import { Item } from "@/types/items";
import { Shield, Swords, Footprints, User, Briefcase, Omega, Flag} from "lucide-react";
import EquipmentSlot from "./EquipmentSlot";
import { getTranslation } from "../settings/TranslationUtils";

export interface EquipmentSlot {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
  item: Item | null;
  armorType?: string;
  capacityBonus?: {
    slots: number;
    weight: number;
  };
}

interface EquipmentSectionProps {
  equipment: EquipmentSlot[];
  onUnequipItem?: (slotId: string) => void;
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({ 
  equipment, 
  onUnequipItem
}) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold ">{getTranslation("equipment")}</h4>
      <div className="text-sm grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-xs md:max-w-none md:w-2/3 mx-auto">
        {equipment.map((slot) => (
          <EquipmentSlot 
            key={slot.id}
            slotId={slot.id}
            name={slot.name}
            icon={slot.icon}
            item={slot.item}
            onUnequip={onUnequipItem}
          />
        ))}
      </div>
    </div>
  );
};

export const createDefaultEquipmentSlots = (): EquipmentSlot[] => [
  { 
    id: "head", 
    type: "armor", 
    name: getTranslation("head"), 
    icon: <User size={34} />, 
    item: null, 
    armorType: "head",
  },
  { 
    id: "body", 
    type: "armor", 
    name: getTranslation("body"), 
    icon: <Shield size={24} />, 
    item: null, 
    armorType: "body",
  },
  { 
    id: "pants", 
    type: "armor", 
    name: getTranslation("pants"), 
    icon: "👖", 
    item: null, 
    armorType: "pants",
  },
  
  { 
    id: "cape", 
    type: "armor", 
    name: getTranslation("cape"), 
    icon: <Flag size={24} />, 
    item: null, 
    armorType: "cape",
  },
  { 
    id: "legs", 
    type: "legs", 
    name: getTranslation("legs"), 
    icon: <Footprints size={24} />, 
    item: null, 
    armorType: "legs",
  },
  { 
    id: "hands", 
    type: "weapon", 
    name: getTranslation("hands"), 
    icon: <Swords size={24} />, 
    item: null ,
  },
  { 
    id: "bag", 
    type: "bag", 
    name: getTranslation("bag"), 
    icon: <Briefcase size={24} />, 
    item: null,
  },
  { 
    id: "accessory", 
    type: "accessory", 
    name: getTranslation("accessory"), 
    icon: <Omega size={24} />, 
    item: null,
  },
];

export default EquipmentSection;
