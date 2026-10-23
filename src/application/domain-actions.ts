import { 
  StardewSave, 
  SaveChange, 
  SkillType, 
  InventoryItem, 
  RelationshipStatus 
} from '@/src/domain/save/types';
import { createSkillData, getMinExpForLevel } from '@/src/domain/player/skills';
import { calculatePointsFromHearts } from '@/src/domain/relationships/npcs';

export interface ActionResult {
  save: StardewSave;
  change: SaveChange;
}

let changeCounter = 0;

export function createChangeRecord(
  category: string,
  title: string,
  description: string,
  before: unknown = null,
  after: unknown = null
): SaveChange {
  changeCounter += 1;
  const uniqueRandom = Math.random().toString(36).substring(2, 9);
  return {
    id: `change-${Date.now()}-${changeCounter}-${uniqueRandom}`,
    timestamp: Date.now(),
    category,
    title,
    description,
    before,
    after,
  };
}

export function setPlayerIdentity(save: StardewSave, name: string, farmName: string): ActionResult {
  const before = { name: save.player.name, farmName: save.player.farmName };
  const after = { name: name.trim(), farmName: farmName.trim() };

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      name: after.name,
      farmName: after.farmName,
    },
  };

  const change = createChangeRecord(
    'Player',
    'Updated Identity',
    `Renamed character to "${after.name}" on "${after.farmName}" Farm`,
    before,
    after
  );

  return { save: updatedSave, change };
}

export function setMoney(save: StardewSave, amount: number): ActionResult {
  const validAmount = Math.max(0, Math.floor(amount));
  const before = save.player.money;
  
  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      money: validAmount,
      totalMoneyEarned: Math.max(save.player.totalMoneyEarned, validAmount),
    },
  };

  const diff = validAmount - before;
  const description = diff >= 0 
    ? `Increased gold by +${diff.toLocaleString()}g (New total: ${validAmount.toLocaleString()}g)` 
    : `Reduced gold by ${Math.abs(diff).toLocaleString()}g (New total: ${validAmount.toLocaleString()}g)`;

  const change = createChangeRecord('Economy', 'Set Gold', description, before, validAmount);
  return { save: updatedSave, change };
}

export function addMoney(save: StardewSave, delta: number): ActionResult {
  return setMoney(save, save.player.money + delta);
}

export function setHealth(save: StardewSave, health: number, maxHealth?: number): ActionResult {
  const newMax = maxHealth !== undefined ? Math.max(1, maxHealth) : save.player.maxHealth;
  const newHealth = Math.max(0, health);
  const before = { health: save.player.health, maxHealth: save.player.maxHealth };

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      health: newHealth,
      maxHealth: newMax,
    },
  };

  const change = createChangeRecord(
    'Vitals',
    'Updated Health',
    `Health set to ${newHealth} / ${newMax}`,
    before,
    { health: newHealth, maxHealth: newMax }
  );

  return { save: updatedSave, change };
}

export function setStamina(save: StardewSave, stamina: number, maxStamina?: number): ActionResult {
  const newMax = maxStamina !== undefined ? Math.max(1, maxStamina) : save.player.maxStamina;
  const newStamina = Math.max(0, stamina);
  const before = { stamina: save.player.stamina, maxStamina: save.player.maxStamina };

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      stamina: newStamina,
      maxStamina: newMax,
    },
  };

  const change = createChangeRecord(
    'Vitals',
    'Updated Stamina',
    `Stamina set to ${Math.round(newStamina)} / ${newMax}`,
    before,
    { stamina: newStamina, maxStamina: newMax }
  );

  return { save: updatedSave, change };
}

export function setSkill(
  save: StardewSave, 
  skillType: SkillType, 
  level: number, 
  experience?: number
): ActionResult {
  const boundedLevel = Math.max(0, Math.min(10, Math.floor(level)));
  const minExp = getMinExpForLevel(boundedLevel);
  const finalExp = experience !== undefined ? Math.max(0, experience) : Math.max(save.player.skills[skillType]?.experience || 0, minExp);

  const before = { ...save.player.skills[skillType] };
  const updatedSkill = createSkillData(skillType, boundedLevel, finalExp);

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      skills: {
        ...save.player.skills,
        [skillType]: updatedSkill,
      },
    },
  };

  const change = createChangeRecord(
    'Skills',
    `Modified ${updatedSkill.name}`,
    `${updatedSkill.name} level set to ${boundedLevel} (${finalExp.toLocaleString()} XP)`,
    before,
    updatedSkill
  );

  return { save: updatedSave, change };
}

export function maxAllSkills(save: StardewSave): ActionResult {
  const before = { ...save.player.skills };
  const skillTypes: SkillType[] = ['farming', 'mining', 'foraging', 'fishing', 'combat'];
  const newSkills = { ...save.player.skills };

  skillTypes.forEach((type) => {
    newSkills[type] = createSkillData(type, 10, 15000);
  });

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      skills: newSkills,
    },
  };

  const change = createChangeRecord(
    'Skills',
    'Maxed All Skills',
    'All skills (Farming, Mining, Foraging, Fishing, Combat) maxed to Level 10 (15,000 XP)',
    before,
    newSkills
  );

  return { save: updatedSave, change };
}

export function setGodMode(save: StardewSave): ActionResult {
  const before = {
    health: save.player.health,
    maxHealth: save.player.maxHealth,
    stamina: save.player.stamina,
    maxStamina: save.player.maxStamina,
  };

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      health: 999,
      maxHealth: 999,
      stamina: 999,
      maxStamina: 999,
    },
  };

  const change = createChangeRecord(
    'Vitals',
    'Enabled God Mode',
    'Set Health and Stamina to 999 / 999',
    before,
    { health: 999, maxHealth: 999, stamina: 999, maxStamina: 999 }
  );

  return { save: updatedSave, change };
}

// INVENTORY ACTIONS (Fixed indexing: ALWAYS uses slotIndex directly!)
export function updateInventoryItem(
  save: StardewSave, 
  slotIndex: number, 
  partial: Partial<InventoryItem>
): ActionResult {
  const currentItem = save.player.inventory.find(i => i.slotIndex === slotIndex);
  if (!currentItem) {
    throw new Error(`Item at slot index ${slotIndex} not found in inventory.`);
  }

  const before = { ...currentItem };
  const updatedItem: InventoryItem = {
    ...currentItem,
    ...partial,
    stack: partial.stack !== undefined ? Math.max(1, partial.stack) : currentItem.stack,
    quality: partial.quality !== undefined ? partial.quality : currentItem.quality,
  };

  const updatedInventory = save.player.inventory.map(item => 
    item.slotIndex === slotIndex ? updatedItem : item
  );

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      inventory: updatedInventory,
    },
  };

  const change = createChangeRecord(
    'Inventory',
    `Updated ${updatedItem.name}`,
    `Slot #${slotIndex}: ${updatedItem.name} (Stack: ${updatedItem.stack}, Quality: ${updatedItem.quality})`,
    before,
    updatedItem
  );

  return { save: updatedSave, change };
}

export function addInventoryItem(save: StardewSave, itemData: Omit<InventoryItem, 'slotIndex'>): ActionResult {
  // Find next available slotIndex
  const usedSlots = new Set(save.player.inventory.map(i => i.slotIndex));
  let nextSlot = 0;
  while (usedSlots.has(nextSlot)) {
    nextSlot++;
  }

  const newItem: InventoryItem = {
    ...itemData,
    slotIndex: nextSlot,
    stack: Math.max(1, itemData.stack || 1),
    quality: itemData.quality || 0,
  };

  const updatedInventory = [...save.player.inventory, newItem];

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      inventory: updatedInventory,
    },
  };

  const change = createChangeRecord(
    'Inventory',
    `Added ${newItem.name}`,
    `Added ${newItem.stack}x ${newItem.name} to backpack`,
    null,
    newItem
  );

  return { save: updatedSave, change };
}

export function removeInventoryItem(save: StardewSave, slotIndex: number): ActionResult {
  const itemToRemove = save.player.inventory.find(i => i.slotIndex === slotIndex);
  const updatedInventory = save.player.inventory.filter(i => i.slotIndex !== slotIndex);

  const updatedSave: StardewSave = {
    ...save,
    player: {
      ...save.player,
      inventory: updatedInventory,
    },
  };

  const change = createChangeRecord(
    'Inventory',
    `Removed ${itemToRemove?.name || 'Item'}`,
    `Removed slot #${slotIndex} (${itemToRemove?.name || 'Item'}) from backpack`,
    itemToRemove,
    null
  );

  return { save: updatedSave, change };
}

export function duplicateInventoryItem(save: StardewSave, slotIndex: number): ActionResult {
  const item = save.player.inventory.find(i => i.slotIndex === slotIndex);
  if (!item) throw new Error('Item to duplicate not found.');

  return addInventoryItem(save, {
    name: item.name,
    itemId: item.itemId,
    stack: item.stack,
    quality: item.quality,
    category: item.category,
    type: item.type,
  });
}

// RELATIONSHIP ACTIONS
export function setRelationshipHearts(save: StardewSave, npcName: string, hearts: number): ActionResult {
  const boundedHearts = Math.max(0, Math.min(14, hearts));
  const points = calculatePointsFromHearts(boundedHearts);

  const existing = save.relationships.find(r => r.npcName === npcName);
  const before = existing ? { ...existing } : null;

  let updatedRelationships = [...save.relationships];
  if (existing) {
    updatedRelationships = updatedRelationships.map(r => 
      r.npcName === npcName ? { ...r, hearts: boundedHearts, points } : r
    );
  } else {
    updatedRelationships.push({
      npcName,
      displayName: npcName,
      points,
      hearts: boundedHearts,
      maxHearts: 10,
      status: 'Friendly' as RelationshipStatus,
      isDatable: false,
      giftsThisWeek: 0,
      talkedToToday: true,
    });
  }

  const updatedSave: StardewSave = {
    ...save,
    relationships: updatedRelationships,
  };

  const change = createChangeRecord(
    'Social',
    `Friendship with ${npcName}`,
    `Set ${npcName}'s friendship to ${boundedHearts} Hearts (${points} points)`,
    before,
    { npcName, hearts: boundedHearts, points }
  );

  return { save: updatedSave, change };
}

export function maxAllFriendships(save: StardewSave): ActionResult {
  const before = [...save.relationships];
  const updated = save.relationships.map(r => ({
    ...r,
    hearts: r.maxHearts,
    points: calculatePointsFromHearts(r.maxHearts),
  }));

  const updatedSave: StardewSave = {
    ...save,
    relationships: updated,
  };

  const change = createChangeRecord(
    'Social',
    'Maxed All Relationships',
    `Maxed friendship hearts for all ${updated.length} known villagers`,
    before,
    updated
  );

  return { save: updatedSave, change };
}

// WORLD ACTIONS
export function setWorldDate(
  save: StardewSave, 
  season: 'spring' | 'summer' | 'fall' | 'winter', 
  day: number, 
  year: number
): ActionResult {
  const boundedDay = Math.max(1, Math.min(28, Math.floor(day)));
  const boundedYear = Math.max(1, Math.floor(year));
  const before = { ...save.world };

  const updatedSave: StardewSave = {
    ...save,
    world: {
      ...save.world,
      currentSeason: season,
      dayOfMonth: boundedDay,
      year: boundedYear,
    },
  };

  const change = createChangeRecord(
    'World',
    'Changed Calendar Date',
    `Set calendar to Day ${boundedDay} of ${season.charAt(0).toUpperCase() + season.slice(1)}, Year ${boundedYear}`,
    before,
    { season, day: boundedDay, year: boundedYear }
  );

  return { save: updatedSave, change };
}

export function setDailyLuck(save: StardewSave, luck: number): ActionResult {
  const before = save.world.dailyLuck;
  const updatedSave: StardewSave = {
    ...save,
    world: {
      ...save.world,
      dailyLuck: luck,
    },
  };

  const change = createChangeRecord(
    'World',
    'Modified Daily Luck',
    `Daily luck set to ${(luck * 100).toFixed(1)}%`,
    before,
    luck
  );

  return { save: updatedSave, change };
}

// FARM ACTIONS
export function cleanFarmDebris(save: StardewSave): ActionResult {
  const initialDebrisCount = save.farm.debrisCount;
  const filteredObjects = save.farm.objects.filter(o => !o.isDebris);

  const updatedFarm = {
    ...save.farm,
    objects: filteredObjects,
    debrisCount: 0,
  };

  const updatedSave: StardewSave = {
    ...save,
    farm: updatedFarm,
  };

  const change = createChangeRecord(
    'Farm',
    'Cleared All Farm Debris',
    `Removed ${initialDebrisCount} debris tiles (stones, twigs, weeds) across the farm`,
    { debrisCount: initialDebrisCount },
    { debrisCount: 0 }
  );

  return { save: updatedSave, change };
}

export function waterAllCrops(save: StardewSave): ActionResult {
  const unwateredCount = save.farm.crops.filter(c => !c.isWatered).length;
  const updatedCrops = save.farm.crops.map(c => ({ ...c, isWatered: true }));

  const updatedFarm = {
    ...save.farm,
    crops: updatedCrops,
  };

  const updatedSave: StardewSave = {
    ...save,
    farm: updatedFarm,
  };

  const change = createChangeRecord(
    'Farm',
    'Watered All Crops',
    `Watered ${unwateredCount} crops across the farm`,
    null,
    { wateredCrops: updatedCrops.length }
  );

  return { save: updatedSave, change };
}

export function growAllCrops(save: StardewSave): ActionResult {
  const growingCrops = save.farm.crops.filter(c => !c.isFullyGrown).length;
  const updatedCrops = save.farm.crops.map(c => ({
    ...c,
    currentPhase: c.maxPhase,
    isFullyGrown: true,
    isWatered: true,
  }));

  const updatedFarm = {
    ...save.farm,
    crops: updatedCrops,
  };

  const updatedSave: StardewSave = {
    ...save,
    farm: updatedFarm,
  };

  const change = createChangeRecord(
    'Farm',
    'Instantly Grew All Crops',
    `Accelerated growth of ${growingCrops} crops to fully harvestable state`,
    null,
    { harvestableCrops: updatedCrops.length }
  );

  return { save: updatedSave, change };
}
