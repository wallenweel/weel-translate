import { popup, float } from './translation';

export const layoutPresets = [
  popup,
  float,
];

export const stringifyLayoutPresets: jsonString[] = layoutPresets
  .map((preset) => JSON.stringify(preset));

export default stringifyLayoutPresets;
