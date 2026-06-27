import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, Database, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-10 h-[22px] rounded-full flex items-center px-0.5 transition-colors ${enabled ? 'bg-garden-primary' : 'bg-garden-border'}`}
  >
    <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-[18px]' : 'translate-x-0'}`} />
  </button>
);

const SettingsView = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <header className="mb-8 border-b border-garden-border pb-5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-garden-muted hover:text-garden-text mb-4 transition-colors font-medium">
            <ArrowLeft size={14} />
            Back to Inbox
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-garden-heading">Settings</h1>
          <p className="text-[13px] text-garden-muted mt-1">Manage your workspace preferences.</p>
        </header>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">

          {/* Profile */}
          <section className="bg-garden-surface border border-garden-border rounded-card p-5">
            <h2 className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
              <User size={13} className="text-garden-primary" />
              Profile
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-garden-primary to-blue-400 rounded-xl flex items-center justify-center text-white text-sm font-bold">MG</div>
              <div>
                <p className="text-[14px] font-semibold text-garden-heading">MindGarden User</p>
                <p className="text-[12px] text-garden-muted">Local Workspace</p>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-garden-surface border border-garden-border rounded-card p-5">
            <h2 className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
              <Settings size={13} className="text-garden-muted" />
              Preferences
            </h2>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-garden-text">AI Parsing</p>
                  <p className="text-[11px] text-garden-muted">Auto-categorize entries using NLP.</p>
                </div>
                <Toggle enabled={aiEnabled} onToggle={() => setAiEnabled(!aiEnabled)} />
              </div>
              <div className="h-px bg-garden-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-garden-text">Notifications</p>
                  <p className="text-[11px] text-garden-muted">Get notified about upcoming reminders.</p>
                </div>
                <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="bg-garden-surface border border-garden-border rounded-card p-5">
            <h2 className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
              <Shield size={13} className="text-emerald-400" />
              Security
            </h2>
            <p className="text-[12px] text-garden-muted mb-3">Authentication is handled via OTP. No password to manage.</p>
          </section>

          {/* Data */}
          <section className="bg-garden-surface border border-garden-border rounded-card p-5">
            <h2 className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
              <Database size={13} className="text-amber-400" />
              Data
            </h2>
            <p className="text-[12px] text-garden-muted mb-4">Entries are stored in your MongoDB Atlas cluster.</p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 text-[12px] font-medium text-red-400 bg-red-400/10 hover:bg-red-400/15 rounded-lg transition-colors border border-red-400/20"
            >
              {isExporting ? "Exporting..." : "Export All Data"}
            </button>
          </section>

        </motion.div>
      </div>
    </div>
  );
};

export default SettingsView;
