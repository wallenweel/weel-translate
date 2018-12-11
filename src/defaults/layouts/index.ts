import { popup, float } from './translation';

export const templatePresets = [
  popup,
  float,
];

export const stringifyTemplatePresets: jsonString[] = templatePresets
  .map((preset) => JSON.stringify(preset));

export default stringifyTemplatePresets;
