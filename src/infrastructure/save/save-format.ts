import { StardewSave } from '@/src/domain/save/types';

export interface FeatureSupportStatus {
  feature: string;
  status: 'supported' | 'partial' | 'experimental';
  notes: string;
}

export interface CompatibilityReport {
  version: string;
  isMultiplayer: boolean;
  platformHint: string;
  overallStatus: 'supported' | 'partial' | 'unsupported';
  features: FeatureSupportStatus[];
}

export function analyzeSaveCompatibility(save: StardewSave): CompatibilityReport {
  const version = save.metadata.gameVersion || '1.6';
  const isMultiplayer = save.metadata.isMultiplayer;

  const features: FeatureSupportStatus[] = [
    {
      feature: 'Player Identity & Stats',
      status: 'supported',
      notes: 'Character name, farm name, money, health, and stamina can be safely modified.',
    },
    {
      feature: 'Mastery & Skills',
      status: 'supported',
      notes: 'All 5 skills, level thresholds (0-10), and XP values are verified and synced.',
    },
    {
      feature: 'Backpack Inventory',
      status: 'supported',
      notes: 'Stack counts, quality ratings (Normal, Silver, Gold, Iridium), and item additions/removals.',
    },
    {
      feature: 'Social & NPC Friendships',
      status: 'supported',
      notes: 'Heart levels (0-14), friendship points, dating and marriage statuses are preserved and editable.',
    },
    {
      feature: 'World Calendar & Environment',
      status: 'supported',
      notes: 'Day (1-28), 4 seasons, year counter, and daily luck parameters.',
    },
    {
      feature: 'Farm Layout & Debris Cleanup',
      status: 'supported',
      notes: 'Interactive 2D farm viewer with real coordinates, crop status, and one-click debris clearance.',
    },
    {
      feature: 'Collections & Quests',
      status: 'partial',
      notes: 'View museum/fish/artifact counts and active quests safely.',
    },
  ];

  return {
    version,
    isMultiplayer,
    platformHint: 'PC / Mac / Linux / Mobile Stardew Valley save file',
    overallStatus: 'supported',
    features,
  };
}
