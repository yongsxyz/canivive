
import React, { useState } from "react";
import { Trophy, Award, Star, Medal, Shield } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getTranslation } from "../settings/TranslationUtils";

interface LevelBadgeProps {
  level: number;
  experiencePercentage: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, experiencePercentage }) => {
  // Get the language from localStorage or use English as default
  const language = localStorage.getItem('settings') 
    ? JSON.parse(localStorage.getItem('settings') || '{}').language || 'en'
    : 'en';
  
  const t = (key: string) => getTranslation(key, language);
  
  const getBadgeTier = () => {
    if (level >= 75) return 4; // Elite / Veteran
    if (level >= 50) return 3; // Specialist / Advanced
    if (level >= 25) return 2; // Survivor / Intermediate
    return 1; // Rookie / Pemula
  };

  const getTierName = (tier: number) => {
    switch(tier) {
      case 4: return "Elite / Veteran";
      case 3: return "Specialist / Advanced";
      case 2: return "Survivor / Intermediate";
      case 1: default: return "Rookie / Pemula";
    }
  };

  const getBadgeColor = (tier: number) => {
    switch(tier) {
      case 4: return "bg-red-500 hover:bg-red-600";
      case 3: return "bg-orange-500 hover:bg-orange-600";
      case 2: return "bg-yellow-500 hover:bg-yellow-600";
      case 1: default: return "bg-green-500 hover:bg-green-600";
    }
  };

  const getBadgeIcon = (tier: number) => {
    switch(tier) {
      case 4: return <Trophy size={14} className="mr-1" />;
      case 3: return <Medal size={14} className="mr-1" />;
      case 2: return <Star size={14} className="mr-1" />;
      case 1: default: return <Shield size={14} className="mr-1" />;
    }
  };

  const tier = getBadgeTier();
  const tierName = getTierName(tier);
  const badgeColor = getBadgeColor(tier);

  // Milestones for each tier
  const getTierMilestones = (tier: number) => {
    switch(tier) {
      case 1:
        return [
          "Fresh Spawn – Just spawned on the beach, still naive.",
          "First Loot – First time getting a decent weapon/gear.",
          "Wilderness Walker – Starting to explore forests and venture far from the coast.",
          "Campfire Starter – Can now make fire & cook food.",
          "Friendly Finder – First time meeting another survivor without getting killed."
        ];
      case 2:
        return [
          "Scavenger – Skilled at looting in dead towns.",
          "Nomad – No base, always on the move.",
          "First Blood – First PvP or first kill on a threatening zombie.",
          "Radio Rookie – Started using the radio for communication.",
          "Basic Medic – Can now help others heal (bandages, saline, etc.)."
        ];
      case 3:
        return [
          "Ghost – Can enter and exit major cities undetected.",
          "Silent Killer – PvP without a sound, stealth expert.",
          "Wilderness Medic – Can revive and treat anyone in extreme conditions.",
          "Map Master – Knows all military, water, medical, and rotation locations.",
          "Supply Runner – Often helps supply gear to the team or other players."
        ];
      case 4:
        return [
          "Lone Wolf – Survives alone, even in red zones.",
          "The Warlord – Group leader, controls territory.",
          "Legendary Survivor – Known for a long survival story.",
          "Blood Moon Veteran – Survived major events/zombie apocalypses.",
          "Shadow Walker – Never seen, but their presence is felt.",
          "The Relic – A veteran player since the first wipe/early server days."
        ];
      default:
        return [];
    }
  };
  

  const allTiers = [
    { id: 1, name: "Rookie", color: "bg-green-500", icon: <Shield size={14} /> },
    { id: 2, name: "Adventure", color: "bg-yellow-500", icon: <Star size={14} /> },
    { id: 3, name: "Specialist", color: "bg-orange-500", icon: <Medal size={14} /> },
    { id: 4, name: "Elite", color: "bg-red-500", icon: <Trophy size={14} /> }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer inline-flex">
          <Badge className={`${badgeColor} transition-all flex items-center`}>
            {getBadgeIcon(tier)}
            <span>{t("level")} {level}</span>
          </Badge>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">{t("playerLevelBadges")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">{t("level")} {level}</h3>
              <span className="text-sm text-gray-400">
                {level < 100 ? `${100 - level} ${t("levelsToMax")}` : t("maxLevel")}
              </span>
            </div>
            <Progress value={experiencePercentage} className="h-2" />
            <div className="flex justify-between text-xs mt-1">
              <span>XP: {experiencePercentage}%</span>
              <span>{t("nextLevel")}: {Math.min(level + 1, 100)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t("currentTier")}: {tierName}</h3>
            <div className="grid gap-2">
              {getTierMilestones(tier).map((milestone, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded-md">
                  {milestone}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t("allTiers")}</h3>
            <div className="space-y-3">
              {allTiers.map((tierItem) => (
                <div key={tierItem.id} className={`p-2 rounded-md flex items-center gap-2 ${tierItem.id === tier ? tierItem.color + ' bg-opacity-30' : 'bg-gray-800'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tierItem.color}`}>
                    {tierItem.icon}
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${tierItem.id === tier ? 'text-white' : 'text-gray-300'}`}>
                      {tierItem.name}
                    </span>
                    <div className="text-xs text-gray-400">
                      {tierItem.id === 1 ? "Levels 1-24" : 
                       tierItem.id === 2 ? "Levels 25-49" : 
                       tierItem.id === 3 ? "Levels 50-74" : "Levels 75-100"}
                    </div>
                  </div>
                  {tierItem.id === tier && (
                    <Badge className={`${tierItem.color} text-xs`}>{t("current")}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelBadge;
