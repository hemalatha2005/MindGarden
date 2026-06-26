/**
 * utils/settingsApi.js - API calls for user settings
 */

import axios from "axios";
import { getSession } from "./authApi";

const API_BASE = "/api";

const authConfig = () => {
  const token = getSession()?.token;
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const settingsAPI = {
  /**
   * Fetch current user settings from server
   * Falls back to localStorage if server is unavailable
   */
  async getSettings() {
    try {
      const response = await axios.get(`${API_BASE}/settings`, authConfig());
      return response.data.data;
    } catch (error) {
      console.warn("Could not fetch settings from server, using local fallback");
      const local = localStorage.getItem("mindgarden_settings");
      return local ? JSON.parse(local) : null;
    }
  },

  /**
   * Update user settings on server
   */
  async updateSettings(updates) {
    try {
      const response = await axios.patch(`${API_BASE}/settings`, updates, authConfig());
      // Also save to localStorage for offline support
      const current = localStorage.getItem("mindgarden_settings");
      const merged = { ...JSON.parse(current || "{}"), ...updates };
      localStorage.setItem("mindgarden_settings", JSON.stringify(merged));
      return response.data.data;
    } catch (error) {
      console.warn("Could not update settings on server, saving locally only");
      const current = localStorage.getItem("mindgarden_settings");
      const merged = { ...JSON.parse(current || "{}"), ...updates };
      localStorage.setItem("mindgarden_settings", JSON.stringify(merged));
      return merged;
    }
  },

  /**
   * Reset settings to defaults
   */
  async resetSettings() {
    try {
      const response = await axios.post(`${API_BASE}/settings/reset`, {}, authConfig());
      localStorage.removeItem("mindgarden_settings");
      return response.data.data;
    } catch (error) {
      console.error("Error resetting settings:", error);
      throw error;
    }
  },
};
