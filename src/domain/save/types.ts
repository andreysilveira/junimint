// Domain types for Stardew Valley Save Engine

export type SkillType = 'farming' | 'mining' | 'foraging' | 'fishing' | 'combat';

export interface SkillData {
  name: string;
  type: SkillType;
  level: number;
  experience: number;
  nextLevelExp: number;
  progressPercent: number;
}

export interface Player {
  name: string;
  farmName: string;
  favoriteThing: string;
  money: number;
  totalMoneyEarned: number;
  clubCoins: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  deepClimbLevel: number;
  dailyLuck: number;
  skills: Record<SkillType, SkillData>;
  professions: number[];
  gender: string;
  catPerson: boolean;
  whichFarm: number;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  slotIndex: number;
  name: string;
  itemId: string;
  stack: number;
  quality: number; // 0: Normal, 1: Silver, 2: Gold, 4: Iridium
  category?: string;
  isTool?: boolean;
  type?: string;
  price?: number;
}

export type RelationshipStatus = 'Friendly' | 'Dating' | 'Engaged' | 'Married' | 'Divorced' | 'Unknown';

export interface Relationship {
  npcName: string;
  displayName: string;
  points: number;
  hearts: number;
  maxHearts: number;
  status: RelationshipStatus;
  isDatable: boolean;
  giftsThisWeek: number;
  talkedToToday: boolean;
  birthday?: { season: string; day: number };
}

export interface WorldState {
  dayOfMonth: number;
  currentSeason: 'spring' | 'summer' | 'fall' | 'winter';
  year: number;
  dailyLuck: number;
  weatherForTomorrow?: string;
  isRaining?: boolean;
  isLightning?: boolean;
  isSnowing?: boolean;
  mineLevel: number;
  skullCaveLevel: number;
  ccComplete: boolean;
  jojaMember: boolean;
  goldenWalnuts: number;
}

export type FarmTileType = 'empty' | 'building' | 'crop' | 'tree' | 'debris' | 'chest' | 'machine' | 'water' | 'fence';

export interface FarmTile {
  x: number;
  y: number;
  type: FarmTileType;
  name: string;
  itemId?: string;
  details?: string;
  isRemovable?: boolean;
  isWatered?: boolean;
  isFullyGrown?: boolean;
  buildingType?: string;
}

export interface FarmBuilding {
  id: string;
  name: string;
  buildingType: string;
  tileX: number;
  tileY: number;
  tilesWide: number;
  tilesHigh: number;
  animalCount?: number;
}

export interface FarmObject {
  tileX: number;
  tileY: number;
  name: string;
  itemId: string;
  isDebris: boolean;
  isChest: boolean;
  isMachine: boolean;
  readyForHarvest?: boolean;
}

export interface FarmCrop {
  tileX: number;
  tileY: number;
  name: string;
  currentPhase: number;
  maxPhase: number;
  isFullyGrown: boolean;
  isWatered: boolean;
  isDead: boolean;
}

export interface FarmState {
  width: number;
  height: number;
  farmType: string;
  buildings: FarmBuilding[];
  objects: FarmObject[];
  crops: FarmCrop[];
  debrisCount: number;
  cropsCount: number;
  buildingsCount: number;
}

export interface Quest {
  id: string;
  title: string;
  currentObjective: string;
  isComplete: boolean;
  daysLeft?: number;
  moneyReward?: number;
}

export interface Collections {
  fishCaughtCount: number;
  totalFishCount: number;
  mineralsFoundCount: number;
  totalMineralsCount: number;
  artifactsFoundCount: number;
  totalArtifactsCount: number;
  cookingRecipesKnown: number;
  craftingRecipesKnown: number;
}

export interface SaveMetadata {
  gameVersion: string;
  saveVersion: number;
  originalFileName: string;
  fileSize: number;
  isMultiplayer: boolean;
  saveGuid?: string;
  parsedAt: number;
}

export type ValidationSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface SaveValidationIssue {
  id: string;
  severity: ValidationSeverity;
  category: 'player' | 'inventory' | 'world' | 'farm' | 'skills' | 'structure';
  title: string;
  message: string;
  field?: string;
  suggestion?: string;
}

export interface SaveValidationResult {
  isValid: boolean;
  canExport: boolean;
  issues: SaveValidationIssue[];
  summary: {
    info: number;
    warnings: number;
    errors: number;
    critical: number;
  };
}

export interface SaveChange {
  id: string;
  timestamp: number;
  category: string;
  title: string;
  description: string;
  before: unknown;
  after: unknown;
}

export interface StardewSave {
  metadata: SaveMetadata;
  player: Player;
  world: WorldState;
  farm: FarmState;
  relationships: Relationship[];
  quests: Quest[];
  collections: Collections;
  raw: any; // Complete parsed JSON/XML tree
  originalXml: string; // Original unmodified XML string
}
