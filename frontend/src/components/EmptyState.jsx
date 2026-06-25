/**
 * components/EmptyState.jsx
 *
 * Clean, modern empty state.
 */

import { motion } from "framer-motion";
import { Inbox, CheckCircle, FileText, Bell, Lightbulb } from "lucide-react";

const EmptyState = ({ filterType }) => {
  const messages = {
    all: {
      icon: Inbox,
      title: "No entries yet",
      subtitle: "Capture your thoughts, tasks, or reminders using the bar below.",
    },
    task: {
      icon: CheckCircle,
      title: "All caught up",
      subtitle: "You have no pending tasks right now.",
    },
    note: {
      icon: FileText,
      title: "No notes",
      subtitle: "Jot down ideas, meeting notes, or random thoughts.",
    },
    reminder: {
      icon: Bell,
      title: "No upcoming reminders",
      subtitle: "Schedule things you need to remember later.",
    },
    idea: {
      icon: Lightbulb,
      title: "Blank canvas",
      subtitle: "Capture your next big idea here.",
    },
  };

  const content = messages[filterType] || messages.all;
  const Icon = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1">
        {content.title}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {content.subtitle}
      </p>
    </motion.div>
  );
};

export default EmptyState;
