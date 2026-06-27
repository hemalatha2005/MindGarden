import { CheckSquare, FileText, Bell, Lightbulb } from "lucide-react";

const TYPE_CONFIG = {
  task: { label: "Task", icon: CheckSquare, color: "text-blue-400 bg-blue-400/10" },
  note: { label: "Note", icon: FileText, color: "text-garden-muted bg-garden-elevated" },
  reminder: { label: "Reminder", icon: Bell, color: "text-amber-400 bg-amber-400/10" },
  idea: { label: "Idea", icon: Lightbulb, color: "text-violet-400 bg-violet-400/10" },
};

const TypeBadge = ({ type, size = "sm" }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.note;
  const Icon = config.icon;
  const sizeClasses = size === "md" ? "px-2.5 py-1 text-xs gap-1.5 rounded-md" : "px-2 py-0.5 text-[11px] gap-1 rounded-md";

  return (
    <span className={`inline-flex items-center font-semibold ${config.color} ${sizeClasses}`}>
      <Icon size={size === "md" ? 14 : 12} strokeWidth={2} />
      {config.label}
    </span>
  );
};

export default TypeBadge;
