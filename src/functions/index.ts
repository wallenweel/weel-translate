import * as types from '../types';
import debug from './debug';

export let versionCheck: VersionCheckFn;
versionCheck = (current, last): std<versionStatus> => {
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

export let sourcePresetsParser: SourcePresetsParseFn;
sourcePresetsParser = (presets) => {
  try {
    const tmp: { [id: string]: SourcePreset } = {};
    const result = presets.map((preset) => {
      const json: SourcePreset = JSON.parse(preset);

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

export let sourcePresetsStringifier: SourcePresetsStringifyFn;
sourcePresetsStringifier = (presets) => {
  try {
    const result = presets.map((preset) => JSON.stringify(preset));
    return [null, result];
  } catch (error) {
    return [new Error(`translation sources's presets stringify failed`), error];
  }
};

export let templateResultParser: TemplateResultParserFn;
templateResultParser = (template, result) => {
  const r: any = template.map((e: parserItem) => {
    if (!e.length) { return e; }

    const a = [];
    for (const k of e) {
      const value = k.replace(/<(.+)>(.+)<(.+)>/,
      ($, a, b, c) => {
        return a + result[b] + c;
      });
      if (value === k) {
        a.push(result[k] || k);
      } else {
        a.push(value);
      }

      // a.push(result[k] || k);
    }

    return a;
  });

  return r;
};
