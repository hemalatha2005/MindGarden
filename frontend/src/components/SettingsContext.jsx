/**
 * components/SettingsContext.jsx - Global settings state management
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { settingsAPI } from "../utils/settingsApi";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  theme: "light",
  parserMode: "rules-based",
  enableNotifications: true,
};

/**
 * SettingsProvider - Wrap your app with this
 */
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const fetched = await settingsAPI.getSettings();
        if (fetched) {
          setSettings(fetched);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  const updateSettings = useCallback(
    async (updates) => {
      try {
        const updated = await settingsAPI.updateSettings(updates);
        setSettings((prev) => ({ ...prev, ...updates }));
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const resetSettings = useCallback(async () => {
    try {
      const reset = await settingsAPI.resetSettings();
      setSettings(reset);
      return reset;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

/**
 * useSettings - Hook to access settings anywhere in the app
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
