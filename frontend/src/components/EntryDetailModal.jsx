import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, Clock, Save, Tag, Trash2, X } from "lucide-react";
import TypeBadge from "./TypeBadge";

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const EntryDetailModal = ({ entry, isOpen, isSaving, onClose, onSave, onComplete, onDelete }) => {
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    if (entry) setDraftText(entry.text || "");
  }, [entry]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!entry) return null;

  const hasChanges = draftText.trim() !== entry.text;
  const canSave = draftText.trim().length > 0 && hasChanges && !isSaving;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSave) return;
    await onSave(entry._id, draftText.trim());
  };

  const handleDelete = async () => {
    await onDelete(entry._id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-gray-950/35 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close entry details"
          />

          <motion.form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={entry.type} size="md" />
                {entry.parsedBy === "ai" && (
                  <span className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                    AI parsed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onComplete(entry._id, !entry.completed)}
                  className="rounded-md p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                  title={entry.completed ? "Restore" : "Complete"}
                >
                  <Check size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(88vh-132px)] overflow-y-auto px-5 py-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {entry.dueDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                    <Calendar size={13} />
                    {formatDateTime(entry.dueDate)}
                  </span>
                )}
                {entry.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    <Tag size={13} />
                    {tag}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500">
                  <Clock size={13} />
                  {formatDateTime(entry.createdAt)}
                </span>
              </div>

              <label htmlFor="entry-detail-text" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Full capture
              </label>
              <textarea
                id="entry-detail-text"
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                className="min-h-[220px] w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 shadow-inner outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                placeholder="Write the full note, task, reminder, or idea..."
              />

              <p className="mt-3 text-xs text-gray-500">
                Saving re-runs parsing, so type, tags, summary, and due date update from the new text.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3">
              <p className="text-xs text-gray-500">
                {hasChanges ? "Unsaved edits" : "No edits yet"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSave}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={15} />
                  {isSaving ? "Saving" : "Save"}
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryDetailModal;
