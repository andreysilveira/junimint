import { StardewSave, SaveValidationResult, SaveValidationIssue } from '@/src/domain/save/types';
import { SKILL_XP_THRESHOLDS } from '@/src/domain/player/skills';

export function validateSave(save: StardewSave): SaveValidationResult {
  const issues: SaveValidationIssue[] = [];

  // Helper to add issue
  const addIssue = (
    severity: 'info' | 'warning' | 'error' | 'critical',
    category: SaveValidationIssue['category'],
    title: string,
    message: string,
    field?: string,
    suggestion?: string
  ) => {
    issues.push({
      id: `${category}-${field || 'general'}-${issues.length}`,
      severity,
      category,
      title,
      message,
      field,
      suggestion,
    });
  };

  // 1. Critical Structure Validations
  if (!save.raw || !save.raw.SaveGame) {
    addIssue('critical', 'structure', 'Missing SaveGame node', 'The root XML element <SaveGame> is missing or corrupt.', 'root');
  }
  if (!save.player) {
    addIssue('critical', 'player', 'Missing Player data', 'No player entity was found in the save file.', 'player');
    return buildResult(issues);
  }

  // 2. Player Identity & Vitals
  if (!save.player.name || save.player.name.trim().length === 0) {
    addIssue('error', 'player', 'Empty Character Name', 'Player name cannot be blank.', 'name', 'Provide a valid character name.');
  }

  if (save.player.money < 0) {
    addIssue('error', 'player', 'Negative Gold', `Gold amount (${save.player.money}) is negative.`, 'money', 'Set gold to 0 or a positive number.');
  }

  if (save.player.maxHealth <= 0) {
    addIssue('error', 'player', 'Invalid Max Health', 'Max health must be greater than 0.', 'maxHealth', 'Set max health to at least 100.');
  }

  if (save.player.maxStamina <= 0) {
    addIssue('error', 'player', 'Invalid Max Stamina', 'Max stamina must be greater than 0.', 'maxStamina', 'Set max stamina to at least 270.');
  }

  if (save.player.health > save.player.maxHealth) {
    addIssue('warning', 'player', 'Health exceeds Max Health', `Current health (${save.player.health}) exceeds max health (${save.player.maxHealth}). This may be clamped by the game.`, 'health');
  }

  if (save.player.stamina > save.player.maxStamina) {
    addIssue('warning', 'player', 'Stamina exceeds Max Stamina', `Current stamina (${Math.round(save.player.stamina)}) exceeds max stamina (${save.player.maxStamina}).`, 'stamina');
  }

  // 3. Skills Validation
  const skillTypes = ['farming', 'mining', 'foraging', 'fishing', 'combat'] as const;
  skillTypes.forEach((type) => {
    const skill = save.player.skills[type];
    if (skill) {
      if (skill.level < 0 || skill.level > 10) {
        addIssue('error', 'skills', `Invalid ${skill.name} Level`, `Level ${skill.level} is out of standard range (0-10).`, `skills.${type}.level`, 'Adjust level to between 0 and 10.');
      }
      if (skill.experience < 0) {
        addIssue('error', 'skills', `Negative ${skill.name} XP`, `Experience points (${skill.experience}) cannot be negative.`, `skills.${type}.experience`, 'Set XP to 0 or more.');
      }

      // Check XP consistency
      const expectedMinExp = SKILL_XP_THRESHOLDS[skill.level] || 0;
      if (skill.experience < expectedMinExp) {
        addIssue('warning', 'skills', `${skill.name} XP Inconsistency`, `Level is ${skill.level} but XP (${skill.experience}) is below the required ${expectedMinExp} XP.`, `skills.${type}`, 'Sync XP with level using the skill editor.');
      }
    }
  });

  // 4. World State Validation
  if (save.world.dayOfMonth < 1 || save.world.dayOfMonth > 28) {
    addIssue('error', 'world', 'Invalid Calendar Day', `Day ${save.world.dayOfMonth} is outside standard month bounds (1-28).`, 'dayOfMonth', 'Select a day between 1 and 28.');
  }

  if (save.world.year < 1) {
    addIssue('error', 'world', 'Invalid Year', `Year ${save.world.year} must be at least 1.`, 'year', 'Set year to 1 or higher.');
  }

  const validSeasons = ['spring', 'summer', 'fall', 'winter'];
  if (!validSeasons.includes(save.world.currentSeason.toLowerCase())) {
    addIssue('error', 'world', 'Invalid Season', `Season '${save.world.currentSeason}' is not recognized.`, 'currentSeason', 'Choose spring, summer, fall, or winter.');
  }

  // 5. Inventory Items Validation
  save.player.inventory.forEach((item, idx) => {
    if (item.stack <= 0) {
      addIssue('warning', 'inventory', `Item "${item.name}" has 0 stack`, 'Items with 0 quantity might be discarded by the game upon loading.', `inventory[${idx}].stack`, 'Increase stack to at least 1.');
    }
    if (item.stack > 999) {
      addIssue('warning', 'inventory', `Item "${item.name}" has unusually large stack`, `Stack size is ${item.stack}. The standard limit is 999.`, `inventory[${idx}].stack`);
    }
    if (![0, 1, 2, 4].includes(item.quality)) {
      addIssue('warning', 'inventory', `Unusual Quality for "${item.name}"`, `Quality ${item.quality} is non-standard. Standard values are 0 (Normal), 1 (Silver), 2 (Gold), 4 (Iridium).`, `inventory[${idx}].quality`);
    }
  });

  // 6. Informational summary
  addIssue('info', 'structure', 'Game Version Detected', `Stardew Valley ${save.metadata.gameVersion || '1.6'} save file structure recognized.`, 'version');
  addIssue('info', 'player', 'Player Identity', `Farmer "${save.player.name}" of "${save.player.farmName}" Farm.`, 'player');

  return buildResult(issues);
}

function buildResult(issues: SaveValidationIssue[]): SaveValidationResult {
  const summary = {
    info: issues.filter(i => i.severity === 'info').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    errors: issues.filter(i => i.severity === 'error').length,
    critical: issues.filter(i => i.severity === 'critical').length,
  };

  const isValid = summary.critical === 0 && summary.errors === 0;
  const canExport = summary.critical === 0;

  return {
    isValid,
    canExport,
    issues,
    summary,
  };
}
