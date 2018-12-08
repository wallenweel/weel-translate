import translationSources from './sources';

export default {
  'translation-recent': [],
  'translation-picked': [],
  'translation-sources': translationSources,
} as TranslationData;

export const prefixer = (name: string): string => `translation-${name}`;
