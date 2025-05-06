import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";
import LandingPage from "./pages/landingePage";

import { InventoryProvider } from "@/context/InventoryContext";
import { GameCurrencyProvider } from '@/context/GameCurrencyContext';
import { SettingsProvider } from "@/context/Settings";

import {
  saveSettings,
  loadSettings,
  defaultSettings,
  applySettings
} from "@/components/settings/SettingsUtils";

import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [settings, setSettings] = useState(() => {
    const loadedSettings = loadSettings() || defaultSettings;
    setTimeout(() => applySettings(loadedSettings), 0);
    return loadedSettings;
  });

  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  const currentFontClass = settings.font ?
    `font-${settings.font.toLowerCase().replace(/\s+/g, '-')}` :
    'font-orbitron';

  const currentFontSizeClass = settings.fontSize ?
    `text-${settings.fontSize.toLowerCase()}` :
    'text-base';

  return (
    <QueryClientProvider client={queryClient}>
      <InventoryProvider>
        <GameCurrencyProvider>
          <TooltipProvider>
            <div className={`${currentFontClass} ${currentFontSizeClass}`}>
              <Toaster />
              <Sonner />
              <SettingsProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/environment" element={<Index />} />
                  <Route path="/" element={<LandingPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              </SettingsProvider>
            </div>
          </TooltipProvider>
        </GameCurrencyProvider>
      </InventoryProvider>
    </QueryClientProvider>
  );
};

export default App;
