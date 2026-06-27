/**
 * pages/GardenView.jsx
 *
 * Main feed view, utilizing a denser layout with CaptureBar at the top.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEntries, createEntry, updateEntry, deleteEntry } from "../utils/api";
import CaptureBar from "../components/CaptureBar";
import EntryCard from "../components/EntryCard";
import EmptyState from "../components/EmptyState";
import InsightPanel from "../components/InsightPanel";
import EntryDetailModal from "../components/EntryDetailModal";

const GardenView = ({ activeFilter }) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

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
      const created = await createEntry(text);
      const newEntries = Array.isArray(created) ? created : [created];
      setEntries((prev) => [...newEntries, ...prev]);
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
      setSelectedEntry((current) => (current?._id === id ? updated : current));
    } catch (err) {
      setError("Failed to update entry.");
    }
  };

  const handleSaveEntry = async (id, text) => {
    setIsSavingEntry(true);
    setError("");
    try {
      const updated = await updateEntry(id, { text });
      setEntries((prev) => prev.map((e) => (e._id === id ? updated : e)));
      setSelectedEntry(null);
    } catch (err) {
      setError("Failed to save edits.");
    } finally {
      setIsSavingEntry(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      setSelectedEntry((current) => (current?._id === id ? null : current));
    } catch (err) {
      setError("Failed to delete entry.");
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 capitalize">
              {activeFilter === "all" ? "Inbox" : `${activeFilter}s`}
            </h1>
          </header>

          <CaptureBar onSubmit={handleCapture} isLoading={isLoading} />

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

          {isFetching ? (
            <div className="py-20 flex justify-center">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
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
                    onOpen={setSelectedEntry}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Side Insight Panel */}
      <InsightPanel entries={entries} />

      <EntryDetailModal
        entry={selectedEntry}
        isOpen={Boolean(selectedEntry)}
        isSaving={isSavingEntry}
        onClose={() => setSelectedEntry(null)}
        onSave={handleSaveEntry}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    </>
  );
};

export default GardenView;
