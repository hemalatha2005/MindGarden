import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, Clock, Save, Tag, Trash2, X } from "lucide-react";
import TypeBadge from "./TypeBadge";

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const EntryDetailModal = ({ entry, isOpen, isSaving, onClose, onSave, onComplete, onDelete }) => {
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    if (entry) setDraftText(entry.text || "");
  }, [entry]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKeyDown); };
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
          <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close" />

          <motion.form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-xl border border-garden-border bg-garden-surface shadow-float"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-garden-border px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={entry.type} size="md" />
                {entry.parsedBy === "ai" && (
                  <span className="rounded-md bg-garden-primary/10 px-2 py-1 text-xs font-semibold text-garden-primary">AI parsed</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => onComplete(entry._id, !entry.completed)} className="rounded-md p-2 text-garden-muted hover:bg-garden-primary/10 hover:text-garden-primary transition-colors" title={entry.completed ? "Restore" : "Complete"}>
                  <Check size={18} />
                </button>
                <button type="button" onClick={handleDelete} className="rounded-md p-2 text-garden-muted hover:bg-red-400/10 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
                <button type="button" onClick={onClose} className="rounded-md p-2 text-garden-muted hover:bg-garden-elevated hover:text-garden-text transition-colors" title="Close">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(88vh-132px)] overflow-y-auto px-5 py-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {entry.dueDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-400">
                    <Calendar size={13} />{formatDateTime(entry.dueDate)}
                  </span>
                )}
                {entry.tags?.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 rounded-md bg-garden-elevated px-2 py-1 text-xs font-medium text-garden-muted">
                    <Tag size={13} />{tag}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 rounded-md bg-garden-elevated px-2 py-1 text-xs font-medium text-garden-muted">
                  <Clock size={13} />{formatDateTime(entry.createdAt)}
                </span>
              </div>

              <label htmlFor="entry-detail-text" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-garden-muted/60">Full capture</label>
              <textarea
                id="entry-detail-text"
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                className="min-h-[220px] w-full resize-y rounded-lg border border-garden-border bg-garden-bg px-4 py-3 text-sm leading-6 text-garden-text outline-none focus:border-garden-primary focus:shadow-glow transition-all"
                placeholder="Write the full note, task, reminder, or idea..."
              />
              <p className="mt-3 text-[11px] text-garden-muted">Saving re-runs parsing, so type, tags, summary, and due date update from the new text.</p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-garden-border bg-garden-elevated/50 px-5 py-3">
              <p className="text-[11px] text-garden-muted">{hasChanges ? "Unsaved edits" : "No edits yet"}</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onClose} className="rounded-lg border border-garden-border bg-garden-surface px-3 py-2 text-sm font-medium text-garden-text hover:bg-garden-elevated transition-colors">Cancel</button>
                <button type="submit" disabled={!canSave} className="inline-flex items-center gap-2 rounded-lg bg-garden-primary px-3 py-2 text-sm font-semibold text-white hover:bg-garden-primaryHover disabled:cursor-not-allowed disabled:opacity-40 transition-colors">
                  <Save size={15} />{isSaving ? "Saving" : "Save"}
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
