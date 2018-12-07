export default {
  'translation-recent': [],
  'translation-picked': [],
  'translation-sources': [],
} as TranslationData;

export interface TranslationData {
  'translation-recent': ListItem[] | object[] | [];
  'translation-picked': ListItem[] | object[] | [];
  'translation-sources': Source[] | object[] | [];
}

interface Source {
  id: string;
  name: string;
  displayName: string;
}

interface ListItem {
  id: string;
  title: string;
  description?: string;
}
