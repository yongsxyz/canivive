
import React from "react";
import { Shield, Award } from "lucide-react";
import LevelBadge from "./LevelBadge";
import { getTranslation } from "../settings/TranslationUtils";

interface CharacterProfileProps {
  name: string;
  level: number;
  experiencePercentage: number;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ name, level, experiencePercentage }) => {
  // Get the language from localStorage or use English as default
  const language = localStorage.getItem('settings') 
    ? JSON.parse(localStorage.getItem('settings') || '{}').language || 'en'
    : 'en';
  
  const t = (key: string) => getTranslation(key, language);
  
  return (
    <div className="flex flex-col items-center">
    
      
      <h3 className="text-xl font-bold text-game-primary mb-1">{name}</h3>
      
      <div className="w-full mb-2 relative">
  {/* Level Badge & Info - Ditempatkan di atas progress bar */}
  <div className="flex justify-center mb-1">
    <div className="flex items-center gap-2 bg-game-dark/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
      <LevelBadge 
        level={level}
        experiencePercentage={experiencePercentage}
      />
      <div className="flex items-center gap-1 md:gap-2">
        <Award size={14} className="text-game-gold flex-shrink-0" />
        <p className="text-xs md:text-sm text-game-light">
          {t("adventurer")}
        </p>
      </div>
    </div>
  </div>

  {/* Experience Bar */}
  <div className="relative h-3 md:h-4 w-full bg-game-dark rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-game-primary to-game-accent transition-all duration-300 ease-out" 
      style={{ width: `${experiencePercentage}%` }}
    ></div>
<span className="absolute inset-0 flex items-center justify-center xs:text-xs font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
  {experiencePercentage}%
</span>
  </div>
</div>
      
      {/* <div className="w-full">
        <div className="flex justify-between text-mx mb-1">
          <span className="font-semibold">{t("level")} {level}</span>
          <span>{experiencePercentage}%</span>
        </div>
        <div className="w-full h-2 bg-game-dark rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-game-primary to-game-accent" 
            style={{ width: `${experiencePercentage}%` }}
          ></div>
        </div>
      </div> */}
    </div>
  );
};

export default CharacterProfile;
