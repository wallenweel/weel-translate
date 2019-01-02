import { standard, simple } from './translation';

export const layoutPresets = [
  standard,
  simple,
];

export const stringifyLayoutPresets: presetStringJson[] = layoutPresets
  .map((preset) => JSON.stringify(preset));

export default stringifyLayoutPresets;
