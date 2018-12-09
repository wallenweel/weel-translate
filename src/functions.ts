import * as types from './types';
import { isDebug } from './variables';

type consoleType = 'log' | 'warn' | 'error' | 'info' | 'trace';

export const debug = (() => {
  const tag: string[] = [
    '%c Weel Translate X ',
    'border-radius:4px;background-color:#0074e8;color:white;font-weight: bold;',
  ];

  const cls: { [type: string]: any; } = {};

  for (const m of Object.keys(console)) {
    if (isDebug) {
      cls[m] = console[m as consoleType].bind(window.console, ...tag);
    } else {
      cls[m] = (): void => {/** production mode */};
    }
  }

  return cls;
})();

export let versionCheck: VersionCheckFn;
versionCheck = (current, last) => {
  if (!last) {
    return [`last version is not existed`, types.VERSION_FRESH];
  }

  const intArr = (s: version): number[] =>
    s.split(/\./).map((n: string) => parseInt(n, 10));

  const [c, l] = [intArr(current), intArr(last)];

  for (let i = 0; i < c.length; i++) {
    if (c[i] > l[i]) { // [current].0.0 > [last].0.0
      return [null, types.VERSION_UPDATED];
    }

    if (c[i] < l[i]) { // [current].0.0 < [last].0.0
      return [null, types.VERSION_OUTDATED];
    }
  }

  return [null, types.VERSION_SAME];
};

export let translationSourcesParser: TranslationSourcesParserFn;
translationSourcesParser = (presets) => {
  try {
    const tmp: { [id: string]: TranslationSourcePreset } = {};
    const result = presets.map((preset) => {
      const json: TranslationSourcePreset = JSON.parse(preset);

      tmp[json.id] = json;

      return json;
    });

    for (let i = 0; i < result.length; i++) {
      const preset = result[i];
      const parentId = preset.extends;

      if (!!parentId && tmp[parentId]) {
        result[i] = Object.assign({}, tmp[parentId], preset);
      }
    }

    return [null, result];
  } catch (error) {
    return [new Error(`translation sources's presets parse failed`), error];
  }
};

export let translationSourcesStringify: TranslationSourcesStringifyFn;
translationSourcesStringify = (presets) => {
  try {
    const result = presets.map((preset) => JSON.stringify(preset));
    return [null, result];
  } catch (error) {
    return [new Error(`translation sources's presets stringify failed`), error];
  }
};
