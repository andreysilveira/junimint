import { XMLParser } from 'fast-xml-parser';
import { 
  StardewSave, 
  Player, 
  WorldState, 
  FarmState, 
  Relationship, 
  InventoryItem, 
  Quest, 
  Collections,
  SaveMetadata
} from '@/src/domain/save/types';
import { createSkillData } from '@/src/domain/player/skills';
import { inferCategory } from '@/src/domain/inventory/catalog';
import { buildRelationship } from '@/src/domain/relationships/npcs';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
  isArray: (name) => {
    // Force specific collection elements to always be parsed as arrays
    return [
      'Item', 
      'int', 
      'item', 
      'Building', 
      'TerrainFeature', 
      'Quest',
      'string'
    ].includes(name);
  }
});

export function parseSaveXml(xmlString: string, originalFileName: string = 'SaveGameInfo'): StardewSave {
  if (!xmlString || typeof xmlString !== 'string' || xmlString.trim().length === 0) {
    throw new Error('Save file is empty or unreadable.');
  }

  let rawObj: any;
  try {
    rawObj = xmlParser.parse(xmlString);
  } catch (err: any) {
    throw new Error(`Failed to parse XML: ${err.message || 'Malformed XML structure.'}`);
  }

  const saveGame = rawObj.SaveGame;
  if (!saveGame) {
    throw new Error('Invalid Stardew Valley save: Missing root <SaveGame> element.');
  }

  const playerNode = saveGame.player;
  if (!playerNode) {
    throw new Error('Invalid Stardew Valley save: Missing <player> element inside <SaveGame>.');
  }

  // 1. Metadata
  const metadata: SaveMetadata = {
    gameVersion: String(saveGame.gameVersion || '1.6'),
    saveVersion: Number(saveGame.saveVersion) || 1,
    originalFileName,
    fileSize: xmlString.length,
    isMultiplayer: Array.isArray(saveGame.farmhands?.Farmer) || Boolean(saveGame.farmhands),
    saveGuid: String(saveGame.uniqueIDForThisGame || ''),
    parsedAt: Date.now(),
  };

  // 2. Skills
  const expInts = playerNode.experiencePoints?.int || [];
  const levelInts = playerNode.skillLevels?.int || [];

  const getExp = (idx: number) => {
    if (Array.isArray(expInts)) return Number(expInts[idx]) || 0;
    return Number(expInts) || 0;
  };
  const getLvl = (idx: number) => {
    if (Array.isArray(levelInts)) return Number(levelInts[idx]) || 0;
    return Number(levelInts) || 0;
  };

  const skills = {
    farming: createSkillData('farming', getLvl(0), getExp(0)),
    fishing: createSkillData('fishing', getLvl(1), getExp(1)),
    foraging: createSkillData('foraging', getLvl(2), getExp(2)),
    mining: createSkillData('mining', getLvl(3), getExp(3)),
    combat: createSkillData('combat', getLvl(4), getExp(4)),
  };

  // 3. Inventory Items
  const inventory: InventoryItem[] = [];
  const itemsContainer = playerNode.items?.Item || playerNode.items;
  if (itemsContainer) {
    const rawList = Array.isArray(itemsContainer) ? itemsContainer : [itemsContainer];
    rawList.forEach((item: any, slotIndex: number) => {
      if (item && (item.name || item.ItemId || item.itemId || item['@_xsi:type'])) {
        const name = String(item.name || item.DisplayName || item.ItemId || 'Unknown Item');
        const itemId = String(item.ItemId || item.itemId || item.parentSheetIndex || slotIndex);
        const stack = Math.max(1, Number(item.Stack || item.stack) || 1);
        const quality = Number(item.quality || item.Quality) || 0;
        const category = inferCategory(name, itemId);

        inventory.push({
          slotIndex,
          name,
          itemId,
          stack,
          quality,
          category,
          type: item['@_xsi:type'] || 'Object',
        });
      }
    });
  }

  // 4. Relationships
  const relationships: Relationship[] = [];
  const friendshipContainer = playerNode.friendshipData?.item;
  if (friendshipContainer) {
    const list = Array.isArray(friendshipContainer) ? friendshipContainer : [friendshipContainer];
    list.forEach((entry: any) => {
      const key = entry?.key?.string || entry?.key;
      const val = entry?.value?.Friendship || entry?.value;
      if (key && typeof key === 'string') {
        const points = Number(val?.Points || val?.points) || 0;
        const statusStr = String(val?.Status || val?.status || 'Friendly');
        const gifts = Number(val?.GiftsThisWeek || val?.giftsThisWeek) || 0;
        const talked = Boolean(val?.TalkedToToday || val?.talkedToToday);
        relationships.push(buildRelationship(key, points, statusStr, gifts, talked));
      }
    });
  }

  // 5. Player
  const player: Player = {
    name: String(playerNode.name || 'Farmer'),
    farmName: String(playerNode.farmName || 'Farm'),
    favoriteThing: String(playerNode.favoriteThing || 'Stardrop'),
    money: Number(playerNode.money) || 0,
    totalMoneyEarned: Number(playerNode.totalMoneyEarned) || Number(playerNode.money) || 0,
    clubCoins: Number(playerNode.clubCoins) || 0,
    health: Number(playerNode.health) || 100,
    maxHealth: Number(playerNode.maxHealth) || 100,
    stamina: Number(playerNode.stamina) || 270,
    maxStamina: Number(playerNode.maxStamina) || 270,
    deepClimbLevel: Number(playerNode.deepestMineLevel || playerNode.deepClimbLevel) || 0,
    dailyLuck: Number(saveGame.dailyLuck) || 0,
    skills,
    professions: Array.isArray(playerNode.professions?.int) ? playerNode.professions.int.map(Number) : [],
    gender: String(playerNode.gender || 'Male'),
    catPerson: Boolean(playerNode.catPerson),
    whichFarm: Number(saveGame.whichFarm) || 0,
    inventory,
  };

  // 6. World State
  const seasonStr = String(saveGame.currentSeason || 'spring').toLowerCase();
  const validSeason = ['spring', 'summer', 'fall', 'winter'].includes(seasonStr) 
    ? (seasonStr as 'spring' | 'summer' | 'fall' | 'winter') 
    : 'spring';

  const world: WorldState = {
    dayOfMonth: Math.max(1, Math.min(28, Number(saveGame.dayOfMonth) || 1)),
    currentSeason: validSeason,
    year: Math.max(1, Number(saveGame.year) || 1),
    dailyLuck: Number(saveGame.dailyLuck) || 0,
    weatherForTomorrow: String(saveGame.weatherForTomorrow || 'Sun'),
    isRaining: Boolean(saveGame.isRaining),
    isLightning: Boolean(saveGame.isLightning),
    isSnowing: Boolean(saveGame.isSnowing),
    mineLevel: Number(playerNode.deepestMineLevel) || 0,
    skullCaveLevel: Number(playerNode.skullCaveLevel) || 0,
    ccComplete: Boolean(saveGame.communityCenter?.isComplete || saveGame.ccIsComplete),
    jojaMember: Boolean(playerNode.hasJojaMember),
    goldenWalnuts: Number(saveGame.goldenWalnuts) || 0,
  };

  // 7. Farm & Locations State
  const farmState = extractFarmState(saveGame);

  // 8. Quests
  const quests: Quest[] = [];
  const questNodes = playerNode.questLog?.Quest;
  if (questNodes) {
    const list = Array.isArray(questNodes) ? questNodes : [questNodes];
    list.forEach((q: any) => {
      if (q) {
        quests.push({
          id: String(q.id || q._id || quests.length),
          title: String(q.questTitle || q.name || 'Community Quest'),
          currentObjective: String(q.currentObjective || 'In progress'),
          isComplete: Boolean(q.completed),
          daysLeft: Number(q.daysLeft) || undefined,
          moneyReward: Number(q.moneyReward) || undefined,
        });
      }
    });
  }

  // 9. Collections (Museum, fish, cooking, crafting)
  const collections: Collections = {
    fishCaughtCount: countDictionaryEntries(playerNode.fishCaught),
    totalFishCount: 67,
    mineralsFoundCount: countDictionaryEntries(playerNode.mineralsFound),
    totalMineralsCount: 53,
    artifactsFoundCount: countDictionaryEntries(playerNode.archaeologyFound),
    totalArtifactsCount: 42,
    cookingRecipesKnown: countDictionaryEntries(playerNode.cookingRecipes),
    craftingRecipesKnown: countDictionaryEntries(playerNode.craftingRecipes),
  };

  return {
    metadata,
    player,
    world,
    farm: farmState,
    relationships,
    quests,
    collections,
    raw: rawObj,
    originalXml: xmlString,
  };
}

function countDictionaryEntries(dictNode: any): number {
  if (!dictNode) return 0;
  if (dictNode.item) {
    return Array.isArray(dictNode.item) ? dictNode.item.length : 1;
  }
  return 0;
}

function extractFarmState(saveGame: any): FarmState {
  const farmState: FarmState = {
    width: 80,
    height: 65,
    farmType: getFarmTypeName(Number(saveGame.whichFarm) || 0),
    buildings: [],
    objects: [],
    crops: [],
    debrisCount: 0,
    cropsCount: 0,
    buildingsCount: 0,
  };

  // Find Farm location inside <locations>
  const locations = saveGame.locations?.GameLocation;
  let farmLoc = null;
  if (Array.isArray(locations)) {
    farmLoc = locations.find((l: any) => l['@_xsi:type'] === 'Farm' || l.name === 'Farm');
  } else if (locations && (locations['@_xsi:type'] === 'Farm' || locations.name === 'Farm')) {
    farmLoc = locations;
  }

  if (farmLoc) {
    // Extract buildings
    const buildingList = farmLoc.buildings?.Building;
    if (buildingList) {
      const bArray = Array.isArray(buildingList) ? buildingList : [buildingList];
      bArray.forEach((b: any, index: number) => {
        if (b) {
          farmState.buildings.push({
            id: String(b.id || index),
            name: String(b.buildingType || b.name || 'Building'),
            buildingType: String(b.buildingType || 'Standard'),
            tileX: Number(b.tileX) || 0,
            tileY: Number(b.tileY) || 0,
            tilesWide: Number(b.tilesWide) || 3,
            tilesHigh: Number(b.tilesHigh) || 2,
            animalCount: Number(b.currentOccupants) || 0,
          });
        }
      });
    }

    // Extract objects (chests, machines, stones, weeds, twigs)
    const objectsList = farmLoc.objects?.item;
    if (objectsList) {
      const oArray = Array.isArray(objectsList) ? objectsList : [objectsList];
      oArray.forEach((entry: any) => {
        const key = entry?.key?.Vector2;
        const val = entry?.value?.Object;
        if (key && val) {
          const name = String(val.name || val.DisplayName || 'Object');
          const isDebris = ['Stone', 'Weeds', 'Twig'].some(d => name.includes(d));
          const isChest = name.includes('Chest') || val['@_xsi:type'] === 'Chest';
          const isMachine = ['Furnace', 'Keg', 'Preserves Jar', 'Bee House', 'Cask', 'Cheese Press', 'Mayonnaise Machine'].some(m => name.includes(m));

          if (isDebris) farmState.debrisCount++;

          farmState.objects.push({
            tileX: Number(key.X) || 0,
            tileY: Number(key.Y) || 0,
            name,
            itemId: String(val.parentSheetIndex || val.ItemId || '0'),
            isDebris,
            isChest,
            isMachine,
            readyForHarvest: Boolean(val.readyForHarvest),
          });
        }
      });
    }

    // Extract crops / terrain features
    const terrainFeatures = farmLoc.terrainFeatures?.item;
    if (terrainFeatures) {
      const tArray = Array.isArray(terrainFeatures) ? terrainFeatures : [terrainFeatures];
      tArray.forEach((entry: any) => {
        const key = entry?.key?.Vector2;
        const feature = entry?.value?.TerrainFeature;
        if (key && feature) {
          const hoeDirt = feature.crop ? feature : (feature['@_xsi:type'] === 'HoeDirt' ? feature : null);
          if (hoeDirt && hoeDirt.crop) {
            const currentPhase = Number(hoeDirt.crop.currentPhase) || 0;
            const isFullyGrown = Boolean(hoeDirt.crop.fullyGrown) || currentPhase >= 4;
            const isWatered = Number(hoeDirt.state) === 1;

            farmState.cropsCount++;
            farmState.crops.push({
              tileX: Number(key.X) || 0,
              tileY: Number(key.Y) || 0,
              name: 'Crop',
              currentPhase,
              maxPhase: 4,
              isFullyGrown,
              isWatered,
              isDead: Boolean(hoeDirt.crop.dead),
            });
          }
        }
      });
    }
  }

  farmState.buildingsCount = farmState.buildings.length;
  return farmState;
}

function getFarmTypeName(which: number): string {
  const types: Record<number, string> = {
    0: 'Standard Farm',
    1: 'Riverland Farm',
    2: 'Forest Farm',
    3: 'Hill-top Farm',
    4: 'Wilderness Farm',
    5: 'Four Corners Farm',
    6: 'Beach Farm',
    7: 'Meadowlands Farm',
  };
  return types[which] || 'Standard Farm';
}
