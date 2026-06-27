import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, CheckCircle2, Circle, Edit3, CheckSquare, FileText, Bell, Lightbulb } from "lucide-react";

const TYPE_ICONS = {
  task: CheckSquare,
  note: FileText,
  reminder: Bell,
  idea: Lightbulb,
};

const TYPE_COLORS = {
  task: "text-blue-400",
  note: "text-garden-muted",
  reminder: "text-amber-400",
  idea: "text-violet-400",
};

const EntryCard = ({ entry, onComplete, onDelete, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(entry.text);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      textareaRef.current.focus();
    }
  }, [isEditing, editText]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(entry._id);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText === entry.text) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onUpdate(entry._id, editText);
    } catch (e) { /* parent handles */ }
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      setEditText(entry.text);
      setIsEditing(false);
    }
  };

  const isTask = entry.type === "task";
  const isCompleted = entry.completed;
  const TypeIcon = TYPE_ICONS[entry.type] || FileText;
  const typeColor = TYPE_COLORS[entry.type] || "text-garden-muted";

  const formattedDate = new Date(entry.createdAt).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group bg-garden-surface border border-garden-border rounded-card p-4
        transition-all duration-200
        hover:border-garden-borderHover hover:bg-garden-elevated
        ${isCompleted ? "opacity-50" : ""}
      `}
    >
      <div className="flex gap-3">
        {/* Left: Checkbox or Type Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isTask ? (
            <button
              onClick={() => onComplete(entry._id, !isCompleted)}
              className="text-garden-muted hover:text-garden-primary transition-colors"
            >
              {isCompleted ? (
                <CheckCircle2 size={18} className="text-garden-primary" />
              ) : (
                <Circle size={18} />
              )}
            </button>
          ) : (
            <div className={`${typeColor} mt-px`}>
              <TypeIcon size={17} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${typeColor}`}>
              {entry.type}
            </span>
            {entry.parsedBy === "ai" && (
              <span className="text-[9px] font-bold text-garden-primary bg-garden-primary/10 px-1.5 py-px rounded">
                AI
              </span>
            )}
            <span className="ml-auto text-[11px] text-garden-muted/60 font-medium">
              {formattedDate}
            </span>
          </div>

          {/* Body */}
          {isEditing ? (
            <div className="mt-1">
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-garden-bg text-[14px] text-garden-text leading-relaxed border border-garden-primary/40 rounded-lg p-2.5 focus:outline-none focus:shadow-glow resize-none"
                disabled={isSaving}
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-garden-muted">Enter to save · Esc to cancel</span>
                <div className="ml-auto flex gap-1.5">
                  <button
                    onClick={() => { setEditText(entry.text); setIsEditing(false); }}
                    className="px-2.5 py-1 text-[11px] font-medium text-garden-muted hover:text-garden-text rounded transition-colors"
                  >Cancel</button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-2.5 py-1 text-[11px] font-medium bg-garden-primary text-white rounded hover:bg-garden-primaryHover transition-colors"
                    disabled={isSaving}
                  >{isSaving ? "Saving..." : "Save"}</button>
                </div>
              </div>
            </div>
          ) : (
            <p className={`text-[14px] leading-relaxed mt-0.5 ${isCompleted ? "line-through text-garden-muted" : "text-garden-text"}`}>
              {entry.text}
            </p>
          )}

          {/* Footer: tags + due date + actions */}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-3">
              {entry.dueDate && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded">
                  <Clock size={11} />
                  {new Date(entry.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}
              {entry.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-garden-muted bg-garden-elevated px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}

              {/* Actions */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="ml-auto flex items-center gap-0.5"
                  >
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-garden-muted hover:text-garden-primary hover:bg-garden-primary/10 rounded-md transition-all"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-1.5 text-garden-muted hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EntryCard;
