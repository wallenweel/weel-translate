import stringifySourcePresets, { sourcePresets } from './sources';

const enabledSources: sourcePresetItem[] = sourcePresets
.map(({ id, name }) => ({ id, name }));

const config: TranslationConfig = {
  translation_recent: [],
  translation_picked: [],
  translation_enabled_sources: enabledSources,
  translation_sources: stringifySourcePresets,
};

export default config;

export const prefixer = (name: string): string => `translation_${name}`;
