
import React, { useEffect, useState } from "react";
import { X, Sliders, Monitor, Cpu, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import AppearanceTab from "./AppearanceTab";
import GraphicsTab from "./GraphicsTab";
import PerformanceTab from "./PerformanceTab";
import { 
  saveSettings, 
  loadSettings, 
  defaultSettings, 
  applySettings 
} from "./SettingsUtils";
import LanguageTab from "./LanguageTab";
import { getTranslation } from "./TranslationUtils";

interface GameSettingsProps {
  onClose: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState(() => {
    const loadedSettings = loadSettings() || defaultSettings;
    setTimeout(() => applySettings(loadedSettings), 0);
    return loadedSettings;
  });
  
  const [activeTab, setActiveTab] = useState("appearance");
  
  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  const t = (key: string) => getTranslation(key, settings.language);

  // Update settings
  const updateSettings = (path: string, value: any) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings };
      
      if (path.includes('.')) {
        const [section, key] = path.split('.');
        newSettings[section] = { 
          ...newSettings[section], 
          [key]: value 
        };
      } else {
        newSettings[path] = value;
      }
      
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: t("settingsReset"),
      description: t("settingsResetDesc"),
    });
  };

  const currentFontClass = settings.font ? 
    `font-${settings.font.toLowerCase().replace(/\s+/g, '-')}` : 
    'font-orbitron';

  const currentFontSizeClass = settings.fontSize ?
    `text-${settings.fontSize.toLowerCase()}` :
    'text-base';

  return (
<div className="scrollbar scrollbar-thin fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
  <div className={`game-ui max-w-4xl w-full max-h-[80vh] overflow-y-auto ${settings.darkMode ? 'dark' : ''} ${currentFontClass} ${currentFontSizeClass}`}>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-game-primary">
        {t("gameSettings")}
      </h2>
      <button onClick={onClose} className="p-2 hover:bg-game-dark rounded-full">
        <X size={24} className="text-game-primary" />
      </button>
    </div>
    
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* Responsive TabsList */}
      <div className="relative mb-6">
        <TabsList className="w-full bg-game-dark overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
          <div className="inline-flex space-x-1">
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-game-dark px-4 py-2"
            >
              <Sliders className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("uiAppearance")}</span>
              <span className="sm:hidden">UI</span>
            </TabsTrigger>
            <TabsTrigger 
              value="graphics" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-game-dark px-4 py-2"
            >
              <Monitor className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("graphics")}</span>
              <span className="sm:hidden">GFX</span>
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-game-dark px-4 py-2"
            >
              <Cpu className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("performance")}</span>
              <span className="sm:hidden">Perf</span>
            </TabsTrigger>
            <TabsTrigger 
              value="language" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-game-dark px-4 py-2"
            >
              <Globe className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("language")}</span>
              <span className="sm:hidden">Lang</span>
            </TabsTrigger>
          </div>
        </TabsList>
      </div>
      
      {/* Responsive TabsContent */}
      <div className="overflow-auto">
        <TabsContent value="appearance" className="mt-0 min-w-[300px]">
          <AppearanceTab 
            settings={settings} 
            updateSettings={updateSettings} 
            resetSettings={resetSettings} 
            onClose={onClose}
          />
        </TabsContent>
        
        <TabsContent value="graphics" className="mt-0 min-w-[300px]">
          <GraphicsTab 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0 min-w-[300px]">
          <PerformanceTab 
            resetSettings={resetSettings} 
          />
        </TabsContent>

        <TabsContent value="language" className="mt-0 min-w-[300px]">
          <LanguageTab 
            settings={settings} 
            updateSettings={updateSettings} 
          />
        </TabsContent>
      </div>
    </Tabs>
  </div>
</div>
  );
};

export default GameSettings;
