
import React from "react";
import CharacterEquipmentContainer from "./character/CharacterEquipmentContainer";
import { useIsMobile } from "@/hooks/use-mobile";

const CharacterEquipment: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "pb-16" : ""}>
      <CharacterEquipmentContainer />
    </div>
  );
};

export default CharacterEquipment;
