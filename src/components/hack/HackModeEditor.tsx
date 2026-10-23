import React from 'react';
import { 
  Zap, 
  Coins, 
  Heart, 
  Trophy, 
  Sparkles, 
  Trash2, 
  Droplet, 
  Package, 
  ShieldAlert,
  Star
} from 'lucide-react';
import { StardewSave } from '@/src/domain/save/types';
import { 
  setMoney, 
  addMoney, 
  setGodMode, 
  maxAllSkills, 
  maxAllFriendships, 
  cleanFarmDebris, 
  waterAllCrops, 
  growAllCrops, 
  setDailyLuck,
  updateInventoryItem,
  createChangeRecord
} from '@/src/application/domain-actions';

interface HackModeProps {
  data: StardewSave;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function HackModeEditor({ data, onExecute }: HackModeProps) {
  const { player, farm } = data;

  const handleMaxAllStacks = () => {
    onExecute(s => {
      let currentSave = s;
      s.player.inventory.forEach(item => {
        currentSave = updateInventoryItem(currentSave, item.slotIndex, { stack: 999 }).save;
      });
      return {
        save: currentSave,
        change: createChangeRecord(
          'Inventory',
          'Maxed All Stacks',
          'Set all inventory items to 999 quantity'
        )
      };
    });
  };

  const handleAllIridium = () => {
    onExecute(s => {
      let currentSave = s;
      s.player.inventory.forEach(item => {
        currentSave = updateInventoryItem(currentSave, item.slotIndex, { quality: 4 }).save;
      });
      return {
        save: currentSave,
        change: createChangeRecord(
          'Inventory',
          'Upgraded Quality',
          'Set all inventory items to Iridium Quality (★★★)'
        )
      };
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 flex items-center gap-1.5">
              <Zap size={14} />
              Instant Power Actions
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Quick Modifications & Cheats</h1>
          <p className="text-text-secondary text-base">
            High-impact domain modifications with automatic save integrity validation and full undo support (Ctrl+Z).
          </p>
        </div>
      </div>

      {/* Grid of Hack Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Economy Cheats */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Coins className="text-amber-500" size={18} />
              Gold Injections
            </h3>
            <span className="text-xs font-mono font-bold text-text-primary">{player.money.toLocaleString()}g</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Instantly grant capital to your character account and total earnings records.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onExecute(s => addMoney(s, 100000))}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Coins size={14} className="text-amber-500" />
              +100,000 Gold
            </button>
            <button
              onClick={() => onExecute(s => addMoney(s, 1000000))}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2 text-stardew-primary"
            >
              <Coins size={14} />
              +1,000,000 Gold
            </button>
            <button
              onClick={() => onExecute(s => setMoney(s, 999999999))}
              className="btn-primary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Max Out Cash (999,999,999g)
            </button>
          </div>
        </div>

        {/* Player Vitals */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Heart className="text-red-500" size={18} />
              God Mode & Vitals
            </h3>
            <span className="text-xs font-bold text-stardew-primary">{player.health} HP</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Overcharge health and stamina capacities to withstand endless cavern expeditions.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onExecute(setGodMode)}
              className="btn-primary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Enable God Mode (999 HP & Stamina)
            </button>
            <button
              onClick={() => onExecute(s => {
                let s1 = addMoney(s, 0).save;
                s1.player.maxHealth = 500;
                s1.player.health = 500;
                s1.player.maxStamina = 508;
                s1.player.stamina = 508;
                return {
                  save: s1,
                  change: createChangeRecord(
                    'Vitals',
                    'Max Stardrop Vitals',
                    'Set Stamina to 508 (all Stardrops consumed) and Health to 500'
                  )
                };
              })}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Heart size={14} className="text-red-500" />
              Legitimate Max Vitals (508 Stamina)
            </button>
          </div>
        </div>

        {/* Skills & Masteries */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Trophy className="text-stardew-primary" size={18} />
              Skill Masteries
            </h3>
            <span className="text-xs font-bold text-text-secondary">5 Disciplines</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Instantly achieve Level 10 mastery with 15,000 XP in Farming, Mining, Foraging, Fishing, and Combat.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onExecute(maxAllSkills)}
              className="btn-primary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Trophy size={14} />
              Max All Skills (Level 10)
            </button>
          </div>
        </div>

        {/* Social & Relationships */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Heart className="text-pink-500" size={18} />
              Social Charisma
            </h3>
            <span className="text-xs font-bold text-text-secondary">{data.relationships.length} Villagers</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Fill relationship points with every single villager in Pelican Town to maximum hearts.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onExecute(maxAllFriendships)}
              className="btn-primary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Max All Friendships (10/14 Hearts)
            </button>
          </div>
        </div>

        {/* Farm & Agriculture */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Droplet className="text-blue-500" size={18} />
              Farm Landscape & Crops
            </h3>
            <span className="text-xs font-bold text-text-secondary">{farm.crops.length} Crops</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Instant agricultural automation tools for your farm land.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onExecute(cleanFarmDebris)}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Trash2 size={14} className="text-amber-600" />
              Clear All Debris ({farm.debrisCount})
            </button>
            <button
              onClick={() => onExecute(waterAllCrops)}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Droplet size={14} className="text-blue-500" />
              Water All Crops
            </button>
            <button
              onClick={() => onExecute(growAllCrops)}
              className="btn-primary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Instant Harvest All Crops
            </button>
          </div>
        </div>

        {/* Inventory Bulk Tools */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Package className="text-stardew-primary" size={18} />
              Backpack Enhancements
            </h3>
            <span className="text-xs font-bold text-text-secondary">{player.inventory.length} Items</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Bulk operations applied across all current items in your inventory.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleMaxAllStacks}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Package size={14} className="text-stardew-primary" />
              Max Stacks to 999
            </button>
            <button
              onClick={handleAllIridium}
              className="btn-secondary w-full text-xs py-3 font-bold flex items-center justify-center gap-2 text-purple-600"
            >
              <Star size={14} className="fill-purple-600" />
              Upgrade All to Iridium Quality
            </button>
            <button
              onClick={() => onExecute(s => setDailyLuck(s, 0.1))}
              className="btn-primary w-full text-xs py-3 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Max Daily Fortune (+10%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
