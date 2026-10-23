import { XMLBuilder } from 'fast-xml-parser';
import { StardewSave, InventoryItem } from '@/src/domain/save/types';

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  suppressEmptyNode: false,
});

export function serializeSaveXml(save: StardewSave): string {
  if (!save || !save.raw || !save.raw.SaveGame) {
    throw new Error('Cannot serialize save: invalid internal save structure.');
  }

  // Clone raw JSON structure to avoid direct mutation side effects
  const rawCopy = JSON.parse(JSON.stringify(save.raw));
  const saveGame = rawCopy.SaveGame;
  const player = saveGame.player;

  if (!player) {
    throw new Error('SaveGame contains no player object.');
  }

  // 1. Sync Player basic attributes
  player.name = save.player.name;
  player.farmName = save.player.farmName;
  if (save.player.favoriteThing) player.favoriteThing = save.player.favoriteThing;
  player.money = Math.max(0, Math.floor(save.player.money));
  player.totalMoneyEarned = Math.max(player.money, Math.floor(save.player.totalMoneyEarned || save.player.money));
  player.health = Math.max(0, Math.floor(save.player.health));
  player.maxHealth = Math.max(1, Math.floor(save.player.maxHealth));
  player.stamina = Math.max(0, Math.floor(save.player.stamina));
  player.maxStamina = Math.max(1, Math.floor(save.player.maxStamina));
  if (save.player.clubCoins !== undefined) player.clubCoins = save.player.clubCoins;

  // 2. Sync Skills and XP
  // Ensure array structures exist
  if (!player.skillLevels) player.skillLevels = { int: [0, 0, 0, 0, 0] };
  if (!player.experiencePoints) player.experiencePoints = { int: [0, 0, 0, 0, 0] };

  if (!Array.isArray(player.skillLevels.int)) {
    player.skillLevels.int = [Number(player.skillLevels.int) || 0, 0, 0, 0, 0];
  }
  if (!Array.isArray(player.experiencePoints.int)) {
    player.experiencePoints.int = [Number(player.experiencePoints.int) || 0, 0, 0, 0, 0];
  }

  // Skill index order in Stardew Valley:
  // 0: Farming, 1: Fishing, 2: Foraging, 3: Mining, 4: Combat
  player.skillLevels.int[0] = save.player.skills.farming.level;
  player.skillLevels.int[1] = save.player.skills.fishing.level;
  player.skillLevels.int[2] = save.player.skills.foraging.level;
  player.skillLevels.int[3] = save.player.skills.mining.level;
  player.skillLevels.int[4] = save.player.skills.combat.level;

  player.experiencePoints.int[0] = save.player.skills.farming.experience;
  player.experiencePoints.int[1] = save.player.skills.fishing.experience;
  player.experiencePoints.int[2] = save.player.skills.foraging.experience;
  player.experiencePoints.int[3] = save.player.skills.mining.experience;
  player.experiencePoints.int[4] = save.player.skills.combat.experience;

  // 3. Sync Inventory
  syncInventory(player, save.player.inventory);

  // 4. Sync Relationships
  syncRelationships(player, save.relationships);

  // 5. Sync World
  saveGame.dayOfMonth = Math.max(1, Math.min(28, Math.floor(save.world.dayOfMonth)));
  saveGame.currentSeason = save.world.currentSeason;
  saveGame.year = Math.max(1, Math.floor(save.world.year));
  saveGame.dailyLuck = save.world.dailyLuck;

  // 6. Build XML with standard XML declaration
  const xmlBody = xmlBuilder.build(rawCopy);
  const declaration = '<?xml version="1.0" encoding="utf-8"?>\n';
  
  if (xmlBody.startsWith('<?xml')) {
    return xmlBody;
  }
  return declaration + xmlBody;
}

function syncInventory(playerNode: any, domainItems: InventoryItem[]) {
  if (!playerNode.items) {
    playerNode.items = { Item: [] };
  }

  // Get current item array representation
  const existingItems = Array.isArray(playerNode.items.Item) 
    ? playerNode.items.Item 
    : (playerNode.items.Item ? [playerNode.items.Item] : []);

  // Update or construct Item nodes
  const updatedItems = domainItems.map((domainItem, index) => {
    // If existing item exists at slotIndex, update it preserving other tags
    const existing = existingItems[domainItem.slotIndex] || existingItems[index];
    if (existing && typeof existing === 'object') {
      const cloned = { ...existing };
      cloned.name = domainItem.name;
      cloned.Stack = domainItem.stack;
      cloned.stack = domainItem.stack;
      cloned.quality = domainItem.quality;
      cloned.Quality = domainItem.quality;
      if (domainItem.itemId) {
        cloned.ItemId = domainItem.itemId;
        cloned.itemId = domainItem.itemId;
        cloned.parentSheetIndex = domainItem.itemId;
      }
      return cloned;
    }

    // Construct fresh item node if new
    return {
      '@_xsi:type': domainItem.type || 'Object',
      name: domainItem.name,
      itemId: domainItem.itemId,
      ItemId: domainItem.itemId,
      parentSheetIndex: domainItem.itemId,
      stack: domainItem.stack,
      Stack: domainItem.stack,
      quality: domainItem.quality,
      Quality: domainItem.quality,
    };
  });

  playerNode.items = { Item: updatedItems };
}

function syncRelationships(playerNode: any, relationships: StardewSave['relationships']) {
  if (!relationships || relationships.length === 0) return;

  if (!playerNode.friendshipData) {
    playerNode.friendshipData = { item: [] };
  }

  const existingItems = Array.isArray(playerNode.friendshipData.item)
    ? playerNode.friendshipData.item
    : (playerNode.friendshipData.item ? [playerNode.friendshipData.item] : []);

  const relationshipMap = new Map(relationships.map(r => [r.npcName, r]));

  // Update existing friendship items
  existingItems.forEach((entry: any) => {
    const key = entry?.key?.string || entry?.key;
    if (key && relationshipMap.has(key)) {
      const rel = relationshipMap.get(key)!;
      if (!entry.value) entry.value = { Friendship: {} };
      if (!entry.value.Friendship) entry.value.Friendship = {};
      
      entry.value.Friendship.Points = rel.points;
      entry.value.Friendship.points = rel.points;
      if (rel.status) {
        entry.value.Friendship.Status = rel.status;
        entry.value.Friendship.status = rel.status;
      }
      if (rel.giftsThisWeek !== undefined) {
        entry.value.Friendship.GiftsThisWeek = rel.giftsThisWeek;
      }
      relationshipMap.delete(key);
    }
  });

  // Add any new relationships that weren't in existingItems
  relationshipMap.forEach((rel) => {
    existingItems.push({
      key: { string: rel.npcName },
      value: {
        Friendship: {
          Points: rel.points,
          GiftsThisWeek: rel.giftsThisWeek || 0,
          GiftsToday: 0,
          TalkedToToday: rel.talkedToToday ? 'true' : 'false',
          Status: rel.status,
          Proposer: 0,
          RoommateMarriage: 'false',
        }
      }
    });
  });

  playerNode.friendshipData = { item: existingItems };
}
