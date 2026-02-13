import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCompactMode,
  setDarkMode,
  setFontSize,
  setPrimaryColor,
} from "@/redux/slices/settingsSlice";
import isMobile from "is-mobile";
import { useEffect, useMemo, useState } from "react";

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const [systemDarkMode, setSystemDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const updateCompactMode = (mode: "yes" | "no" | "auto") => {
    dispatch(setCompactMode(mode));
  };

  const isCompactMode = useMemo(() => {
    const compactModeSetting = settings.theme.compactMode;
    if (compactModeSetting === "auto") {
      return isMobile();
    }
    return compactModeSetting === "yes";
  }, [settings.theme.compactMode]);

  const isDarkMode = useMemo(() => {
    const darkModeSetting = settings.theme.darkMode;
    if (darkModeSetting === "auto") {
      return systemDarkMode;
    }
    return darkModeSetting === "yes";
  }, [settings.theme.darkMode, systemDarkMode]);

  const actualFontSize = useMemo(() => {
    const fontSizeSetting = settings.theme.fontSize;
    if (fontSizeSetting === "auto") {
      return isMobile() ? "large" : "medium";
    }
    return fontSizeSetting;
  }, [settings.theme.fontSize]);

  const updateDarkMode = (mode: "yes" | "no" | "auto") => {
    dispatch(setDarkMode(mode));
  };

  const updateFontSize = (size: "small" | "medium" | "large" | "auto") => {
    dispatch(setFontSize(size));
  };

  const updatePrimaryColor = (color: string) => {
    dispatch(setPrimaryColor(color));
  };
  return {
    compactMode: settings.theme.compactMode, 
    isCompactMode, 
    darkMode: settings.theme.darkMode, 
    isDarkMode, 
    fontSize: settings.theme.fontSize, 
    actualFontSize, 
    primaryColor: settings.theme.primaryColor,
    settings,

    updateCompactMode,
    updateDarkMode,
    updateFontSize,
    updatePrimaryColor,
  };
};
