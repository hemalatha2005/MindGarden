import { Command, Inbox, CheckSquare, FileText, Bell, Lightbulb, LogOut, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "all",      label: "Inbox",       icon: Inbox },
  { id: "task",     label: "Tasks",       icon: CheckSquare },
  { id: "note",     label: "Notes",       icon: FileText },
  { id: "reminder", label: "Reminders",   icon: Bell },
  { id: "idea",     label: "Ideas",       icon: Lightbulb },
];

const Sidebar = ({ activeFilter, onFilterChange, onSignOut }) => {
  const location = useLocation();

  return (
    <aside className="w-[260px] bg-garden-surface/80 backdrop-blur-xl border-r border-garden-border h-screen flex flex-col sticky top-0 flex-shrink-0">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-garden-primary to-blue-400 rounded-lg flex items-center justify-center text-white shadow-glow">
          <Command size={16} strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold text-garden-heading tracking-tight">MindGarden</span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        <div className="mb-5">
          <p className="px-3 mb-2 text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em]">Views</p>
          <nav className="flex flex-col gap-px">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id && location.pathname === "/";
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (location.pathname !== "/") {
                      window.location.href = `/?filter=${item.id}`;
                    } else {
                      onFilterChange(item.id);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-[7px] text-[13px] font-medium rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? "bg-garden-primary/10 text-garden-primary"
                      : "text-garden-muted hover:bg-garden-elevated hover:text-garden-text"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}

                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-2 text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em]">Workspace</p>
          <Link
            to="/focus"
            className={`
              flex items-center gap-2.5 px-3 py-[7px] text-[13px] font-medium rounded-lg
              transition-all duration-200
              ${location.pathname === "/focus"
                ? "bg-garden-primary/10 text-garden-primary"
                : "text-garden-muted hover:bg-garden-elevated hover:text-garden-text"
              }
            `}
          >
            <Zap size={16} strokeWidth={location.pathname === "/focus" ? 2 : 1.5} />
            Focus Mode
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-garden-border flex flex-col gap-px">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-[7px] text-[13px] font-medium rounded-lg text-garden-muted hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
