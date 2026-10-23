import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Trash2, 
  Plus,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { StardewSaveData, StardewItem } from '@/src/lib/stardew-parser';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface InventoryProps {
  data: StardewSaveData;
  onUpdatePlayer: (player: Partial<StardewSaveData['player']>) => void;
}

export default function Inventory({ data, onUpdatePlayer }: InventoryProps) {
  const [search, setSearch] = useState('');
  const { player } = data;

  const filteredItems = player.inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateItemStack = (index: number, newStack: number) => {
    const newInventory = [...player.inventory];
    newInventory[index] = { ...newInventory[index], stack: Math.max(1, newStack) };
    onUpdatePlayer({ inventory: newInventory });
  };

  const removeItem = (index: number) => {
    const newInventory = player.inventory.filter((_, i) => i !== index);
    onUpdatePlayer({ inventory: newInventory });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-3">Backpack & Storage</h1>
          <p className="text-text-secondary text-lg">Manage your items, stacks, and qualities in a clean grid.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary text-sm flex items-center gap-2 px-6">
            <ArrowUpDown size={16} />
            Sort
          </button>
          <button className="btn-primary text-sm flex items-center gap-2 px-6">
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-stardew-primary transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Filter items by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-premium pl-14 py-4 text-lg shadow-sm"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredItems.map((item, idx) => (
          <motion.div 
            key={`${item.id}-${idx}`}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card glass-card-hover p-6 group relative overflow-hidden"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-bg-muted rounded-2xl flex items-center justify-center border border-border-light group-hover:border-stardew-primary transition-colors relative">
                <Package className="text-text-secondary group-hover:text-stardew-primary transition-colors" size={32} />
                
                {/* Quality Badge */}
                {item.quality > 0 && (
                  <div className={cn(
                    "absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-bg-surface shadow-sm",
                    item.quality === 1 ? "bg-stone-300" : 
                    item.quality === 2 ? "bg-yellow-400" : 
                    "bg-purple-400"
                  )} />
                )}
              </div>
              
              <div className="w-full">
                <h4 className="font-bold text-text-primary truncate text-base mb-2">{item.name}</h4>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Quantity</span>
                  <input 
                    type="number"
                    value={item.stack}
                    onChange={(e) => updateItemStack(idx, parseInt(e.target.value) || 1)}
                    className="w-14 bg-bg-muted text-center text-sm font-bold text-stardew-primary outline-none focus:ring-2 focus:ring-stardew-primary/10 rounded-lg py-1 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions Overlay */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => removeItem(idx)}
                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-40 text-center glass-card bg-bg-muted/30">
            <div className="w-24 h-24 bg-bg-muted rounded-full flex items-center justify-center mx-auto text-text-secondary/30 mb-8">
              <Package size={40} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">No items found</h3>
            <p className="text-text-secondary text-lg">Try searching for something else or add a new item.</p>
          </div>
        )}
      </div>
    </div>
  );
}
