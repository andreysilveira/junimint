import { Relationship, RelationshipStatus } from '../save/types';

export interface NPCMetadata {
  name: string;
  isDatable: boolean;
  birthday: { season: string; day: number };
  maxHearts: number;
}

export const KNOWN_NPCS: Record<string, NPCMetadata> = {
  // Bachelors & Bachelorettes (Datable)
  'Abigail': { name: 'Abigail', isDatable: true, birthday: { season: 'fall', day: 13 }, maxHearts: 10 },
  'Alex': { name: 'Alex', isDatable: true, birthday: { season: 'summer', day: 13 }, maxHearts: 10 },
  'Elliott': { name: 'Elliott', isDatable: true, birthday: { season: 'fall', day: 5 }, maxHearts: 10 },
  'Emily': { name: 'Emily', isDatable: true, birthday: { season: 'spring', day: 27 }, maxHearts: 10 },
  'Haley': { name: 'Haley', isDatable: true, birthday: { season: 'spring', day: 14 }, maxHearts: 10 },
  'Harvey': { name: 'Harvey', isDatable: true, birthday: { season: 'winter', day: 14 }, maxHearts: 10 },
  'Leah': { name: 'Leah', isDatable: true, birthday: { season: 'winter', day: 23 }, maxHearts: 10 },
  'Maru': { name: 'Maru', isDatable: true, birthday: { season: 'summer', day: 10 }, maxHearts: 10 },
  'Penny': { name: 'Penny', isDatable: true, birthday: { season: 'fall', day: 2 }, maxHearts: 10 },
  'Sam': { name: 'Sam', isDatable: true, birthday: { season: 'summer', day: 17 }, maxHearts: 10 },
  'Sebastian': { name: 'Sebastian', isDatable: true, birthday: { season: 'winter', day: 10 }, maxHearts: 10 },
  'Shane': { name: 'Shane', isDatable: true, birthday: { season: 'spring', day: 20 }, maxHearts: 10 },

  // Non-datable Villagers
  'Caroline': { name: 'Caroline', isDatable: false, birthday: { season: 'winter', day: 7 }, maxHearts: 10 },
  'Clint': { name: 'Clint', isDatable: false, birthday: { season: 'winter', day: 26 }, maxHearts: 10 },
  'Demetrius': { name: 'Demetrius', isDatable: false, birthday: { season: 'summer', day: 19 }, maxHearts: 10 },
  'Evelyn': { name: 'Evelyn', isDatable: false, birthday: { season: 'winter', day: 20 }, maxHearts: 10 },
  'George': { name: 'George', isDatable: false, birthday: { season: 'fall', day: 24 }, maxHearts: 10 },
  'Gus': { name: 'Gus', isDatable: false, birthday: { season: 'summer', day: 8 }, maxHearts: 10 },
  'Jas': { name: 'Jas', isDatable: false, birthday: { season: 'summer', day: 4 }, maxHearts: 10 },
  'Jodi': { name: 'Jodi', isDatable: false, birthday: { season: 'fall', day: 11 }, maxHearts: 10 },
  'Kent': { name: 'Kent', isDatable: false, birthday: { season: 'spring', day: 4 }, maxHearts: 10 },
  'Krobus': { name: 'Krobus', isDatable: false, birthday: { season: 'winter', day: 1 }, maxHearts: 10 },
  'Leo': { name: 'Leo', isDatable: false, birthday: { season: 'summer', day: 26 }, maxHearts: 10 },
  'Lewis': { name: 'Lewis', isDatable: false, birthday: { season: 'spring', day: 7 }, maxHearts: 10 },
  'Linus': { name: 'Linus', isDatable: false, birthday: { season: 'winter', day: 3 }, maxHearts: 10 },
  'Marnie': { name: 'Marnie', isDatable: false, birthday: { season: 'fall', day: 18 }, maxHearts: 10 },
  'Pam': { name: 'Pam', isDatable: false, birthday: { season: 'spring', day: 18 }, maxHearts: 10 },
  'Pierre': { name: 'Pierre', isDatable: false, birthday: { season: 'spring', day: 26 }, maxHearts: 10 },
  'Robin': { name: 'Robin', isDatable: false, birthday: { season: 'fall', day: 21 }, maxHearts: 10 },
  'Sandy': { name: 'Sandy', isDatable: false, birthday: { season: 'fall', day: 15 }, maxHearts: 10 },
  'Vincent': { name: 'Vincent', isDatable: false, birthday: { season: 'spring', day: 10 }, maxHearts: 10 },
  'Willy': { name: 'Willy', isDatable: false, birthday: { season: 'summer', day: 24 }, maxHearts: 10 },
  'Wizard': { name: 'Wizard', isDatable: false, birthday: { season: 'winter', day: 17 }, maxHearts: 10 },
};

export function calculateHearts(points: number): number {
  return Math.max(0, Math.floor(points / 250));
}

export function calculatePointsFromHearts(hearts: number): number {
  return Math.max(0, Math.min(14, hearts)) * 250;
}

export function buildRelationship(
  npcName: string,
  points: number,
  statusStr: string,
  giftsThisWeek: number,
  talkedToday: boolean
): Relationship {
  const meta: NPCMetadata = KNOWN_NPCS[npcName] || {
    name: npcName,
    isDatable: false,
    birthday: { season: 'spring', day: 1 },
    maxHearts: 10,
  };

  let status: RelationshipStatus = 'Friendly';
  if (statusStr === 'Married' || statusStr === 'FriendlyMarried') status = 'Married';
  else if (statusStr === 'Dating') status = 'Dating';
  else if (statusStr === 'Engaged') status = 'Engaged';
  else if (statusStr === 'Divorced') status = 'Divorced';

  const maxHearts = status === 'Married' ? 14 : (meta.isDatable && status !== 'Dating' ? 8 : meta.maxHearts);
  const hearts = Math.min(maxHearts, calculateHearts(points));

  return {
    npcName,
    displayName: meta.name || npcName,
    points,
    hearts,
    maxHearts,
    status,
    isDatable: meta.isDatable,
    giftsThisWeek,
    talkedToToday: talkedToday,
    birthday: meta.birthday,
  };
}
