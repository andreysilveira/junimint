import React from 'react';
import { 
  Zap, 
  Coins, 
  Trophy, 
  ShieldAlert,
  Flame,
  Infinity as InfinityIcon,
  Sparkles
} from 'lucide-react';
import { StardewSaveData } from '@/src/lib/stardew-parser';
import { motion } from 'motion/react';

interface HackModeProps {
  data: StardewSaveData;
  onUpdatePlayer: (player: Partial<StardewSaveData['player']>) => void;
  onUpdateWorld: (world: Partial<StardewSaveData['world']>) => void;
}

export default function HackMode({ data, onUpdatePlayer, onUpdateWorld }: HackModeProps) {
  const { player, world } = data;

  const setMaxSkills = () => {
    const newSkills = { ...player.skills };
    Object.keys(newSkills).forEach((key) => {
      (newSkills as any)[key] = {
        ...newSkills[key as keyof typeof newSkills],
        level: 10,
        experience: 15000
      };
    });
    onUpdatePlayer({ skills: newSkills });
  };

  const setInfiniteStats = () => {
    onUpdatePlayer({
      health: 999,
      maxHealth: 999,
      stamina: 999,
      maxStamina: 999
    });
  };

  const addMillionGold = () => {
    onUpdatePlayer({ money: player.money + 1000000 });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-3">Hack Mode</h1>
          <p className="text-text-secondary text-lg">Advanced manipulation of save file parameters.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-stardew-primary/10 border border-stardew-primary/20 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-stardew-primary animate-pulse" />
            <span className="text-[10px] font-bold text-stardew-primary uppercase tracking-widest">System Overdrive Active</span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-stardew-primary/5 border border-stardew-primary/20 rounded-2xl p-8 flex items-start gap-6">
        <div className="p-3 bg-stardew-primary/10 rounded-xl text-stardew-primary">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Advanced Modification Warning</h3>
          <p className="text-text-secondary leading-relaxed">
            Direct save file manipulation can lead to unexpected behavior. Ensure you have a backup before applying extreme changes. These modifications are permanent once saved.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Economy Hacks */}
        <div className="glass-card p-10 relative overflow-hidden group bg-bg-muted/30">
          <h3 className="text-xl font-bold text-text-primary mb-10 flex items-center gap-3">
            <Coins className="text-stardew-primary" size={22} />
            Financial Injection
          </h3>
          
          <div className="space-y-8">
            <div className="p-6 bg-bg-surface rounded-2xl border border-border-light shadow-sm">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Current Liquidity</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-text-primary">{player.money.toLocaleString()}g</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onUpdatePlayer({ money: Math.max(0, player.money - 50000) })}
                    className="w-10 h-10 flex items-center justify-center bg-bg-muted hover:bg-border-light rounded-xl text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => onUpdatePlayer({ money: player.money + 50000 })}
                    className="w-10 h-10 flex items-center justify-center bg-stardew-primary text-white rounded-xl text-lg font-bold transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={addMillionGold}
              className="w-full py-4 bg-stardew-primary/10 hover:bg-stardew-primary/20 text-stardew-primary border border-stardew-primary/20 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              Inject 1,000,000 Gold
            </button>
          </div>
        </div>

        {/* Stats Hacks */}
        <div className="glass-card p-10 relative overflow-hidden group bg-bg-muted/30">
          <h3 className="text-xl font-bold text-text-primary mb-10 flex items-center gap-3">
            <Flame className="text-stardew-primary" size={22} />
            Biological Override
          </h3>
          
          <div className="space-y-6">
            <button 
              onClick={setInfiniteStats}
              className="w-full py-5 bg-stardew-primary text-white font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-md"
            >
              <InfinityIcon size={22} />
              Enable God Mode
            </button>
            <button 
              onClick={setMaxSkills}
              className="w-full py-5 bg-bg-surface hover:bg-bg-muted text-text-primary border border-border-light font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-sm"
            >
              <Trophy size={22} />
              Max All Masteries
            </button>
          </div>
        </div>

        {/* World Hacks */}
        <div className="glass-card p-10">
          <h3 className="text-xl font-bold text-text-primary mb-10 flex items-center gap-3">
            <Sparkles className="text-stardew-accent" size={22} />
            Chronos Control
          </h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Active Season</label>
              <select 
                value={world.currentSeason}
                onChange={(e) => onUpdateWorld({ currentSeason: e.target.value })}
                className="w-full p-4 bg-bg-muted border border-border-light rounded-2xl font-bold text-sm outline-none focus:border-stardew-primary transition-colors"
              >
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Current Year</label>
              <input 
                type="number"
                value={world.year}
                onChange={(e) => onUpdateWorld({ year: parseInt(e.target.value) || 1 })}
                className="w-full p-4 bg-bg-muted border border-border-light rounded-2xl font-bold text-sm outline-none focus:border-stardew-primary transition-colors"
              />
            </div>
            <div className="col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Day of Cycle</label>
                <span className="text-sm font-bold text-stardew-primary">Day {world.dayOfMonth}</span>
              </div>
              <input 
                type="range"
                min="1"
                max="28"
                value={world.dayOfMonth}
                onChange={(e) => onUpdateWorld({ dayOfMonth: parseInt(e.target.value) })}
                className="w-full accent-stardew-primary h-2 bg-bg-muted rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-10">
          <h3 className="text-xl font-bold text-text-primary mb-10 flex items-center gap-3">
            <Zap className="text-stardew-accent" size={22} />
            System Macros
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Unlock Recipes', sub: 'Crafting & Cooking' },
              { label: 'Max Hearts', sub: 'All NPC relationships' },
              { label: 'Clean Farm', sub: 'Remove all debris' },
              { label: 'Perfect Luck', sub: 'Max daily luck' },
            ].map((macro) => (
              <button 
                key={macro.label}
                className="p-6 bg-bg-muted/50 hover:bg-bg-muted border border-border-light rounded-2xl transition-all text-left group"
              >
                <p className="text-base font-bold text-text-primary group-hover:text-stardew-primary transition-colors">{macro.label}</p>
                <p className="text-[10px] text-text-secondary mt-2 uppercase tracking-widest font-medium">{macro.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
