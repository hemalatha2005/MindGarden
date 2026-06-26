/**
 * components/Sidebar.jsx
 *
 * Left navigation sidebar containing the brand, views, and tag filters.
 */

import { Leaf, Inbox, CheckSquare, FileText, Bell, Lightbulb, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "all",      label: "Inbox",       icon: Inbox },
  { id: "task",     label: "Tasks",       icon: CheckSquare },
  { id: "note",     label: "Notes",       icon: FileText },
  { id: "reminder", label: "Reminders",   icon: Bell },
  { id: "idea",     label: "Ideas",       icon: Lightbulb },
];

const Sidebar = ({ activeFilter, onFilterChange }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-gray-200 h-screen flex flex-col sticky top-0 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-4 flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center text-white shadow-sm">
          <Leaf size={16} strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-gray-900 tracking-tight">MindGarden</span>
      </div>

      {/* Navigation / Filters */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <div className="mb-6">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Views
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id && location.pathname === "/";
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    // Assuming we are on GardenView or navigating to it
                    if (location.pathname !== "/") {
                      window.location.href = `/?filter=${item.id}`; // Simple fallback if deep linked
                    } else {
                      onFilterChange(item.id);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-1.5 text-sm font-medium rounded-md
                    transition-colors
                    ${
                      isActive
                        ? "bg-gray-200/50 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? "text-blue-600" : "text-gray-400"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Static Focus Mode Link */}
        <div>
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Workspace
          </p>
          <Link
            to="/focus"
            className={`
              flex items-center gap-2.5 px-3 py-1.5 text-sm font-medium rounded-md
              transition-colors
              ${
                location.pathname === "/focus"
                  ? "bg-gray-200/50 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <div className="w-4 h-4 rounded flex items-center justify-center bg-violet-100 text-violet-600">
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
            </div>
            Focus Mode
          </Link>
        </div>
      </div>

      {/* User / Settings Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link 
          to="/settings"
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-[10px]">
            MG
          </div>
          <span className="font-medium text-gray-700">Account Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
