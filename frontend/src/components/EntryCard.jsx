/**
 * components/EntryCard.jsx
 *
 * Compact, premium entry card inspired by Linear/Notion.
 */

import { motion } from "framer-motion";
import { Check, Calendar, Tag, Trash2, Clock, Maximize2 } from "lucide-react";
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

const EntryCard = ({ entry, onComplete, onDelete, onOpen }) => {
  const { _id, text, type, tags, summary, dueDate, completed, createdAt, parsedBy } = entry;

  const hasVagueSummary = /\b(it|this|that|them)\b/i.test(summary || "");
  const displayText = summary && summary !== text && !hasVagueSummary ? summary : text;
  const isLongEntry = text.length > 80 && summary !== text;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`
        bg-white border border-gray-200 rounded-lg p-3.5 flex flex-col gap-2.5 relative group
        shadow-sm hover:shadow-card hover:border-gray-300 transition-all duration-200 cursor-pointer
        ${completed ? "opacity-60 bg-gray-50" : ""}
      `}
      onClick={() => onOpen(entry)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(entry);
        }
      }}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <TypeBadge type={type} />
          {parsedBy === "ai" && (
            <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100">
              AI Generated
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-400">
           <span className="text-xs font-medium flex items-center gap-1">
             <Clock size={12} />
             {timeAgo(createdAt)}
           </span>
           
           {/* Actions */}
           <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen(entry);
                }}
                className="p-1 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                title="View full entry"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onComplete(_id, !completed);
                }}
                className={`p-1 rounded transition-colors ${
                  completed ? "hover:text-gray-900 hover:bg-gray-200" : "hover:text-emerald-600 hover:bg-emerald-50"
                }`}
                title={completed ? "Restore" : "Complete"}
              >
                <Check size={14} strokeWidth={2.5} />
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(_id);
                }}
                className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-1">
        <p
          className={`
            text-sm text-gray-900 leading-relaxed font-medium
            ${completed ? "line-through text-gray-500" : ""}
          `}
        >
          {displayText}
        </p>

        {isLongEntry && !completed && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {text}
          </p>
        )}
      </div>

      {/* Metadata Row */}
      {(dueDate || (tags && tags.length > 0)) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5 pl-1">
          {dueDate && (
            <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-100">
              <Calendar size={10} />
              {formatDate(dueDate)}
            </div>
          )}
          {tags?.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium border border-gray-200"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EntryCard;
