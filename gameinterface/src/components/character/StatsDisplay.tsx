
import React from "react";
import { Shield, Heart, Swords, Coffee, Droplet, Zap, Smile } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Stats {
  damage: number;
  health: number;
  armor: number;
  hungry: number;
  thirst: number;
  stamina: number;
  mood: number;
}

interface StatsDisplayProps {
  stats: Stats;
  buffs?: {[key: string]: number}; // Temporary buffs from potions
  equipmentMaxBonus?: {[key: string]: number}; // Permanent max stat increases from equipment
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  stats, 
  buffs = {}, 
  equipmentMaxBonus = {} 
}) => {
  const getBuffedValue = (key: keyof Stats) => {
    return buffs[key] || 0;
  };

  const getEquipmentBonus = (key: keyof Stats) => {
    return equipmentMaxBonus[key] || 0;
  };

  const getTotalMaxValue = (key: keyof Stats) => {
    return 100 + getBuffedValue(key) + getEquipmentBonus(key);
  };

  const formatDamage = (value: number) => {
    const baseDamage = value + (buffs.damage || 0) + (equipmentMaxBonus.damage || 0);
    const buffAmount = buffs.damage || 0;
    const equipmentAmount = equipmentMaxBonus.damage || 0;
    
    return (
      <div className="flex items-center">
        <span>{Math.floor(baseDamage)}</span>
        {buffAmount > 0 && (
          <span className="text-green-500 ml-1">+{Math.floor(buffAmount)}</span>
        )}
        {equipmentAmount > 0 && (
          <span className="text-blue-500 ml-1">+{Math.floor(equipmentAmount)}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Character Stats</h4>
      
      <TooltipProvider>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Swords size={16} className="text-red-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Damage: {stats.damage}</p>
                {getBuffedValue('damage') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('damage')}</p>}
                {getEquipmentBonus('damage') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('damage')}</p>}
              </TooltipContent>
            </Tooltip>
            <div className="flex-grow flex justify-between items-center">
              <span className="text-sm">Damage</span>
              <div className="text-right">{formatDamage(stats.damage)}</div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Heart size={16} className="text-green-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Health: {stats.health}</p>
                  {getBuffedValue('health') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('health')}</p>}
                  {getEquipmentBonus('health') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('health')}</p>}
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm">Health</span>
                  <span>{stats.health}/{getTotalMaxValue('health')}</span>
                </div>
                <Progress value={stats.health} max={getTotalMaxValue('health')} className="h-2" indicatorClassName="bg-green-500" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Shield size={16} className="text-blue-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Armor: {stats.armor}</p>
                  {getBuffedValue('armor') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('armor')}</p>}
                  {getEquipmentBonus('armor') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('armor')}</p>}
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm">Armor</span>
                  <span>{stats.armor}/{getTotalMaxValue('armor')}</span>
                </div>
                <Progress value={stats.armor} max={getTotalMaxValue('armor')} className="h-2" indicatorClassName="bg-blue-500" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 bg-amber-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Coffee size={16} className="text-amber-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Hungry: {stats.hungry}</p>
                  {getBuffedValue('hungry') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('hungry')}</p>}
                  {getEquipmentBonus('hungry') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('hungry')}</p>}
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm">Hungry</span>
                  <span>{stats.hungry}/{getTotalMaxValue('hungry')}</span>
                </div>
                <Progress value={stats.hungry} max={getTotalMaxValue('hungry')} className="h-2" indicatorClassName="bg-amber-500" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 bg-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Droplet size={16} className="text-cyan-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Thirst: {stats.thirst}</p>
                  {getBuffedValue('thirst') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('thirst')}</p>}
                  {getEquipmentBonus('thirst') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('thirst')}</p>}
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm">Thirst</span>
                  <span>{stats.thirst}/{getTotalMaxValue('thirst')}</span>
                </div>
                <Progress value={stats.thirst} max={getTotalMaxValue('thirst')} className="h-2" indicatorClassName="bg-cyan-500" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Zap size={16} className="text-yellow-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Stamina: {stats.stamina}</p>
                  {getBuffedValue('stamina') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('stamina')}</p>}
                  {getEquipmentBonus('stamina') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('stamina')}</p>}
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm">Stamina</span>
                  <span>{stats.stamina}/{getTotalMaxValue('stamina')}</span>
                </div>
                <Progress value={stats.stamina} max={getTotalMaxValue('stamina')} className="h-2" indicatorClassName="bg-yellow-500" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 bg-pink-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Smile size={16} className="text-pink-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Mood: {stats.mood}</p>
                  {getBuffedValue('mood') > 0 && <p className="text-green-500">Buff: +{getBuffedValue('mood')}</p>}
                  {getEquipmentBonus('mood') > 0 && <p className="text-blue-500">Equipment: +{getEquipmentBonus('mood')}</p>}
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm">Mood</span>
                  <span>{stats.mood}/{getTotalMaxValue('mood')}</span>
                </div>
                <Progress value={stats.mood} max={getTotalMaxValue('mood')} className="h-2" indicatorClassName="bg-pink-500" />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default StatsDisplay;
