/**
 * pages/FocusView.jsx
 *
 * Minimalist focus view for urgent items.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchEntries, updateEntry, deleteEntry } from "../utils/api";
import EntryCard from "../components/EntryCard";

const FocusView = () => {
  const [urgentEntries, setUrgentEntries] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsFetching(true);
      try {
        const data = await fetchEntries({ completed: false });
        const focused = data.filter(
          (e) =>
            e.tags.includes("urgent") ||
            e.type === "reminder" ||
            (e.type === "task" && e.dueDate)
        );
        setUrgentEntries(focused);
      } catch (err) {
        setError("Couldn't load focus items.");
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, []);

  const handleComplete = async (id, completed) => {
    try {
      await updateEntry(id, { completed });
      setUrgentEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError("Failed to update entry.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      setUrgentEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError("Failed to delete entry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-12">
        <header className="mb-8 border-b border-gray-100 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-amber-500" />
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              Focus
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Action items requiring your immediate attention.
          </p>
        </header>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-md mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {isFetching ? (
          <div className="py-20 flex justify-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : urgentEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-12 h-12 bg-gray-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Inbox Zero
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              You're all caught up. No urgent items pending.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {urgentEntries.length} Items
            </p>
            <AnimatePresence mode="popLayout">
              {urgentEntries.map((entry) => (
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
    </div>
  );
};

export default FocusView;
