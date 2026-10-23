import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Sparkles, 
  UserCheck, 
  Gift, 
  Star, 
  X,
  Filter
} from 'lucide-react';
import { StardewSave, Relationship } from '@/src/domain/save/types';
import { 
  setRelationshipHearts, 
  maxAllFriendships 
} from '@/src/application/domain-actions';
import { motion } from 'motion/react';

interface RelationshipsEditorProps {
  data: StardewSave;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function RelationshipsEditor({ data, onExecute }: RelationshipsEditorProps) {
  const { relationships } = data;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'datable' | 'married' | 'maxed'>('all');

  const filtered = relationships.filter((rel) => {
    const matchesSearch = rel.displayName.toLowerCase().includes(search.toLowerCase()) ||
                          rel.npcName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'datable') return rel.isDatable;
    if (filter === 'married') return rel.status === 'Married';
    if (filter === 'maxed') return rel.hearts >= rel.maxHearts;
    return true;
  });

  const handleHeartChange = (npcName: string, hearts: number) => {
    onExecute(s => setRelationshipHearts(s, npcName, hearts));
  };

  const handleMaxSingle = (npcName: string, maxHearts: number) => {
    onExecute(s => setRelationshipHearts(s, npcName, maxHearts));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Social & Relationships</h1>
          <p className="text-text-secondary text-base">
            Track and modify friendship hearts with Pelican Town villagers and romance candidates.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onExecute(maxAllFriendships)}
            className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Sparkles size={16} />
            Max All Villager Hearts
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-stardew-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search villagers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium pl-12 py-3 text-sm shadow-sm w-full"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {(['all', 'datable', 'married', 'maxed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-stardew-primary text-white shadow-xs'
                  : 'bg-bg-surface text-text-secondary border border-border-light hover:bg-bg-muted hover:text-text-primary'
              }`}
            >
              {f === 'all' ? `All Villagers (${relationships.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Villager Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rel) => {
          const maxH = rel.maxHearts || 10;
          return (
            <motion.div
              key={rel.npcName}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card glass-card-hover p-6 flex flex-col justify-between space-y-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-stardew-primary/10 text-stardew-primary font-bold flex items-center justify-center text-lg shadow-xs">
                    {rel.displayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-base leading-tight">
                      {rel.displayName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rel.status === 'Married'
                          ? 'bg-purple-500/10 text-purple-600'
                          : (rel.isDatable ? 'bg-pink-500/10 text-pink-600' : 'bg-bg-muted text-text-secondary')
                      }`}>
                        {rel.status === 'Married' ? 'Spouse' : (rel.isDatable ? 'Bachelor/ette' : 'Villager')}
                      </span>
                      {rel.birthday && (
                        <span className="text-[10px] text-text-secondary capitalize">
                          🎂 {rel.birthday.season} {rel.birthday.day}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleMaxSingle(rel.npcName, maxH)}
                  className="btn-secondary text-[10px] px-2.5 py-1 font-bold text-stardew-primary hover:bg-stardew-primary/10"
                  title="Max Hearts for this villager"
                >
                  Max
                </button>
              </div>

              {/* Heart indicators */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-secondary uppercase tracking-wider text-[10px]">
                    Friendship
                  </span>
                  <span className="font-mono font-bold text-text-primary text-xs">
                    {rel.hearts} / {maxH} Hearts ({rel.points.toLocaleString()} pts)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 items-center">
                  {Array.from({ length: maxH }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleHeartChange(rel.npcName, i + 1)}
                      className="p-1 hover:scale-125 transition-transform"
                      title={`Set to ${i + 1} Hearts`}
                    >
                      <Heart
                        size={18}
                        className={i < rel.hearts ? 'text-red-500 fill-red-500' : 'text-border-light fill-bg-muted'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider & Gift stats */}
              <div className="pt-2 border-t border-border-light flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Gift size={13} className="text-stardew-secondary" />
                  <span>Gifts this week: <strong className="text-text-primary">{rel.giftsThisWeek}/2</strong></span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxH}
                  value={rel.hearts}
                  onChange={(e) => handleHeartChange(rel.npcName, parseInt(e.target.value))}
                  className="w-24 accent-stardew-primary cursor-pointer"
                />
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card bg-bg-muted/20">
            <Heart size={40} className="mx-auto text-text-secondary/40 mb-3" />
            <h4 className="text-lg font-bold text-text-primary">No relationships match your filter</h4>
            <p className="text-xs text-text-secondary mt-1">Try resetting search or filter terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
