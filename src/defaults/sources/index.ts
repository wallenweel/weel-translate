import { sourcePresetsStringifier } from '@/functions';
import google from './google';
import google_cn from './google_cn';

export const sourcePresets: SourcePreset[] = [
  google,
  google_cn,
];

export const stringifySourcePresets: jsonString[] = sourcePresets
.map((preset) => JSON.stringify(preset));

export default stringifySourcePresets;
