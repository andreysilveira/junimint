import { SkillType, SkillData } from '../save/types';

// Stardew Valley XP Thresholds (Level 0 through 10)
export const SKILL_XP_THRESHOLDS = [
  0,      // Level 0
  100,    // Level 1
  380,    // Level 2
  770,    // Level 3
  1300,   // Level 4
  2150,   // Level 5
  3300,   // Level 6
  4800,   // Level 7
  6900,   // Level 8
  10000,  // Level 9
  15000,  // Level 10
];

export const SKILL_NAMES: Record<SkillType, string> = {
  farming: 'Farming',
  mining: 'Mining',
  foraging: 'Foraging',
  fishing: 'Fishing',
  combat: 'Combat',
};

export function getLevelFromExp(exp: number): number {
  if (exp < 0) return 0;
  for (let lvl = 10; lvl >= 0; lvl--) {
    if (exp >= SKILL_XP_THRESHOLDS[lvl]) {
      return lvl;
    }
  }
  return 0;
}

export function getMinExpForLevel(level: number): number {
  const bounded = Math.max(0, Math.min(10, Math.floor(level)));
  return SKILL_XP_THRESHOLDS[bounded];
}

export function getNextLevelExp(level: number): number {
  if (level >= 10) return 15000;
  return SKILL_XP_THRESHOLDS[Math.min(10, level + 1)];
}

export function calculateSkillProgress(exp: number, level: number): number {
  if (level >= 10) return 100;
  const currentLevelExp = getMinExpForLevel(level);
  const nextLevelExp = getNextLevelExp(level);
  const range = nextLevelExp - currentLevelExp;
  if (range <= 0) return 100;
  const progressInLevel = Math.max(0, exp - currentLevelExp);
  return Math.min(100, Math.round((progressInLevel / range) * 100));
}

export function createSkillData(type: SkillType, level: number, exp: number): SkillData {
  const boundedLevel = Math.max(0, Math.min(10, level));
  const validExp = Math.max(0, exp);
  const nextExp = getNextLevelExp(boundedLevel);
  const progress = calculateSkillProgress(validExp, boundedLevel);

  return {
    name: SKILL_NAMES[type],
    type,
    level: boundedLevel,
    experience: validExp,
    nextLevelExp: nextExp,
    progressPercent: progress,
  };
}
