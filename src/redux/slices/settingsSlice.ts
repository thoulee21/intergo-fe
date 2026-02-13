import type { SettingsState } from "@/types/settings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SettingsState = {
  theme: {
    compactMode: "auto", 
    darkMode: "auto", 
    fontSize: "auto", 
    primaryColor: "#1890ff", 
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCompactMode: (state, action: PayloadAction<"yes" | "no" | "auto">) => {
      state.theme.compactMode = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<"yes" | "no" | "auto">) => {
      state.theme.darkMode = action.payload;
    },
    setFontSize: (
      state,
      action: PayloadAction<"small" | "medium" | "large" | "auto">,
    ) => {
      state.theme.fontSize = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.theme.primaryColor = action.payload;
    },
    resetSettings: (state) => {
      state.theme = initialState.theme;
    },
  },
});

export const {
  setCompactMode,
  setDarkMode,
  setFontSize,
  setPrimaryColor,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
