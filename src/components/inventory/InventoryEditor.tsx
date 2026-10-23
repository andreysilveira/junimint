import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Trash2, 
  Plus, 
  Copy, 
  Sparkles, 
  ArrowUpDown, 
  Star, 
  Filter,
  X,
  Check
} from 'lucide-react';
import { StardewSave, InventoryItem } from '@/src/domain/save/types';
import { 
  updateInventoryItem, 
  addInventoryItem, 
  removeInventoryItem, 
  duplicateInventoryItem,
  createChangeRecord 
} from '@/src/application/domain-actions';
import { KNOWN_ITEMS_CATALOG, QUALITY_NAMES, CatalogItem } from '@/src/domain/inventory/catalog';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryEditorProps {
  data: StardewSave;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function InventoryEditor({ data, onExecute }: InventoryEditorProps) {
  const { player } = data;
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'slot' | 'name' | 'stack' | 'quality'>('slot');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  const categories = [
    'All',
    'Special & Iridium',
    'Resources & Materials',
    'Crops & Forage',
    'Minerals & Gems',
    'Artisan & Animal',
    'Tools & Weapons',
    'Fish & Bait',
    'Cooked Dishes',
    'Seeds & Saplings',
  ];

  // Filter items without mutating original slot indices!
  const filteredItems = player.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.itemId.includes(search);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stack') return b.stack - a.stack;
    if (sortBy === 'quality') return b.quality - a.quality;
    return a.slotIndex - b.slotIndex;
  });

  const handleUpdateStack = (slotIndex: number, newStack: number) => {
    onExecute(s => updateInventoryItem(s, slotIndex, { stack: Math.max(1, newStack) }));
  };

  const handleUpdateQuality = (slotIndex: number, newQuality: number) => {
    onExecute(s => updateInventoryItem(s, slotIndex, { quality: newQuality }));
  };

  const handleRemove = (slotIndex: number) => {
    onExecute(s => removeInventoryItem(s, slotIndex));
  };

  const handleDuplicate = (slotIndex: number) => {
    onExecute(s => duplicateInventoryItem(s, slotIndex));
  };

  const handleAddItemFromCatalog = (catalogItem: CatalogItem) => {
    onExecute(s => addInventoryItem(s, {
      name: catalogItem.name,
      itemId: catalogItem.id,
      stack: catalogItem.defaultStack || 99,
      quality: 0,
      category: catalogItem.category,
      type: 'Object',
    }));
    setIsAddModalOpen(false);
  };

  // Bulk actions
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

  const filteredCatalog = KNOWN_ITEMS_CATALOG.filter(item => 
    item.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
    item.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Backpack & Storage</h1>
          <p className="text-text-secondary text-base">
            Total Slots Occupied: <span className="font-bold text-text-primary">{player.inventory.length}</span> • Fully synchronized with save XML slots.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMaxAllStacks}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
            title="Set all stacks to 999"
          >
            <Sparkles size={14} className="text-stardew-primary" />
            Max All Stacks (999)
          </button>
          <button
            onClick={handleAllIridium}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
            title="Set all item qualities to Iridium"
          >
            <Star size={14} className="text-purple-500 fill-purple-500" />
            All Iridium Quality
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filters, Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-stardew-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search items by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-premium pl-12 py-3 text-sm shadow-sm"
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-bg-surface border border-border-light rounded-xl px-3 py-2 text-xs font-bold text-text-secondary">
              <ArrowUpDown size={14} />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-text-primary outline-none cursor-pointer"
              >
                <option value="slot">Slot Index</option>
                <option value="name">Name (A-Z)</option>
                <option value="stack">Quantity (High to Low)</option>
                <option value="quality">Quality (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-stardew-primary text-white shadow-xs' 
                  : 'bg-bg-surface text-text-secondary border border-border-light hover:text-text-primary hover:bg-bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedItems.map((item, idx) => (
          <motion.div
            key={`slot-${item.slotIndex}-${item.itemId || 'empty'}-${idx}`}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card glass-card-hover p-6 group relative flex flex-col justify-between"
          >
            {/* Top Row: Slot # badge & Actions */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold text-text-secondary bg-bg-muted px-2 py-0.5 rounded">
                Slot #{item.slotIndex}
              </span>
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDuplicate(item.slotIndex)}
                  className="p-1.5 text-text-secondary hover:text-stardew-primary hover:bg-bg-muted rounded-lg transition-colors"
                  title="Duplicate item"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => handleRemove(item.slotIndex)}
                  className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from backpack"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Middle: Icon & Item Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-bg-muted border border-border-light flex items-center justify-center relative shrink-0">
                <Package className="text-stardew-secondary" size={28} />
                {/* Quality Star */}
                {item.quality > 0 && (
                  <div className="absolute -top-1.5 -right-1.5">
                    {item.quality === 1 && <span className="text-xs">🥈</span>}
                    {item.quality === 2 && <span className="text-xs">⭐</span>}
                    {item.quality === 4 && <span className="text-xs">🌟</span>}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-text-primary text-sm truncate" title={item.name}>
                  {item.name}
                </h4>
                <p className="text-[11px] text-text-secondary truncate mt-0.5">
                  {item.category || 'General'}
                </p>
                <span className="text-[10px] font-mono text-text-secondary mt-1 inline-block">
                  ID: {item.itemId}
                </span>
              </div>
            </div>

            {/* Bottom Row: Stack & Quality Controls */}
            <div className="space-y-3 pt-3 border-t border-border-light">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Quantity</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStack(item.slotIndex, item.stack - 10)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-bg-muted text-xs font-bold hover:bg-border-light"
                    title="-10"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.stack}
                    onChange={(e) => handleUpdateStack(item.slotIndex, parseInt(e.target.value) || 1)}
                    className="w-14 text-center text-xs font-mono font-bold bg-bg-muted border border-border-light rounded py-1"
                  />
                  <button
                    onClick={() => handleUpdateStack(item.slotIndex, item.stack + 10)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-bg-muted text-xs font-bold hover:bg-border-light"
                    title="+10"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleUpdateStack(item.slotIndex, 999)}
                    className="text-[10px] font-bold text-stardew-primary hover:underline ml-1"
                    title="Max Stack"
                  >
                    999
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Quality</span>
                <select
                  value={item.quality}
                  onChange={(e) => handleUpdateQuality(item.slotIndex, parseInt(e.target.value))}
                  className="text-xs font-bold bg-bg-muted border border-border-light rounded px-2 py-1 outline-none cursor-pointer"
                >
                  <option value={0}>Normal</option>
                  <option value={1}>Silver (★)</option>
                  <option value={2}>Gold (★★)</option>
                  <option value={4}>Iridium (★★★)</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}

        {sortedItems.length === 0 && (
          <div className="col-span-full py-24 text-center glass-card bg-bg-muted/20">
            <Package size={40} className="mx-auto text-text-secondary/40 mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No items found</h3>
            <p className="text-text-secondary text-sm mb-6">
              {search ? 'Try adjusting your search filters.' : 'Your inventory is currently empty.'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary text-xs px-6 py-2.5 mx-auto"
            >
              Add Item to Inventory
            </button>
          </div>
        )}
      </div>

      {/* Add Item from Catalog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-surface border border-border-light rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-border-light flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Add Item from Catalog</h3>
                <p className="text-xs text-text-secondary">Select an authentic Stardew Valley item to spawn in your backpack.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-bg-muted flex items-center justify-center text-text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 border-b border-border-light bg-bg-muted/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                  type="text"
                  placeholder="Search catalog (e.g. Prismatic Shard, Ancient Fruit, Iridium Bar)..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="input-premium pl-11 py-2.5 text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCatalog.map((catItem) => (
                  <button
                    key={catItem.id + catItem.name}
                    onClick={() => handleAddItemFromCatalog(catItem)}
                    className="p-3 rounded-xl border border-border-light bg-bg-surface hover:border-stardew-primary hover:bg-stardew-primary/5 transition-all text-left flex items-center justify-between group"
                  >
                    <div>
                      <h5 className="font-bold text-text-primary text-xs group-hover:text-stardew-primary transition-colors">
                        {catItem.name}
                      </h5>
                      <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                        {catItem.category}
                      </span>
                    </div>
                    <span className="text-xs text-stardew-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border-light bg-bg-muted/10 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn-secondary text-xs px-5 py-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
