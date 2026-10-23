import React from 'react';
import { 
  User, 
  Heart, 
  Zap, 
  Coins, 
  Trophy, 
  Sparkles, 
  Shield, 
  Check, 
  RotateCcw,
  Star
} from 'lucide-react';
import { StardewSave, SkillType } from '@/src/domain/save/types';
import { 
  setPlayerIdentity, 
  setMoney, 
  addMoney, 
  setHealth, 
  setStamina, 
  setSkill, 
  maxAllSkills,
  createChangeRecord
} from '@/src/application/domain-actions';
import { SKILL_XP_THRESHOLDS } from '@/src/domain/player/skills';

interface ProfileEditorProps {
  data: StardewSave;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function ProfileEditor({ data, onExecute }: ProfileEditorProps) {
  const { player } = data;

  const skillList: SkillType[] = ['farming', 'mining', 'foraging', 'fishing', 'combat'];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Farmer Profile & Mastery</h1>
          <p className="text-text-secondary text-base">
            Manage your character identity, financial reserves, vitality, and skill mastery progression.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onExecute(maxAllSkills)}
            className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Trophy size={15} />
            Max All Masteries
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 1. Identity Card */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
              <User className="text-stardew-primary" size={20} />
              Identity & Farm
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-bg-muted px-2.5 py-1 rounded-full">
              Character Info
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
                Farmer Name
              </label>
              <input
                type="text"
                value={player.name}
                onChange={(e) => onExecute(s => setPlayerIdentity(s, e.target.value, player.farmName))}
                className="input-premium font-bold"
                placeholder="Farmer name"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
                Farm Name
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={player.farmName}
                  onChange={(e) => onExecute(s => setPlayerIdentity(s, player.name, e.target.value))}
                  className="input-premium font-bold flex-1"
                  placeholder="Farm name"
                />
                <span className="text-xs text-text-secondary font-semibold">Farm</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
                Favorite Thing
              </label>
              <input
                type="text"
                value={player.favoriteThing || ''}
                onChange={(e) => onExecute(s => {
                  const updated = { ...s, player: { ...s.player, favoriteThing: e.target.value } };
                  return {
                    save: updated,
                    change: createChangeRecord(
                      'Player',
                      'Favorite Thing',
                      `Changed favorite thing to "${e.target.value}"`,
                      player.favoriteThing,
                      e.target.value
                    )
                  };
                })}
                className="input-premium"
                placeholder="e.g. Stardrops"
              />
            </div>
          </div>
        </div>

        {/* 2. Economy & Currency */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
              <Coins className="text-amber-500" size={20} />
              Financial Reserves
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stardew-primary bg-stardew-primary/10 px-2.5 py-1 rounded-full">
              Live Currency
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-bg-muted/40 border border-border-light space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Current Gold</span>
              <span className="text-3xl font-mono font-bold text-text-primary">{player.money.toLocaleString()}g</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onExecute(s => addMoney(s, 10000))}
                className="btn-secondary text-xs px-3.5 py-1.5 font-bold"
              >
                +10k Gold
              </button>
              <button
                onClick={() => onExecute(s => addMoney(s, 50000))}
                className="btn-secondary text-xs px-3.5 py-1.5 font-bold"
              >
                +50k Gold
              </button>
              <button
                onClick={() => onExecute(s => addMoney(s, 100000))}
                className="btn-secondary text-xs px-3.5 py-1.5 font-bold"
              >
                +100k Gold
              </button>
              <button
                onClick={() => onExecute(s => setMoney(s, 1000000))}
                className="btn-secondary text-xs px-3.5 py-1.5 font-bold text-stardew-primary"
              >
                Set 1,000,000g
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-text-secondary block mb-2">
              Exact Gold Amount
            </label>
            <input
              type="number"
              min="0"
              value={player.money}
              onChange={(e) => onExecute(s => setMoney(s, parseInt(e.target.value) || 0))}
              className="input-premium font-mono font-bold text-lg"
            />
          </div>
        </div>

        {/* 3. Vitals Card */}
        <div className="glass-card p-8 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
              <Heart className="text-red-500" size={20} />
              Health & Stamina Vitality
            </h3>
            <button
              onClick={() => onExecute(s => {
                let s1 = setHealth(s, s.player.maxHealth).save;
                let s2 = setStamina(s1, s1.player.maxStamina).save;
                return {
                  save: s2,
                  change: createChangeRecord(
                    'Vitals',
                    'Restored Vitals',
                    'Refilled health and stamina to max capacities'
                  )
                };
              })}
              className="btn-secondary text-xs px-3 py-1.5 font-bold flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-stardew-primary" />
              Full Restore
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Health */}
            <div className="p-6 rounded-2xl bg-bg-muted/40 border border-border-light space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={16} /> Health Points
                </span>
                <span className="text-xl font-bold text-text-primary">
                  {player.health} / {player.maxHealth}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1">Current</label>
                  <input
                    type="number"
                    min="0"
                    value={player.health}
                    onChange={(e) => onExecute(s => setHealth(s, parseInt(e.target.value) || 0))}
                    className="input-premium text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1">Maximum</label>
                  <input
                    type="number"
                    min="1"
                    value={player.maxHealth}
                    onChange={(e) => onExecute(s => setHealth(s, player.health, parseInt(e.target.value) || 100))}
                    className="input-premium text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Stamina */}
            <div className="p-6 rounded-2xl bg-bg-muted/40 border border-border-light space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stardew-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={16} /> Energy / Stamina
                </span>
                <span className="text-xl font-bold text-text-primary">
                  {Math.round(player.stamina)} / {player.maxStamina}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1">Current</label>
                  <input
                    type="number"
                    min="0"
                    value={Math.round(player.stamina)}
                    onChange={(e) => onExecute(s => setStamina(s, parseInt(e.target.value) || 0))}
                    className="input-premium text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1">Maximum</label>
                  <input
                    type="number"
                    min="1"
                    value={player.maxStamina}
                    onChange={(e) => onExecute(s => setStamina(s, player.stamina, parseInt(e.target.value) || 270))}
                    className="input-premium text-center font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Skills & Masteries */}
        <div className="glass-card p-8 space-y-8 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2.5">
                <Trophy className="text-stardew-primary" size={20} />
                Skill Masteries & Experience
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Level thresholds automatically sync with Stardew Valley XP formulas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillList.map((skillType) => {
              const skill = player.skills[skillType];
              return (
                <div 
                  key={skillType} 
                  className="p-6 rounded-2xl bg-bg-muted/40 border border-border-light space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-text-primary text-base capitalize">{skill.name}</h4>
                      <p className="text-xs text-text-secondary font-mono">
                        {skill.experience.toLocaleString()} XP • Next: {skill.nextLevelExp.toLocaleString()} XP
                      </p>
                    </div>
                    <span className="text-sm font-bold text-stardew-primary bg-stardew-primary/10 px-3 py-1 rounded-xl">
                      Lvl {skill.level}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-border-light rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-stardew-primary rounded-full transition-all duration-300"
                      style={{ width: `${(skill.level / 10) * 100}%` }}
                    />
                  </div>

                  {/* Level selector & direct XP */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1">
                        Level (0-10)
                      </label>
                      <select
                        value={skill.level}
                        onChange={(e) => {
                          const lvl = parseInt(e.target.value);
                          const minExp = SKILL_XP_THRESHOLDS[lvl] || 0;
                          onExecute(s => setSkill(s, skillType, lvl, Math.max(skill.experience, minExp)));
                        }}
                        className="input-premium text-sm font-bold"
                      >
                        {Array.from({ length: 11 }).map((_, i) => (
                          <option key={i} value={i}>Level {i}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block mb-1">
                        Exact XP
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={skill.experience}
                        onChange={(e) => {
                          const exp = parseInt(e.target.value) || 0;
                          onExecute(s => setSkill(s, skillType, skill.level, exp));
                        }}
                        className="input-premium text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
