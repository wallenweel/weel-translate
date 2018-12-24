import google from './google';
import google_cn from './google_cn';
// import baidu from './baidu';

export const sourcePresets: SourcePreset[] = [
  google,
  google_cn,
  // baidu,
];

export const stringifySourcePresets: jsonString[] = sourcePresets
.map((preset) => JSON.stringify(preset));

export default stringifySourcePresets;
