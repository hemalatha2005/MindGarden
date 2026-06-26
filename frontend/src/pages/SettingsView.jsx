/**
 * pages/SettingsView.jsx - Simple settings page
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../components/SettingsContext";

const SettingsView = () => {
  const { settings, updateSettings } = useSettings();
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showSuccess = () => {
    setSavedMessage("✓ Saved");
    setErrorMessage("");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setSavedMessage("");
    setTimeout(() => setErrorMessage(""), 2000);
  };

  const handleChange = async (key, value) => {
    try {
      await updateSettings({ [key]: value });
      showSuccess();
    } catch (error) {
      showError("Failed to save");
    }
  };

  if (!settings) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 max-w-2xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 border-b border-gray-100 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </header>

        {/* Messages */}
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg"
          >
            <Check size={16} />
            {savedMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg"
          >
            <AlertCircle size={16} />
            {errorMessage}
          </motion.div>
        )}

        {/* Settings */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Theme */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Theme</p>
                <p className="text-sm text-gray-500">Light or dark mode</p>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>

          {/* Parser Mode */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Parser Mode</p>
                <p className="text-sm text-gray-500">How to parse your entries</p>
              </div>
              <select
                value={settings.parserMode}
                onChange={(e) => handleChange("parserMode", e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="rules-based">Rules-Based</option>
                <option value="ai">AI-Powered</option>
              </select>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Get notified about reminders</p>
              </div>
              <button
                onClick={() => handleChange("enableNotifications", !settings.enableNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableNotifications ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsView;
