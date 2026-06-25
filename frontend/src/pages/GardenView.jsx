/**
 * pages/GardenView.jsx
 *
 * Minimalist main view.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchEntries, createEntry, updateEntry, deleteEntry } from "../utils/api";
import CaptureBar from "../components/CaptureBar";
import FilterBar from "../components/FilterBar";
import EntryCard from "../components/EntryCard";
import EmptyState from "../components/EmptyState";

const GardenView = () => {
  const [entries, setEntries] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const loadEntries = useCallback(async () => {
    setIsFetching(true);
    setError("");
    try {
      const filters = activeFilter !== "all" ? { type: activeFilter } : {};
      const data = await fetchEntries(filters);
      setEntries(data);
    } catch (err) {
      setError("Couldn't reach the server.");
    } finally {
      setIsFetching(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleCapture = async (text) => {
    setIsLoading(true);
    setError("");
    try {
      const newEntry = await createEntry(text);
      setEntries((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError("Failed to save entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id, completed) => {
    try {
      const updated = await updateEntry(id, { completed });
      setEntries((prev) => prev.map((e) => (e._id === id ? updated : e)));
    } catch (err) {
      setError("Failed to update entry.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError("Failed to delete entry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans pb-32">
      <div className="max-w-2xl mx-auto px-4 pt-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              MindGarden
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Capture and organize your thoughts.
            </p>
          </div>
          <Link
            to="/focus"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <Zap size={14} className="text-amber-500" />
            Focus
          </Link>
        </header>

        {/* Filter Bar */}
        <div className="mb-6 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-sm py-2 z-40 border-b border-gray-100">
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-md mb-6 border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {isFetching ? (
          <div className="py-20 flex justify-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <EmptyState filterType={activeFilter} />
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {entries.map((entry) => (
                <EntryCard
                  key={entry._id}
                  entry={entry}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <CaptureBar onSubmit={handleCapture} isLoading={isLoading} />
    </div>
  );
};

export default GardenView;
