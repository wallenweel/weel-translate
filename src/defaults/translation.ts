import stringifySourcePresets, { sourcePresets } from './sources';

const enabledSources: SourcePresetItem[] = sourcePresets
  .map(({ id, name, fromto, modify }) => ({ id, name, fromto, modify }));

const translationConfig: TranslationConfig = {
  translation_recent: [],
  translation_picked: [],
  translation_current_source: enabledSources[0],
  translation_enabled_sources: enabledSources,
  translation_sources: stringifySourcePresets,
};

export const prefixer = (name: string): string => `translation_${name}`;

export default translationConfig;
