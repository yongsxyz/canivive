
import React, { useState, useEffect } from "react";
import { Shield, Heart, Swords, Coffee, Droplet, Zap, Smile, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Buff } from "@/types/buffs";

interface BuffDisplayProps {
  buffs: Buff[];
  onBuffExpired?: (buffId: number) => void;
}

const BuffDisplay: React.FC<BuffDisplayProps> = ({ buffs, onBuffExpired }) => {
  const [now, setNow] = useState<Date>(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (buffs.length === 0) return null;

  const getStatIcon = (stat: string) => {
    switch(stat) {
      case 'damage': return <Swords size={16} className="text-red-500" />;
      case 'health': return <Heart size={16} className="text-green-500" />;
      case 'armor': return <Shield size={16} className="text-blue-500" />;
      case 'hungry': return <Coffee size={16} className="text-amber-500" />;
      case 'thirst': return <Droplet size={16} className="text-cyan-500" />;
      case 'stamina': return <Zap size={16} className="text-yellow-500" />;
      case 'mood': return <Smile size={16} className="text-pink-500" />;
      default: return null;
    }
  };

  const getRemainingTime = (expiresAt: Date): number => {
    const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
    return diff;
  };

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.max(0, seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getStatName = (statType: string): string => {
    switch(statType) {
      case 'damage': return 'Damage';
      case 'health': return 'Health';
      case 'armor': return 'Armor';
      case 'hungry': return 'Hungry';
      case 'thirst': return 'Thirst';
      case 'stamina': return 'Stamina';
      case 'mood': return 'Mood';
      default: return statType.charAt(0).toUpperCase() + statType.slice(1);
    }
  };

  const getProgressPercent = (expiresAt: Date, buff: Buff) => {
    let totalDuration = 0;
    if (buff.itemName?.includes("Minor")) totalDuration = 60;
    else if (buff.itemName?.includes("Greater")) totalDuration = 180;
    else if (buff.itemName?.includes("Elixir")) totalDuration = 120;
    else totalDuration = 300;
    
    const remainingTime = getRemainingTime(expiresAt);
    return Math.max(0, Math.min(100, (remainingTime / totalDuration) * 100));
  };

  const getTimerClass = (expiresAt: Date) => {
    const remainingTime = getRemainingTime(expiresAt);
    if (remainingTime <= 5) return "animate-pulse text-red-500 font-bold";
    if (remainingTime <= 10) return "text-red-400 animate-pulse";
    return "text-gray-300";
  };

  const buffsByType = buffs.reduce((acc, buff) => {
    if (!acc[buff.statType]) {
      acc[buff.statType] = [];
    }
    acc[buff.statType].push(buff);
    return acc;
  }, {} as Record<string, Buff[]>);

  return (
    <div className="mt-4">
      <h4 className="font-semibold flex items-center gap-1 mb-2">
        Active Buffs <Clock size={16} className="text-blue-400" />
      </h4>
      <div className="space-y-2">
        {Object.entries(buffsByType).map(([statType, typedBuffs]) => {
          const totalBuff = typedBuffs.reduce((sum, buff) => sum + buff.value, 0);
          
          return (
            <div key={statType} className="space-y-1">
              <div className="flex items-center justify-between bg-game-dark bg-opacity-30 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  {getStatIcon(statType)}
                  <span className="capitalize">{getStatName(statType)}</span>
                </div>
                <div>
                  <span className={statType === 'damage' ? "text-red-500" : "text-green-500"}>
                    +{totalBuff} Total
                  </span>
                </div>
              </div>
              
              <div className="pl-4 space-y-1">
                {typedBuffs.map((buff, index) => {
                  const remainingTime = getRemainingTime(buff.expiresAt);
                  
                  if (remainingTime <= 0 && onBuffExpired) {
                    setTimeout(() => {
                      onBuffExpired(buff.timerId);
                    }, 0);
                    return null;
                  }
                  
                  return (
                    <TooltipProvider key={`${buff.statType}-${index}-${buff.timerId}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between bg-game-dark bg-opacity-20 p-1 rounded-md">
                            <div className="text-sm">
                              {buff.itemName || `${getStatName(buff.statType)} Buff`}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={buff.statType === 'damage' ? "text-red-400" : "text-green-400"}>
                                +{buff.value}
                              </span>
                              <span className={`text-xs bg-game-dark px-2 py-1 rounded ${getTimerClass(buff.expiresAt)}`}>
                                {formatTime(remainingTime)}
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700 z-[99999]">
                          <div className="text-xs space-y-1">
                            <div>Buff: +{buff.value} {getStatName(buff.statType)}</div>
                            <div>Time Left: {formatTime(remainingTime)}</div>
                            {buff.itemName && <div>Source: {buff.itemName}</div>}
                            <Progress 
                              value={getProgressPercent(buff.expiresAt, buff)} 
                              className="h-1"
                              indicatorClassName={`${remainingTime <= 10 ? "bg-red-500" : "bg-blue-500"}`} 
                            />
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuffDisplay;
