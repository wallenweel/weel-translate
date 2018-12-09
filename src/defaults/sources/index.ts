import google from './google';
import google_cn from './google_cn';

export const sourcePresets: TranslationSourcePreset[] = [
  google,
  google_cn,
];

export const sourcePresetsStringify: jsonString[] = sourcePresets
.map((preset) => JSON.stringify(preset));

export default sourcePresetsStringify;
