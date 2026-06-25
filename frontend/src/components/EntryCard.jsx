/**
 * components/EntryCard.jsx
 *
 * Minimalist, high-contrast entry card.
 */

import { motion } from "framer-motion";
import { Check, Calendar, Tag, Trash2, Clock } from "lucide-react";
import TypeBadge from "./TypeBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
  return `${Math.floor(diffMins / 1440)}d`;
};

const EntryCard = ({ entry, onComplete, onDelete }) => {
  const { _id, text, type, tags, summary, dueDate, completed, createdAt, parsedBy } = entry;

  const displayText = summary && summary !== text ? summary : text;
  const isLongEntry = text.length > 80 && summary !== text;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`
        bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 relative group
        shadow-sm hover:shadow-card transition-shadow duration-200
        ${completed ? "opacity-50" : ""}
      `}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TypeBadge type={type} />
          {parsedBy === "ai" && (
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              AI
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <Clock size={12} />
          {timeAgo(createdAt)}
        </span>
      </div>

      {/* Main Content */}
      <div>
        <p
          className={`
            text-sm text-gray-900 leading-relaxed font-medium
            ${completed ? "line-through text-gray-400" : ""}
          `}
        >
          {displayText}
        </p>

        {isLongEntry && !completed && (
          <p className="text-xs text-gray-500 mt-1.5 text-clamp-2">
            {text}
          </p>
        )}
      </div>

      {/* Metadata Row */}
      {(dueDate || (tags && tags.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {dueDate && (
            <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md font-medium">
              <Calendar size={12} />
              {formatDate(dueDate)}
            </div>
          )}
          {tags?.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions (Hover) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 backdrop-blur-sm pl-2">
        <button
          onClick={() => onComplete(_id, !completed)}
          className={`p-1.5 rounded-md transition-colors ${
            completed ? "text-gray-400 hover:text-gray-900 hover:bg-gray-100" : "text-emerald-600 hover:bg-emerald-50"
          }`}
          title={completed ? "Restore" : "Complete"}
        >
          <Check size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onDelete(_id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default EntryCard;
