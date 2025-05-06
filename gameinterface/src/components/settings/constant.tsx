
// Shared types 
export interface UITheme {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
}

export interface FontFamily {
    id: string;
    name: string;
    className: string;
}

export interface FontSize {
    id: string;
    name: string;
    value: string;
}

export interface ProgressBarStyle {
    id: string;
    name: string;
    className: string;
}

// Available UI themes
export const uiThemes: UITheme[] = [
    { id: "purple", name: "Purple", primary: "#9b87f5", secondary: "#7E69AB", accent: "#33C3F0" },
    { id: "blue", name: "Blue", primary: "#3b82f6", secondary: "#2563eb", accent: "#38bdf8" },
    { id: "green", name: "Green", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
    { id: "red", name: "Red", primary: "#ef4444", secondary: "#dc2626", accent: "#f87171" },
    { id: "amber", name: "Amber", primary: "#f59e0b", secondary: "#d97706", accent: "#fbbf24" },
    { id: "pink", name: "Pink", primary: "#ec4899", secondary: "#db2777", accent: "#f472b6" },
    { id: "teal", name: "Teal", primary: "#14b8a6", secondary: "#0d9488", accent: "#2dd4bf" },
    { id: "indigo", name: "Indigo", primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8" },
];

// Font families - Added Poppins font
export const fontFamilies: FontFamily[] = [
    { id: "orbitron", name: "Orbitron", className: "font-orbitron" },
    { id: "rajdhani", name: "Rajdhani", className: "font-rajdhani" },
    { id: "spaceMono", name: "Space Mono", className: "font-space-mono" },
    { id: "medievalSharp", name: "Medieval Sharp", className: "font-medieval" },
    { id: "pressStart", name: "Press Start 2P", className: "font-press-start" },
    { id: "cinzelDecorative", name: "Cinzel Decorative", className: "font-cinzel" },
    { id: "exo2", name: "Exo 2", className: "font-exo2" },
    { id: "poppins", name: "Poppins", className: "font-poppins" },
];

// Font sizes
export const fontSizes: FontSize[] = [
    { id: "small", name: "Small", value: "text-sm" },
    { id: "medium", name: "Medium", value: "text-base" },
    { id: "large", name: "Large", value: "text-lg" },
    { id: "xl", name: "Extra Large", value: "text-xl" },
    { id: "2xl", name: "2X Large", value: "text-2xl" },
    { id: "3xl", name: "3X Large", value: "text-3xl" },
];

// Progress bar styles
export const progressBarStyles: ProgressBarStyle[] = [
    { id: "default", name: "Default", className: "bg-game-accent" },
    { id: "gradient", name: "Gradient", className: "bg-gradient-to-r from-blue-500 to-purple-500" },
    { id: "striped", name: "Striped", className: "bg-striped" },
    { id: "gold", name: "Gold", className: "bg-game-gold" },
    { id: "green", name: "Green", className: "bg-green-500" },
    { id: "red", name: "Red", className: "bg-red-500" },
];

