import translationSources, { Sources as TranslationSources } from './sources';

export const prefixer = (name: string): string => `translation-${name}`;

export default {
  'translation-recent': [],
  'translation-picked': [],
  'translation-sources': translationSources,
} as Data;

export interface Data {
  'translation-recent': ListItem[] | [];
  'translation-picked': ListItem[] | [];
  'translation-sources': TranslationSources;
}

interface ListItem {
  id: string;
  title: string;
  description?: string;
}
