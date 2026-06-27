import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchEntries, updateEntry, deleteEntry } from "../utils/api";
import EntryCard from "../components/EntryCard";
import InsightPanel from "../components/InsightPanel";

const FocusView = () => {
  const [urgentEntries, setUrgentEntries] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsFetching(true);
      try {
        const data = await fetchEntries({ completed: false });
        const now = new Date();
        const tomorrowEnd = new Date(now);
        tomorrowEnd.setDate(now.getDate() + 1);
        tomorrowEnd.setHours(23, 59, 59, 999);

        const focused = data.filter((e) => {
          if (e.tags.includes("urgent")) return true;
          if (e.dueDate) {
            const due = new Date(e.dueDate);
            if (due <= tomorrowEnd) return true;
          }
          return false;
        });
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

  const handleSaveEntry = async (id, text) => {
    try {
      const updated = await updateEntry(id, { text });
      setUrgentEntries((prev) => prev.map((e) => (e._id === id ? updated : e)));
    } catch (err) {
      setError("Failed to save edits.");
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
    <>
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <header className="mb-6 border-b border-garden-border pb-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-garden-muted hover:text-garden-text mb-4 transition-colors font-medium">
              <ArrowLeft size={14} />
              Back to Inbox
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded-md bg-amber-400/10">
                <Zap size={18} className="text-amber-400" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-garden-heading">Focus Mode</h1>
            </div>
            <p className="text-[13px] text-garden-muted">Action items requiring your immediate attention.</p>
          </header>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-500/10 text-red-400 text-[13px] px-4 py-3 rounded-lg mb-4 border border-red-500/20">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {isFetching ? (
            <div className="py-20 flex justify-center">
              <div className="w-5 h-5 border-2 border-garden-border border-t-amber-400 rounded-full animate-spin" />
            </div>
          ) : urgentEntries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-garden-elevated text-emerald-400 rounded-xl flex items-center justify-center mb-4 border border-garden-border">
                <CheckCircle size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold text-garden-heading mb-1">Inbox Zero</h3>
              <p className="text-[13px] text-garden-muted max-w-xs">You're all caught up. No urgent items pending.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-1">{urgentEntries.length} Items</p>
              <AnimatePresence mode="popLayout">
                {urgentEntries.map((entry) => (
                  <EntryCard key={entry._id} entry={entry} onComplete={handleComplete} onDelete={handleDelete} onUpdate={handleSaveEntry} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <InsightPanel entries={urgentEntries} />
    </>
  );
};

export default FocusView;
