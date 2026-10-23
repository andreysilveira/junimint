import React from 'react';
import { 
  Coins, 
  Heart, 
  Zap, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Trophy, 
  Package, 
  ArrowRight,
  Droplet,
  Trash2,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { StardewSave } from '@/src/domain/save/types';
import { 
  addMoney, 
  setHealth, 
  setStamina, 
  cleanFarmDebris, 
  waterAllCrops,
  maxAllSkills
} from '@/src/application/domain-actions';

interface OverviewProps {
  data: StardewSave;
  setActiveTab: (tab: string) => void;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function Overview({ data, setActiveTab, onExecute }: OverviewProps) {
  const { player, world, farm, relationships, metadata } = data;

  const totalSkillLevel = Object.values(player.skills).reduce((acc, s) => acc + s.level, 0);
  const maxedFriendships = relationships.filter(r => r.hearts >= r.maxHearts).length;

  return (
    <div className="space-y-12">
      {/* Hero Welcome Card */}
      <div className="glass-card p-10 bg-gradient-to-br from-bg-surface via-bg-surface to-stardew-primary/5 border border-border-light relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-stardew-primary/10 text-stardew-primary flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Save v{metadata.gameVersion} Loaded
              </span>
              <span className="text-xs text-text-secondary font-mono">
                {metadata.originalFileName}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">
              Welcome back, <span className="text-stardew-primary">{player.name}</span>
            </h1>
            <p className="text-text-secondary text-base">
              Proprietor of <strong className="text-text-primary">{player.farmName} Farm</strong> ({farm.farmType})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('hack')}
              className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <Sparkles size={14} className="text-stardew-primary" />
              Quick Hacks
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <Package size={14} />
              Open Backpack ({player.inventory.length})
            </button>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Money */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="glass-card glass-card-hover p-6 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Current Gold</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Coins size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-mono font-bold text-text-primary">{player.money.toLocaleString()}g</h3>
            <p className="text-xs text-text-secondary mt-1">Total: {player.totalMoneyEarned.toLocaleString()}g</p>
          </div>
        </div>

        {/* Calendar */}
        <div 
          onClick={() => setActiveTab('farm')}
          className="glass-card glass-card-hover p-6 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Calendar</span>
            <div className="w-8 h-8 rounded-xl bg-stardew-primary/10 text-stardew-primary flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary capitalize">
              Day {world.dayOfMonth} of {world.currentSeason}
            </h3>
            <p className="text-xs text-text-secondary mt-1">Year {world.year} • Fortune: {(world.dailyLuck * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Skill Masteries */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="glass-card glass-card-hover p-6 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Mastery Level</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Trophy size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">{totalSkillLevel} / 50</h3>
            <p className="text-xs text-text-secondary mt-1">Combined Skill Levels</p>
          </div>
        </div>

        {/* Social */}
        <div 
          onClick={() => setActiveTab('social')}
          className="glass-card glass-card-hover p-6 cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Villagers</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">{maxedFriendships} Maxed</h3>
            <p className="text-xs text-text-secondary mt-1">{relationships.length} Known Townspeople</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Vitals & Skills vs Farm Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Character Vitals & Masteries */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Award className="text-stardew-primary" size={18} />
              Vitality & Skill Masteries
            </h3>
            <button 
              onClick={() => setActiveTab('profile')}
              className="text-xs font-bold text-stardew-primary hover:underline flex items-center gap-1"
            >
              Edit <ArrowRight size={12} />
            </button>
          </div>

          {/* Vitals Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-red-600 flex items-center gap-1"><Heart size={13} /> Health</span>
                <span className="text-text-primary font-mono">{player.health} / {player.maxHealth}</span>
              </div>
              <div className="h-2.5 bg-bg-muted rounded-full overflow-hidden border border-border-light">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (player.health / player.maxHealth) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-stardew-primary flex items-center gap-1"><Zap size={13} /> Energy / Stamina</span>
                <span className="text-text-primary font-mono">{Math.round(player.stamina)} / {player.maxStamina}</span>
              </div>
              <div className="h-2.5 bg-bg-muted rounded-full overflow-hidden border border-border-light">
                <div 
                  className="h-full bg-stardew-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (player.stamina / player.maxStamina) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Skill List */}
          <div className="pt-2 grid grid-cols-5 gap-2 text-center">
            {Object.values(player.skills).map((skill) => (
              <div key={skill.type} className="p-2.5 rounded-xl bg-bg-muted/40 border border-border-light">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block truncate">
                  {skill.name}
                </span>
                <span className="text-base font-bold text-text-primary block mt-0.5">
                  Lvl {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Farm & Quick Actions */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <MapPin className="text-stardew-secondary" size={18} />
              Farm Territory & Quick Actions
            </h3>
            <button 
              onClick={() => setActiveTab('farm')}
              className="text-xs font-bold text-stardew-primary hover:underline flex items-center gap-1"
            >
              2D Map <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-bg-muted/40 border border-border-light">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Buildings</span>
              <p className="text-xl font-bold text-text-primary mt-1">{farm.buildings.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-muted/40 border border-border-light">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Active Crops</span>
              <p className="text-xl font-bold text-stardew-primary mt-1">{farm.crops.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-muted/40 border border-border-light">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Debris</span>
              <p className="text-xl font-bold text-amber-600 mt-1">{farm.debrisCount}</p>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onExecute(cleanFarmDebris)}
                className="btn-secondary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} className="text-amber-600" />
                Clear All Debris
              </button>
              <button
                onClick={() => onExecute(waterAllCrops)}
                className="btn-secondary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
              >
                <Droplet size={13} className="text-blue-500" />
                Water All Crops
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onExecute(s => addMoney(s, 100000))}
                className="btn-secondary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5 text-stardew-primary"
              >
                <Coins size={13} />
                +100k Gold
              </button>
              <button
                onClick={() => onExecute(maxAllSkills)}
                className="btn-secondary text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
              >
                <Trophy size={13} className="text-purple-600" />
                Max Masteries
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
