/**
 * components/FilterBar.jsx
 *
 * Minimalist filter tabs.
 */

import { motion } from "framer-motion";
import { List, CheckSquare, FileText, Bell, Lightbulb } from "lucide-react";

const FILTERS = [
  { id: "all",      label: "All",       icon: List },
  { id: "task",     label: "Tasks",     icon: CheckSquare },
  { id: "note",     label: "Notes",     icon: FileText },
  { id: "reminder", label: "Reminders", icon: Bell },
  { id: "idea",     label: "Ideas",     icon: Lightbulb },
];

const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {FILTERS.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
              whitespace-nowrap transition-colors duration-150 rounded-md
              ${
                isActive
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <Icon size={14} strokeWidth={2} className={isActive ? "text-gray-700" : "text-gray-400"} />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
