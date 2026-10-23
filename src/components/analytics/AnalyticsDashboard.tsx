import React from 'react';
import { 
  TrendingUp, 
  History, 
  Award, 
  Coins, 
  Heart, 
  Trees, 
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { StardewSave, SaveChange } from '@/src/domain/save/types';

interface AnalyticsDashboardProps {
  data: StardewSave;
  changeHistory: SaveChange[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function AnalyticsDashboard({
  data,
  changeHistory,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: AnalyticsDashboardProps) {
  const { player, world, farm, relationships, collections } = data;

  // Real Skill Data for Chart
  const skillChartData = [
    { name: 'Farming', level: player.skills.farming.level, xp: player.skills.farming.experience },
    { name: 'Mining', level: player.skills.mining.level, xp: player.skills.mining.experience },
    { name: 'Foraging', level: player.skills.foraging.level, xp: player.skills.foraging.experience },
    { name: 'Fishing', level: player.skills.fishing.level, xp: player.skills.fishing.experience },
    { name: 'Combat', level: player.skills.combat.level, xp: player.skills.combat.experience },
  ];

  // Farm Composition Data
  const farmCompData = [
    { name: 'Crops', value: Math.max(1, farm.crops.length), color: '#F97316' },
    { name: 'Buildings', value: Math.max(1, farm.buildings.length), color: '#8B5A2B' },
    { name: 'Machines & Chests', value: Math.max(1, farm.objects.filter(o => !o.isDebris).length), color: '#374151' },
    { name: 'Debris', value: Math.max(1, farm.debrisCount), color: '#9CA3AF' },
  ];

  // Social Distribution
  const maxedCount = relationships.filter(r => r.hearts >= r.maxHearts).length;
  const datingCount = relationships.filter(r => r.status === 'Dating' || r.status === 'Married').length;
  const friendlyCount = relationships.filter(r => r.hearts > 0 && r.hearts < r.maxHearts).length;
  const untouchedCount = relationships.filter(r => r.hearts === 0).length;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Analytics & Session Audit</h1>
          <p className="text-text-secondary text-base">
            Live progression metrics, museum collection milestones, and an immutable log of edits made during this session.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className={`btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 ${!canUndo ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Revert previous edit (Ctrl+Z)"
          >
            <RotateCcw size={14} />
            Undo (Ctrl+Z)
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Total Earned</span>
            <Coins size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{player.totalMoneyEarned.toLocaleString()}g</p>
          <p className="text-xs text-text-secondary">Current Cash: {player.money.toLocaleString()}g</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Skills Mastery</span>
            <Award size={16} className="text-stardew-primary" />
          </div>
          <p className="text-2xl font-bold text-stardew-primary">
            {Object.values(player.skills).reduce((acc, s) => acc + s.level, 0)} / 50
          </p>
          <p className="text-xs text-text-secondary">Combined level</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Max Friendships</span>
            <Heart size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{maxedCount} Villagers</p>
          <p className="text-xs text-text-secondary">{datingCount} Partner / Spouse</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Edits This Session</span>
            <History size={16} className="text-stardew-secondary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{changeHistory.length}</p>
          <p className="text-xs text-text-secondary">Logged in Audit Trail</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Masteries Chart */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Award className="text-stardew-primary" size={18} />
              Skill Level Breakdown
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Max Level 10</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar dataKey="level" fill="#F97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farm Estate Composition */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Trees className="text-stardew-secondary" size={18} />
              Farm Structure Composition
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Estate Elements</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={farmCompData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {farmCompData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E5E7EB',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            {farmCompData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-text-secondary">{item.name}:</span>
                <strong className="text-text-primary">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Audit Trail / Change History */}
      <div className="glass-card p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border-light">
          <div className="flex items-center gap-3">
            <History className="text-stardew-primary" size={20} />
            <div>
              <h3 className="text-base font-bold text-text-primary">Session Modification Audit Log</h3>
              <p className="text-xs text-text-secondary">Real-time log of changes performed in this session with full undo capability.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-bg-muted px-2.5 py-1 rounded-full text-text-secondary">
            {changeHistory.length} Recorded Operations
          </span>
        </div>

        {changeHistory.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {changeHistory.map((ch, idx) => (
              <div
                key={`${ch.id}-${idx}`}
                className="p-4 rounded-xl bg-bg-muted/40 border border-border-light flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-stardew-primary shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{ch.title}</span>
                      <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-bg-surface border border-border-light">
                        {ch.category}
                      </span>
                    </div>
                    <p className="text-text-secondary mt-0.5">{ch.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[11px] shrink-0">
                  <Clock size={12} />
                  {new Date(ch.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-text-secondary">
            <CheckCircle2 size={32} className="mx-auto text-stardew-primary/50 mb-2" />
            <p className="text-xs font-semibold">No changes made yet. Save is in its original imported state.</p>
          </div>
        )}
      </div>
    </div>
  );
}
