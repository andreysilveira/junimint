import React, { useState } from 'react';
import { 
  Trees, 
  Trash2, 
  Droplet, 
  Sparkles, 
  Home, 
  Info, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { StardewSave, FarmBuilding, FarmCrop, FarmObject } from '@/src/domain/save/types';
import { 
  cleanFarmDebris, 
  waterAllCrops, 
  growAllCrops 
} from '@/src/application/domain-actions';
import { motion } from 'motion/react';

interface FarmEditorProps {
  data: StardewSave;
  onExecute: (actionFn: (save: StardewSave) => any) => void;
}

export default function FarmEditor({ data, onExecute }: FarmEditorProps) {
  const { farm } = data;
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number; info: string; type: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleClearDebris = () => {
    onExecute(cleanFarmDebris);
  };

  const handleWaterCrops = () => {
    onExecute(waterAllCrops);
  };

  const handleGrowCrops = () => {
    onExecute(growAllCrops);
  };

  // Create grid lookup maps for fast 2D rendering
  const buildingMap = new Map<string, FarmBuilding>();
  farm.buildings.forEach(b => {
    for (let dx = 0; dx < b.tilesWide; dx++) {
      for (let dy = 0; dy < b.tilesHigh; dy++) {
        buildingMap.set(`${b.tileX + dx},${b.tileY + dy}`, b);
      }
    }
  });

  const cropMap = new Map<string, FarmCrop>();
  farm.crops.forEach(c => cropMap.set(`${c.tileX},${c.tileY}`, c));

  const objectMap = new Map<string, FarmObject>();
  farm.objects.forEach(o => objectMap.set(`${o.tileX},${o.tileY}`, o));

  // Determine bounds of farm items for mini-map viewport
  const displayWidth = 50;
  const displayHeight = 40;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2">Farm Estate & Territory</h1>
          <p className="text-text-secondary text-base">
            Type: <span className="font-bold text-text-primary">{farm.farmType}</span> • Interactive 2D layout and landscape cleanup tools.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClearDebris}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
            title="Clear all weeds, stones, and twigs from farm"
          >
            <Trash2 size={15} className="text-amber-600" />
            Clear Debris ({farm.debrisCount})
          </button>
          <button
            onClick={handleWaterCrops}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
            title="Water all crops"
          >
            <Droplet size={15} className="text-blue-500" />
            Water All Crops ({farm.crops.length})
          </button>
          <button
            onClick={handleGrowCrops}
            className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
            title="Grow all crops to ready-to-harvest state"
          >
            <Sparkles size={16} />
            Instant Crop Harvest
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="glass-card p-6 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Buildings</span>
          <p className="text-2xl font-bold text-text-primary">{farm.buildings.length}</p>
          <p className="text-xs text-text-secondary">Coops, Barns, Sheds</p>
        </div>
        <div className="glass-card p-6 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Active Crops</span>
          <p className="text-2xl font-bold text-stardew-primary">{farm.crops.length}</p>
          <p className="text-xs text-text-secondary">{farm.crops.filter(c => c.isWatered).length} Watered</p>
        </div>
        <div className="glass-card p-6 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Debris & Weeds</span>
          <p className="text-2xl font-bold text-amber-600">{farm.debrisCount}</p>
          <p className="text-xs text-text-secondary">Stones, Twigs, Weeds</p>
        </div>
        <div className="glass-card p-6 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Objects & Machines</span>
          <p className="text-2xl font-bold text-text-primary">{farm.objects.length}</p>
          <p className="text-xs text-text-secondary">Chests, Furnaces, Kegs</p>
        </div>
      </div>

      {/* 2D Interactive Grid Visualizer */}
      <div className="glass-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-light">
          <div className="flex items-center gap-3">
            <Layers className="text-stardew-primary" size={20} />
            <div>
              <h3 className="text-base font-bold text-text-primary">2D Farm Visualizer</h3>
              <p className="text-xs text-text-secondary">Click any tile on the map to inspect element properties.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-bg-muted rounded-xl p-1 border border-border-light text-xs font-bold">
              <button
                onClick={() => setZoom(Math.max(0.6, zoom - 0.2))}
                className="p-1.5 rounded-lg hover:bg-bg-surface text-text-secondary hover:text-text-primary"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="px-2 font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(1.8, zoom + 0.2))}
                className="p-1.5 rounded-lg hover:bg-bg-surface text-text-secondary hover:text-text-primary"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Map Canvas Viewport */}
        <div className="overflow-auto border border-border-light rounded-2xl bg-[#E8DEC8] p-6 max-h-[500px]">
          <div 
            className="grid gap-[2px] mx-auto bg-[#D7CCA8] p-2 rounded-xl"
            style={{
              gridTemplateColumns: `repeat(${displayWidth}, minmax(${16 * zoom}px, 1fr))`,
              width: 'fit-content'
            }}
          >
            {Array.from({ length: displayHeight }).map((_, y) => (
              Array.from({ length: displayWidth }).map((_, x) => {
                const key = `${x},${y}`;
                const building = buildingMap.get(key);
                const crop = cropMap.get(key);
                const obj = objectMap.get(key);

                let tileColor = 'bg-[#7DA052]/40 hover:bg-[#7DA052]/80'; // Default grass
                let tileIcon = '';
                let tileLabel = `Tile (${x}, ${y}) - Open Grass`;
                let tileType = 'Grass';

                if (building) {
                  tileColor = 'bg-[#8B5A2B] text-white shadow-xs';
                  tileIcon = '🏠';
                  tileLabel = `Building: ${building.name} at (${building.tileX}, ${building.tileY})`;
                  tileType = 'Building';
                } else if (crop) {
                  tileColor = crop.isFullyGrown 
                    ? 'bg-amber-400 text-black shadow-xs' 
                    : (crop.isWatered ? 'bg-[#4A7C59] text-blue-100' : 'bg-[#6B8E23] text-amber-100');
                  tileIcon = crop.isFullyGrown ? '🌾' : '🌱';
                  tileLabel = `Crop at (${x}, ${y}): ${crop.isFullyGrown ? 'Ready to Harvest' : `Phase ${crop.currentPhase}/4`} (${crop.isWatered ? 'Watered' : 'Dry'})`;
                  tileType = 'Crop';
                } else if (obj) {
                  if (obj.isDebris) {
                    tileColor = 'bg-stone-500/80 text-white';
                    tileIcon = '🪨';
                    tileLabel = `Debris: ${obj.name} at (${x}, ${y})`;
                    tileType = 'Debris';
                  } else if (obj.isChest) {
                    tileColor = 'bg-amber-700 text-white';
                    tileIcon = '📦';
                    tileLabel = `Chest: ${obj.name} at (${x}, ${y})`;
                    tileType = 'Chest';
                  } else {
                    tileColor = 'bg-slate-600 text-white';
                    tileIcon = '⚙️';
                    tileLabel = `Object: ${obj.name} at (${x}, ${y})`;
                    tileType = 'Object';
                  }
                }

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTile({ x, y, info: tileLabel, type: tileType })}
                    style={{
                      width: `${16 * zoom}px`,
                      height: `${16 * zoom}px`,
                      fontSize: `${10 * zoom}px`,
                    }}
                    className={`flex items-center justify-center rounded-xs transition-colors cursor-pointer ${tileColor}`}
                    title={tileLabel}
                  >
                    {tileIcon}
                  </button>
                );
              })
            ))}
          </div>
        </div>

        {/* Selected Tile Inspector */}
        {selectedTile ? (
          <div className="p-4 rounded-2xl bg-bg-muted/40 border border-border-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stardew-primary/10 text-stardew-primary flex items-center justify-center font-bold">
                <Info size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">Tile Inspector</h5>
                <p className="text-sm text-text-primary font-medium mt-0.5">{selectedTile.info}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTile(null)}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Deselect
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-text-secondary px-2">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#8B5A2B]"></span> Buildings</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-amber-400"></span> Ready Harvest</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#4A7C59]"></span> Watered Crops</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-stone-500"></span> Debris Tiles</span>
            </div>
            <span className="text-[11px] font-mono">Grid: 50x40 Tiles</span>
          </div>
        )}
      </div>
    </div>
  );
}
