export const SUPPORTED_AUDIO_CATEGORIES = [
  'interview',
  'briefing',
  'radio-traffic',
  'surveillance',
  'evidence',
  'training',
  'emergency-call'
] as const;

export type AudioCategory = typeof SUPPORTED_AUDIO_CATEGORIES[number];
