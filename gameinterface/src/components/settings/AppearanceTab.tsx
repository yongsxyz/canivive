
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { getTranslation } from "./TranslationUtils";

import {
  UITheme,
  FontFamily,
  FontSize,
  ProgressBarStyle,
  uiThemes,
  fontFamilies,
  fontSizes,
  progressBarStyles
} from "./constant";

interface AppearanceTabProps {
  settings: any;
  updateSettings: (path: string, value: any) => void;
  resetSettings: () => void;
  onClose?: () => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ settings, updateSettings, resetSettings, onClose  }) => {
  // Get current language
  const language = settings.language || 'en';
  
  // Translation function
  const t = (key: string) => getTranslation(key, language);
  
  // Function to apply font and size immediately
  const applyFont = (fontId: string) => {
    const fontClass = fontFamilies.find(f => f.id === fontId)?.className || 'font-orbitron';
    document.body.className = document.body.className
      .replace(/font-(orbitron|rajdhani|space-mono|medieval|press-start|cinzel|exo2|poppins)/g, '')
      .trim();
    document.body.classList.add(fontClass);
    updateSettings('font', fontId);
  };
  
  // Function to apply font size immediately
  const applyFontSize = (sizeId: string) => {
    const sizeClass = fontSizes.find(s => s.id === sizeId)?.value || 'text-base';
    document.body.className = document.body.className
      .replace(/text-(sm|base|lg|xl|2xl|3xl)/g, '')
      .trim();
    document.body.classList.add(sizeClass);
    updateSettings('fontSize', sizeId);
  };

  const handleSaveSettings = () => {
    // Apply font and size settings immediately
    applyFont(settings.font);
    applyFontSize(settings.fontSize);
    
    setTimeout(() => {
      window.location.reload();
    }, 300);

    // Provide visual confirmation to the user
    toast({
      title: t("settingsSaved") || "Settings Saved",
      description: t("appearanceSettingsSaved") || "Your appearance settings have been saved",
    });

    if (onClose) {
      onClose();
    }

  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
       
        <div className="flex justify-end space-x-4">
            <button 
              onClick={resetSettings}
              className="px-4 py-2 bg-game-destructive hover:bg-opacity-80 rounded-md"
            >
              Reset All Settings
            </button>
            <button 
              onClick={handleSaveSettings}
              className="game-button"
            >
          {t("saveSettings")}
            </button>
          </div>


      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold border-b border-game-secondary pb-2">{t("uiTheme")}</h3>
          
          <div className="flex items-center justify-between">
            <label className="font-medium">{t("darkMode")}</label>
            <Switch 
              checked={settings.darkMode} 
              onCheckedChange={(checked) => updateSettings('darkMode', checked)} 
            />
          </div>
          
          <div>
            <label className="block mb-2">{t("colorTheme")}</label>
            <div className="grid grid-cols-4 gap-2">
              {uiThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`w-full h-10 rounded-md border-2 transition-all ${
                    settings.theme === theme.id ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                  onClick={() => updateSettings('theme', theme.id)}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block mb-2">{t("fontFamily")}</label>
            <Select 
              value={settings.font} 
              onValueChange={(value) => applyFont(value)}
            >
              <SelectTrigger className="game-select w-full">
                <SelectValue placeholder={t("selectFont")} />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.id} value={font.id} className={font.className}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">{t("fontSize")}</label>
            <Select 
              value={settings.fontSize} 
              onValueChange={(value) => applyFontSize(value)}
            >
              <SelectTrigger className="game-select w-full">
                <SelectValue placeholder={t("selectSize")} />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-bold border-b border-game-secondary pb-2">{t("elements")}</h3>
          
          <div>
            <label className="block mb-2">{t("progressBarStyle")}</label>
            <Select 
              value={settings.progressStyle} 
              onValueChange={(value) => updateSettings('progressStyle', value)}
            >
              <SelectTrigger className="game-select w-full">
                <SelectValue placeholder={t("selectStyle")} />
              </SelectTrigger>
              <SelectContent>
                {progressBarStyles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-2">
              <Progress 
                value={75} 
                className={`h-4 bg-muted rounded overflow-hidden`}
                indicatorClassName={progressBarStyles.find(s => s.id === settings.progressStyle)?.className}
              />
            </div>
          </div>
          
          <div className="border p-4 rounded-md bg-game-dark bg-opacity-50 mt-4">
            <h4 className="font-bold mb-2">{t("preview")}</h4>
            <div className={`space-y-2 ${fontFamilies.find(f => f.id === settings.font)?.className || 'font-orbitron'} ${fontSizes.find(s => s.id === settings.fontSize)?.value || 'text-base'}`}>
              <div className="rounded-md p-3" style={{ backgroundColor: uiThemes.find(t => t.id === settings.theme)?.secondary }}>
                {t("sampleTextBlock")}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md" style={{ backgroundColor: uiThemes.find(t => t.id === settings.theme)?.primary }}>
                  {t("button")}
                </button>
                <button className="px-3 py-1 rounded-md" style={{ backgroundColor: uiThemes.find(t => t.id === settings.theme)?.accent }}>
                  {t("accent")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
