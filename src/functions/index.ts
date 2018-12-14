import * as types from '../types';
import debug from './debug';

export let istype: IsType;
istype = (target, type) => Object.prototype.toString.call(target)
  .match(/\[object\s(.+)\]/)![1].toLowerCase() === type;

export const plainCopy = (target: any): std<any> => {
  try {
    const copy = JSON.parse(JSON.stringify(target));
    return [null, copy];
  } catch (error) {
    return [new Error(error)];
  }
};

// parse params string to params object
// such as: 'host?a&b=b&c=c' => { a: true, b: 'b', c: 'c' }
export let stringParamsParaser: StringParamsParser;
stringParamsParaser = (target) => {
  if (istype(target, 'string')) {
    const [host, paramsString] = target.split('?');

    if (!paramsString) {
      return ['has not valid params string', host];
    }

    const params: { [name: string]: any } = paramsString
      .split('&').reduce((p: { [k: string]: any }, c: string) => !!((o) =>
        Object.assign(p, { [o[0]]: o[1] || true }))(c.split('=')) && p, {});

    return [null, params, host];
  }

  let s: string = '';
  for (const [k, v] of Object.entries(target)) {
    if (istype(v, 'array')) {
      for (const e of v) {
        s += `${k}=${e}&`;
        continue;
      }
    }
    s += `${k}=${v}&`;
  }
  return [null, s];
};

export const searchParamsParser = (): std<URLSearchParams> => {
  return [null];
};

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

export let presetsParser: PresetsParseFn;
presetsParser = (presets) => {
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

export let presetsStringifier: PresetsStringifyFn;
presetsStringifier = (presets) => {
  try {
    const result = presets.map((preset) => JSON.stringify(preset));
    return [null, result];
  } catch (error) {
    return [new Error(`translation sources's presets stringify failed`), error];
  }
};

export let translationResultParser: TranslationResultParseFn;
translationResultParser = (response, preset) => {
  return [null];
};

export let templateLayoutParser: TemplateLayoutParseFn;
templateLayoutParser = (result, preset, copy = true) => {
  const rows = copy ? [...preset] : preset;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    rows[i] = row.map((e: string) =>
      e.replace(/{(.+)}/, (_, $1) => result[$1] as string));
  }

  return [null, rows, rows];
};
