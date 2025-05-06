
// Function to save settings to local storage
export const saveSettings = (settings: any) => {
  try {
    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem('gameSettings', serializedSettings);
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};

// Function to load settings from local storage
export const loadSettings = () => {
  try {
    const serializedSettings = localStorage.getItem('gameSettings');
    if (serializedSettings === null) {
      return undefined;
    }
    return JSON.parse(serializedSettings);
  } catch (error) {
    console.error("Failed to load settings:", error);
    return undefined;
  }
};

// Function to apply settings (e.g., theme, font, font size)
export const applySettings = (settings: any) => {
  // Apply dark mode
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Apply font family
  document.body.className = document.body.className
    .replace(/font-(orbitron|rajdhani|space-mono|medieval|press-start|cinzel|exo2|poppins)/g, '')
    .trim();
  
  if (settings.font) {
    const fontClass = getFontClassById(settings.font);
    if (fontClass) {
      document.body.classList.add(fontClass);
    }
  } else {
    // Default to orbitron if no font specified
    document.body.classList.add('font-orbitron');
  }
  
  // Apply font size
  document.body.className = document.body.className
    .replace(/text-(sm|base|lg|xl|2xl|3xl)/g, '')
    .trim();
  
  if (settings.fontSize) {
    const sizeClass = getFontSizeClassById(settings.fontSize);
    if (sizeClass) {
      document.body.classList.add(sizeClass);
    }
  } else {
    // Default to base size if no size specified
    document.body.classList.add('text-base');
  }
  
  // Apply language to html lang attribute
  document.documentElement.setAttribute('lang', settings.language || 'en');
};

// Helper to get font class by ID
const getFontClassById = (fontId: string): string => {
  const fontMap: Record<string, string> = {
    orbitron: 'font-orbitron',
    rajdhani: 'font-rajdhani',
    spaceMono: 'font-space-mono',
    medievalSharp: 'font-medieval',
    pressStart: 'font-press-start',
    cinzelDecorative: 'font-cinzel',
    exo2: 'font-exo2',
    poppins: 'font-poppins'
  };
  
  return fontMap[fontId] || 'font-orbitron';
};

// Helper to get font size class by ID
const getFontSizeClassById = (sizeId: string): string => {
  const sizeMap: Record<string, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };
  
  return sizeMap[sizeId] || 'text-base';
};

// Define the structure for the settings
export interface GameSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  uiScale: number;
  language: string;
  font: string;
  fontSize: string;
  theme: string;
  progressStyle: string;
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    shadows: boolean;
    antialiasing: boolean;
    particles: boolean;
    reflections: boolean;
  };
}

// Default settings
export const defaultSettings: GameSettings = {
  darkMode: true,
  soundEnabled: true,
  musicVolume: 80,
  sfxVolume: 100,
  uiScale: 100,
  language: 'en',
  font: 'orbitron',
  fontSize: 'medium',
  theme: 'purple',
  progressStyle: 'default',
  graphics: {
    quality: 'high',
    shadows: true,
    antialiasing: true,
    particles: true,
    reflections: true
  }
};
