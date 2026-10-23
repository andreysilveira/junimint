import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export interface StardewItem {
  name: string;
  stack: number;
  quality: number;
  id: string;
  category?: string;
}

export interface StardewSkill {
  name: string;
  level: number;
  experience: number;
}

export interface StardewNPC {
  name: string;
  points: number;
  status: string;
}

export interface StardewSaveData {
  player: {
    name: string;
    farmName: string;
    money: number;
    maxHealth: number;
    health: number;
    maxStamina: number;
    stamina: number;
    skills: {
      farming: StardewSkill;
      mining: StardewSkill;
      foraging: StardewSkill;
      fishing: StardewSkill;
      combat: StardewSkill;
    };
    inventory: StardewItem[];
    relationships: StardewNPC[];
  };
  world: {
    dayOfMonth: number;
    currentSeason: string;
    year: number;
    dailyLuck: number;
  };
  raw: any; // The full parsed object to preserve other data
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});

export function parseStardewSave(xmlString: string): StardewSaveData {
  const jsonObj = parser.parse(xmlString);
  const saveGame = jsonObj.SaveGame;
  
  if (!saveGame) {
    throw new Error('Invalid save file: SaveGame element not found.');
  }

  const player = saveGame.player;
  if (!player) {
    throw new Error('Invalid save file: Player element not found.');
  }

  // Helper to extract skill data with defensive checks
  const getSkill = (index: number, name: string): StardewSkill => {
    const expInts = player.experiencePoints?.int;
    const levelInts = player.skillLevels?.int;

    const experience = Array.isArray(expInts) ? expInts[index] : (expInts || 0);
    const level = Array.isArray(levelInts) ? levelInts[index] : (levelInts || 0);

    return {
      name,
      level: Number(level) || 0,
      experience: Number(experience) || 0,
    };
  };

  // Helper to extract inventory with defensive checks
  const extractInventory = (items: any): StardewItem[] => {
    if (!items || !items.Item) return [];
    const itemList = Array.isArray(items.Item) ? items.Item : [items.Item];
    return itemList.map((item: any) => {
      if (!item) return null;
      return {
        name: item.name || 'Unknown Item',
        stack: Number(item.stack) || 1,
        quality: Number(item.quality) || 0,
        id: String(item.itemId || '0'),
      };
    }).filter(Boolean) as StardewItem[];
  };

  return {
    player: {
      name: String(player.name || 'Unknown'),
      farmName: String(player.farmName || 'Unknown'),
      money: Number(player.money) || 0,
      maxHealth: Number(player.maxHealth) || 100,
      health: Number(player.health) || 100,
      maxStamina: Number(player.maxStamina) || 270,
      stamina: Number(player.stamina) || 270,
      skills: {
        farming: getSkill(0, 'Farming'),
        mining: getSkill(3, 'Mining'),
        foraging: getSkill(2, 'Foraging'),
        fishing: getSkill(1, 'Fishing'),
        combat: getSkill(4, 'Combat'),
      },
      inventory: extractInventory(player.items),
      relationships: [], // Simplified for now
    },
    world: {
      dayOfMonth: Number(saveGame.dayOfMonth) || 1,
      currentSeason: String(saveGame.currentSeason || 'spring'),
      year: Number(saveGame.year) || 1,
      dailyLuck: Number(saveGame.dailyLuck) || 0,
    },
    raw: jsonObj,
  };
}

export function updateStardewSave(data: StardewSaveData): string {
  const raw = { ...data.raw };
  const player = raw.SaveGame.player;

  if (!player) return builder.build(raw);

  // Sync back basic stats
  player.name = data.player.name;
  player.farmName = data.player.farmName;
  player.money = data.player.money;
  player.health = data.player.health;
  player.maxHealth = data.player.maxHealth;
  player.stamina = data.player.stamina;
  player.maxStamina = data.player.maxStamina;

  // Sync skills with defensive checks
  if (player.skillLevels && Array.isArray(player.skillLevels.int)) {
    player.skillLevels.int[0] = data.player.skills.farming.level;
    player.skillLevels.int[3] = data.player.skills.mining.level;
    player.skillLevels.int[2] = data.player.skills.foraging.level;
    player.skillLevels.int[1] = data.player.skills.fishing.level;
    player.skillLevels.int[4] = data.player.skills.combat.level;
  }

  // Sync world
  if (raw.SaveGame) {
    raw.SaveGame.dayOfMonth = data.world.dayOfMonth;
    raw.SaveGame.currentSeason = data.world.currentSeason;
    raw.SaveGame.year = data.world.year;
  }

  return builder.build(raw);
}
