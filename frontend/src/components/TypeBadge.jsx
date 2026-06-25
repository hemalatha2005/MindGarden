/**
 * components/TypeBadge.jsx
 *
 * A minimal, high-contrast badge showing the entry's type.
 */

import { CheckSquare, FileText, Bell, Lightbulb } from "lucide-react";

const TYPE_CONFIG = {
  task: {
    label: "Task",
    icon: CheckSquare,
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
  },
  note: {
    label: "Note",
    icon: FileText,
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
  },
  reminder: {
    label: "Reminder",
    icon: Bell,
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
  },
  idea: {
    label: "Idea",
    icon: Lightbulb,
    bg: "bg-[#F3E8FF]",
    text: "text-[#6B21A8]",
  },
};

const TypeBadge = ({ type, size = "sm" }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.note;
  const Icon = config.icon;

  const sizeClasses =
    size === "md"
      ? "px-2.5 py-1 text-sm gap-1.5 rounded-md"
      : "px-2 py-0.5 text-xs gap-1 rounded-md";

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${config.bg} ${config.text} ${sizeClasses}
      `}
    >
      <Icon size={size === "md" ? 14 : 12} strokeWidth={2.5} />
      {config.label}
    </span>
  );
};

export default TypeBadge;
