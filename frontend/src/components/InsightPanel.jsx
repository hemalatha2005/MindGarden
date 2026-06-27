import { Activity, CheckCircle, Clock, Lightbulb } from "lucide-react";

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-garden-bg border border-garden-border rounded-card p-4 flex items-center gap-3.5 hover:border-garden-borderHover transition-colors">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-lg font-bold text-garden-heading tabular-nums">{value}</p>
      <p className="text-[11px] text-garden-muted font-medium">{label}</p>
    </div>
  </div>
);

const InsightPanel = ({ entries }) => {
  const pendingCount = entries.filter((e) => !e.completed && (e.type === "task" || e.type === "reminder")).length;
  const completedCount = entries.filter((e) => e.completed).length;
  const noteCount = entries.filter((e) => e.type === "note").length;
  const recentIdeas = entries.filter((e) => e.type === "idea").slice(0, 3);

  return (
    <aside className="w-[280px] bg-garden-surface/60 backdrop-blur-xl border-l border-garden-border h-screen flex flex-col sticky top-0 flex-shrink-0 hidden lg:flex">
      <div className="p-5 flex flex-col gap-7 overflow-y-auto">

        <div>
          <h3 className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-3">Overview</h3>
          <div className="flex flex-col gap-2">
            <StatCard icon={CheckCircle} value={pendingCount} label="Pending" color="bg-blue-500/10 text-blue-400" />
            <StatCard icon={Activity} value={completedCount} label="Done" color="bg-emerald-500/10 text-emerald-400" />
            <StatCard icon={Activity} value={noteCount} label="Notes" color="bg-garden-primary/10 text-garden-primary" />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-garden-muted/60 uppercase tracking-[0.12em] mb-3 flex items-center gap-1.5">
            <Lightbulb size={11} />
            Recent Ideas
          </h3>
          <div className="flex flex-col gap-2">
            {recentIdeas.length > 0 ? (
              recentIdeas.map((idea) => (
                <div key={idea._id} className="bg-garden-bg border border-garden-border rounded-lg p-3 hover:border-garden-borderHover transition-colors">
                  <p className="text-[12px] text-garden-text leading-relaxed line-clamp-2">{idea.summary || idea.text}</p>
                  <p className="text-[10px] text-garden-muted/50 mt-1.5 font-medium">
                    {new Date(idea.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-[12px] text-garden-muted/40 italic py-6 text-center">
                No ideas yet
              </div>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default InsightPanel;
