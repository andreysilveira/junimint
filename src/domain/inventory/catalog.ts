// Stardew Valley Known Items Catalog & Helpers

export interface CatalogItem {
  id: string;
  name: string;
  category: 'Crops & Forage' | 'Minerals & Gems' | 'Artisan & Animal' | 'Resources & Materials' | 'Tools & Weapons' | 'Fish & Bait' | 'Cooked Dishes' | 'Seeds & Saplings' | 'Special & Iridium';
  defaultStack?: number;
  maxStack?: number;
}

export const KNOWN_ITEMS_CATALOG: CatalogItem[] = [
  // Special & Iridium
  { id: '337', name: 'Iridium Bar', category: 'Special & Iridium', maxStack: 999 },
  { id: '386', name: 'Iridium Ore', category: 'Special & Iridium', maxStack: 999 },
  { id: '74', name: 'Prismatic Shard', category: 'Special & Iridium', maxStack: 999 },
  { id: '434', name: 'Stardrop', category: 'Special & Iridium', maxStack: 1 },
  { id: '896', name: 'Galaxy Soul', category: 'Special & Iridium', maxStack: 99 },
  { id: '787', name: 'Battery Pack', category: 'Special & Iridium', maxStack: 999 },
  { id: '417', name: 'Sweet Gem Berry', category: 'Special & Iridium', maxStack: 999 },

  // Resources
  { id: '388', name: 'Wood', category: 'Resources & Materials', maxStack: 999 },
  { id: '709', name: 'Hardwood', category: 'Resources & Materials', maxStack: 999 },
  { id: '390', name: 'Stone', category: 'Resources & Materials', maxStack: 999 },
  { id: '382', name: 'Coal', category: 'Resources & Materials', maxStack: 999 },
  { id: '334', name: 'Copper Bar', category: 'Resources & Materials', maxStack: 999 },
  { id: '335', name: 'Iron Bar', category: 'Resources & Materials', maxStack: 999 },
  { id: '336', name: 'Gold Bar', category: 'Resources & Materials', maxStack: 999 },
  { id: '338', name: 'Refined Quartz', category: 'Resources & Materials', maxStack: 999 },
  { id: '378', name: 'Copper Ore', category: 'Resources & Materials', maxStack: 999 },
  { id: '380', name: 'Iron Ore', category: 'Resources & Materials', maxStack: 999 },
  { id: '384', name: 'Gold Ore', category: 'Resources & Materials', maxStack: 999 },
  { id: '771', name: 'Fiber', category: 'Resources & Materials', maxStack: 999 },
  { id: '766', name: 'Slime', category: 'Resources & Materials', maxStack: 999 },
  { id: '767', name: 'Bat Wing', category: 'Resources & Materials', maxStack: 999 },
  { id: '768', name: 'Solar Essence', category: 'Resources & Materials', maxStack: 999 },
  { id: '769', name: 'Void Essence', category: 'Resources & Materials', maxStack: 999 },

  // Crops & Forage
  { id: '24', name: 'Parsnip', category: 'Crops & Forage', maxStack: 999 },
  { id: '188', name: 'Green Bean', category: 'Crops & Forage', maxStack: 999 },
  { id: '190', name: 'Cauliflower', category: 'Crops & Forage', maxStack: 999 },
  { id: '192', name: 'Potato', category: 'Crops & Forage', maxStack: 999 },
  { id: '248', name: 'Garlic', category: 'Crops & Forage', maxStack: 999 },
  { id: '250', name: 'Kale', category: 'Crops & Forage', maxStack: 999 },
  { id: '252', name: 'Rhubarb', category: 'Crops & Forage', maxStack: 999 },
  { id: '254', name: 'Melon', category: 'Crops & Forage', maxStack: 999 },
  { id: '256', name: 'Tomato', category: 'Crops & Forage', maxStack: 999 },
  { id: '258', name: 'Blueberry', category: 'Crops & Forage', maxStack: 999 },
  { id: '260', name: 'Hot Pepper', category: 'Crops & Forage', maxStack: 999 },
  { id: '262', name: 'Wheat', category: 'Crops & Forage', maxStack: 999 },
  { id: '264', name: 'Radish', category: 'Crops & Forage', maxStack: 999 },
  { id: '266', name: 'Red Cabbage', category: 'Crops & Forage', maxStack: 999 },
  { id: '268', name: 'Starfruit', category: 'Crops & Forage', maxStack: 999 },
  { id: '270', name: 'Corn', category: 'Crops & Forage', maxStack: 999 },
  { id: '272', name: 'Eggplant', category: 'Crops & Forage', maxStack: 999 },
  { id: '274', name: 'Artichoke', category: 'Crops & Forage', maxStack: 999 },
  { id: '276', name: 'Pumpkin', category: 'Crops & Forage', maxStack: 999 },
  { id: '278', name: 'Bok Choy', category: 'Crops & Forage', maxStack: 999 },
  { id: '280', name: 'Yam', category: 'Crops & Forage', maxStack: 999 },
  { id: '282', name: 'Cranberries', category: 'Crops & Forage', maxStack: 999 },
  { id: '284', name: 'Beet', category: 'Crops & Forage', maxStack: 999 },
  { id: '400', name: 'Strawberry', category: 'Crops & Forage', maxStack: 999 },
  { id: '454', name: 'Ancient Fruit', category: 'Crops & Forage', maxStack: 999 },

  // Minerals & Gems
  { id: '60', name: 'Emerald', category: 'Minerals & Gems', maxStack: 999 },
  { id: '62', name: 'Aquamarine', category: 'Minerals & Gems', maxStack: 999 },
  { id: '64', name: 'Ruby', category: 'Minerals & Gems', maxStack: 999 },
  { id: '66', name: 'Amethyst', category: 'Minerals & Gems', maxStack: 999 },
  { id: '68', name: 'Topaz', category: 'Minerals & Gems', maxStack: 999 },
  { id: '70', name: 'Jade', category: 'Minerals & Gems', maxStack: 999 },
  { id: '72', name: 'Diamond', category: 'Minerals & Gems', maxStack: 999 },

  // Artisan & Animal
  { id: '176', name: 'Egg', category: 'Artisan & Animal', maxStack: 999 },
  { id: '184', name: 'Milk', category: 'Artisan & Animal', maxStack: 999 },
  { id: '424', name: 'Cheese', category: 'Artisan & Animal', maxStack: 999 },
  { id: '426', name: 'Goat Cheese', category: 'Artisan & Animal', maxStack: 999 },
  { id: '428', name: 'Cloth', category: 'Artisan & Animal', maxStack: 999 },
  { id: '430', name: 'Truffle', category: 'Artisan & Animal', maxStack: 999 },
  { id: '432', name: 'Truffle Oil', category: 'Artisan & Animal', maxStack: 999 },
  { id: '303', name: 'Pale Ale', category: 'Artisan & Animal', maxStack: 999 },
  { id: '346', name: 'Beer', category: 'Artisan & Animal', maxStack: 999 },
  { id: '348', name: 'Wine', category: 'Artisan & Animal', maxStack: 999 },
  { id: '459', name: 'Mead', category: 'Artisan & Animal', maxStack: 999 },
  { id: '440', name: 'Wool', category: 'Artisan & Animal', maxStack: 999 },
  { id: '442', name: 'Duck Egg', category: 'Artisan & Animal', maxStack: 999 },
  { id: '444', name: 'Duck Feather', category: 'Artisan & Animal', maxStack: 999 },
  { id: '446', name: 'Rabbit\'s Foot', category: 'Artisan & Animal', maxStack: 999 },

  // Tools & Weapons
  { id: 'GalaxySword', name: 'Galaxy Sword', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'GalaxyHammer', name: 'Galaxy Hammer', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'InfinityBlade', name: 'Infinity Blade', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'IridiumPickaxe', name: 'Iridium Pickaxe', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'IridiumAxe', name: 'Iridium Axe', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'IridiumHoe', name: 'Iridium Hoe', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'IridiumWateringCan', name: 'Iridium Watering Can', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'IridiumRod', name: 'Iridium Rod', category: 'Tools & Weapons', maxStack: 1 },
  { id: 'ReturnScepter', name: 'Return Scepter', category: 'Tools & Weapons', maxStack: 1 },

  // Fish
  { id: '159', name: 'Crimsonfish', category: 'Fish & Bait', maxStack: 999 },
  { id: '160', name: 'Angler', category: 'Fish & Bait', maxStack: 999 },
  { id: '163', name: 'Legend', category: 'Fish & Bait', maxStack: 999 },
  { id: '682', name: 'Mutant Carp', category: 'Fish & Bait', maxStack: 999 },
  { id: '775', name: 'Glacierfish', category: 'Fish & Bait', maxStack: 999 },
  { id: '128', name: 'Pufferfish', category: 'Fish & Bait', maxStack: 999 },
  { id: '158', name: 'Stonefish', category: 'Fish & Bait', maxStack: 999 },
  { id: '161', name: 'Ice Pip', category: 'Fish & Bait', maxStack: 999 },
  { id: '162', name: 'Lava Eel', category: 'Fish & Bait', maxStack: 999 },

  // Cooked Dishes
  { id: '194', name: 'Fried Egg', category: 'Cooked Dishes', maxStack: 999 },
  { id: '195', name: 'Omelet', category: 'Cooked Dishes', maxStack: 999 },
  { id: '196', name: 'Salad', category: 'Cooked Dishes', maxStack: 999 },
  { id: '197', name: 'Cheese Cauliflower', category: 'Cooked Dishes', maxStack: 999 },
  { id: '206', name: 'Pizza', category: 'Cooked Dishes', maxStack: 999 },
  { id: '220', name: 'Chocolate Cake', category: 'Cooked Dishes', maxStack: 999 },
  { id: '242', name: 'Dish O\' The Sea', category: 'Cooked Dishes', maxStack: 999 },
  { id: '608', name: 'Pumpkin Pie', category: 'Cooked Dishes', maxStack: 999 },
  { id: '732', name: 'Crab Cakes', category: 'Cooked Dishes', maxStack: 999 },

  // Seeds
  { id: '472', name: 'Parsnip Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '474', name: 'Cauliflower Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '476', name: 'Potato Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '479', name: 'Melon Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '481', name: 'Blueberry Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '486', name: 'Starfruit Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '490', name: 'Pumpkin Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '499', name: 'Ancient Seeds', category: 'Seeds & Saplings', maxStack: 999 },
  { id: '347', name: 'Rare Seed', category: 'Seeds & Saplings', maxStack: 999 },
];

export const QUALITY_NAMES: Record<number, string> = {
  0: 'Normal',
  1: 'Silver',
  2: 'Gold',
  4: 'Iridium',
};

export function inferCategory(name: string, itemId: string): string {
  const match = KNOWN_ITEMS_CATALOG.find(i => i.id === itemId || i.name.toLowerCase() === name.toLowerCase());
  if (match) return match.category;
  if (name.toLowerCase().includes('bar') || name.toLowerCase().includes('ore')) return 'Resources & Materials';
  if (name.toLowerCase().includes('sword') || name.toLowerCase().includes('axe') || name.toLowerCase().includes('pickaxe')) return 'Tools & Weapons';
  if (name.toLowerCase().includes('seed')) return 'Seeds & Saplings';
  if (name.toLowerCase().includes('wine') || name.toLowerCase().includes('juice') || name.toLowerCase().includes('cheese')) return 'Artisan & Animal';
  return 'General';
}
