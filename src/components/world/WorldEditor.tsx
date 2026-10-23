import React from 'react';
import { 
  Sun, 
  Calendar, 
  CloudRain, 
  Sparkles, 
  Compass, 
  Pickaxe, 
  CheckCircle2,
  Dice5
} from 'lucide-react';
import { StardewSave } from '@/src/domain/save/types';
import { setWorldDate, setDailyLuck } from '@/src/application/domain-actions';

interface WorldEditorProps {
  data: StardewSave;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function WorldEditor({ data, onExecute }: WorldEditorProps) {
  const { world } = data;

  const seasons = [
    { id: 'spring', label: 'Spring', emoji: '🌸', color: 'text-emerald-600' },
    { id: 'summer', label: 'Summer', emoji: '☀️', color: 'text-amber-500' },
    { id: 'fall', label: 'Fall', emoji: '🍂', color: 'text-orange-600' },
    { id: 'winter', label: 'Winter', emoji: '❄️', color: 'text-blue-500' },
  ] as const;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Calendar & World Environment</h1>
          <p className="text-text-secondary text-base">
            Control the seasonal calendar, date progression, spirit luck forecasts, and expedition depths.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Season & Date Controls */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
              <Calendar className="text-stardew-primary" size={20} />
              Calendar Timeline
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-bg-muted px-2.5 py-1 rounded-full">
              Day {world.dayOfMonth} • Year {world.year}
            </span>
          </div>

          <div className="space-y-5">
            {/* Season Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
                Active Season
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onExecute(save => setWorldDate(save, s.id, world.dayOfMonth, world.year))}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      world.currentSeason === s.id
                        ? 'border-stardew-primary bg-stardew-primary/10 shadow-xs'
                        : 'border-border-light bg-bg-surface hover:bg-bg-muted'
                    }`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className={`text-xs font-bold ${world.currentSeason === s.id ? 'text-stardew-primary' : 'text-text-primary'}`}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Day & Year Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
                  Day of Month (1-28)
                </label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={world.dayOfMonth}
                  onChange={(e) => onExecute(save => setWorldDate(save, world.currentSeason, parseInt(e.target.value) || 1, world.year))}
                  className="input-premium font-bold text-center text-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
                  Year
                </label>
                <input
                  type="number"
                  min="1"
                  value={world.year}
                  onChange={(e) => onExecute(save => setWorldDate(save, world.currentSeason, world.dayOfMonth, parseInt(e.target.value) || 1))}
                  className="input-premium font-bold text-center text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Luck & Atmosphere */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
              <Dice5 className="text-amber-500" size={20} />
              Spirits & Daily Fortune
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stardew-primary bg-stardew-primary/10 px-2.5 py-1 rounded-full">
              Welcoming Spirits
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-bg-muted/40 border border-border-light space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Daily Luck Value</span>
              <span className="text-2xl font-mono font-bold text-text-primary">
                {(world.dailyLuck * 100).toFixed(1)}%
              </span>
            </div>

            <input
              type="range"
              min="-0.1"
              max="0.1"
              step="0.01"
              value={world.dailyLuck}
              onChange={(e) => onExecute(save => setDailyLuck(save, parseFloat(e.target.value)))}
              className="w-full accent-stardew-primary cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              <span>Very Displeased (-10%)</span>
              <span>Neutral (0%)</span>
              <span className="text-stardew-primary">Very Happy (+10%)</span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onExecute(save => setDailyLuck(save, 0.1))}
                className="btn-secondary text-xs px-3.5 py-1.5 font-bold flex-1 flex items-center justify-center gap-1.5 text-stardew-primary"
              >
                <Sparkles size={14} />
                Max Fortune (+0.10)
              </button>
              <button
                onClick={() => onExecute(save => setDailyLuck(save, 0))}
                className="btn-secondary text-xs px-3.5 py-1.5 font-bold flex-1"
              >
                Neutral Luck (0.00)
              </button>
            </div>
          </div>
        </div>

        {/* Expedition Depths & Town Progression */}
        <div className="glass-card p-8 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
              <Pickaxe className="text-stardew-secondary" size={20} />
              Expeditions & Community Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-bg-muted/40 border border-border-light space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Deepest Mine Level</span>
              <p className="text-2xl font-bold text-text-primary">Floor {world.mineLevel}</p>
              <p className="text-xs text-text-secondary">{world.mineLevel >= 120 ? 'Bottom reached (Skull Key obtained)' : 'Standard Mines'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-bg-muted/40 border border-border-light space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Skull Cavern</span>
              <p className="text-2xl font-bold text-stardew-primary">Floor {world.skullCaveLevel}</p>
              <p className="text-xs text-text-secondary">Calico Desert Caverns</p>
            </div>

            <div className="p-5 rounded-2xl bg-bg-muted/40 border border-border-light space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Community Center</span>
              <p className="text-2xl font-bold text-emerald-600">{world.ccComplete ? 'Restored' : 'In Progress'}</p>
              <p className="text-xs text-text-secondary">{world.jojaMember ? 'Joja Warehouse route' : 'Junimo bundles'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
