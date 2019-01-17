import { presetIdReg } from '@/variables';

export const formatter: FormatFn = (preset, spacing = 2) => {
  let out = preset;

  try {
    if (typeof preset === 'string') {
      out = JSON.parse(out);
    }
    return [null, JSON.stringify(out, null, spacing)];
  } catch (error) {
    return [error, out];
  }
};

export const checker: CheckFn = (preset) => {
  let error: string | null;
  let out: JSON | undefined;

  try {
    error = null;
    out = JSON.parse(preset, (key, value) => {
      if (key === 'id' && !presetIdReg.test(key)) {
        error = `id "${key}" is not vaild`;
      }
    });
  } catch (err) {
    error = err;
  }

  return [error, out];
};

declare type FormatFn = (preset: any, spacing?: number) => std<jsonString>;
declare type CheckFn = (preset: jsonString) => std<JSON>;
