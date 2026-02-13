
export interface ThemeSettings {
  compactMode: "yes" | "no" | "auto"; 
  darkMode: "yes" | "no" | "auto"; 
  fontSize: "small" | "medium" | "large" | "auto"; 
  primaryColor: string; 
}

export interface SettingsState {
  theme: ThemeSettings;
}
