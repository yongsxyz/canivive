
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslation } from "./TranslationUtils";

interface LanguageTabProps {
  settings: any;
  updateSettings: (path: string, value: any) => void;
}

const LanguageTab: React.FC<LanguageTabProps> = ({ settings, updateSettings }) => {
  const isIndonesian = settings.language === 'id';
  const t = (key: string) => getTranslation(key, settings.language);
  
  return (
    <Card className="border-game-primary bg-game-card">
      <CardHeader>
        <CardTitle className="text-game-primary">{t("languageSettings")}</CardTitle>
        <CardDescription>{t("chooseLanguage")}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          defaultValue={settings.language || 'en'} 
          onValueChange={(value) => updateSettings('language', value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="en" />
            <Label htmlFor="en">{t("english")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="id" id="id" />
            <Label htmlFor="id">{t("indonesian")}</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default LanguageTab;
