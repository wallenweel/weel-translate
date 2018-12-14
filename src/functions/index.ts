import * as types from '../types';
import debug from './debug';

export let istype: IsTypeFn;
istype = (target, type) => {
  let types: string[] = [];

  if (typeof type === 'string') {
    types = [type];
  } else {
    types = [...type];
  }

  if (!types.length) { return false; }

  for (const t of types as string[]) {
    const ck = Object.prototype.toString.call(target)
      .match(/\[object\s(.+)\]/)![1].toLowerCase() === t;
    if (ck) { return ck; }
  }

  return false;
};

export const plainCopy = (target: any): std<any> => {
  try {
    const copy = JSON.parse(JSON.stringify(target));
    return [null, copy];
  } catch (error) {
    return [new Error(error)];
  }
};

// export let pathValue

// parse params string to params object
// such as: 'host?a&b=b&c=c' => { a: true, b: 'b', c: 'c' }
export let stringParamsParaser: StringParamsParseFn;
stringParamsParaser = (target) => {
  if (istype(target, 'string')) {
    const [host, paramsString] = (target as string).split('?');

    const params: { [name: string]: any } = (paramsString || host)
      .split('&').reduce((p: { [k: string]: any }, c: string) => !!((o) =>
        Object.assign(p, { [o[0]]: o[1] || true }))(c.split('=')) && p, {});

    return [null, params, host];
  }

  let s: string = '';

  if (istype(target, 'array')) {
    for (const [k, v] of target as string[][]) {
      s += `${k}=${v}&`;
    }
  }

  if (istype(target, 'object')) {
    for (const [k, v] of Object.entries(target)) {
      if (istype(v, 'array')) {
        for (const e of v) {
          s += `${k}=${e}&`;
        }
        continue;
      }
      s += `${k}=${v}&`;
    }
  }

  if (!s.length) {
    return [`target param: ${target} gets nothing.`];
  }

  return [null, s.replace(/&$/, '')];
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

export let presetParamsParser: PresetParamsParseFn;
presetParamsParser = (target, stringify = false) => {
  if (!istype(target, ['object', 'array', 'string'])) {
    return [`check target params type: ${target}`];
  }

  let out: URLSearchParams;

  if (istype(target, 'object')) {
    out = new URLSearchParams(stringParamsParaser(target)[1] as string);
  }

  if (istype(target, 'array')) {
    out = new URLSearchParams(target as string[][]);
  }

  // no url host, just 'q=q&...' or '?q=q&...'
  if (istype(target, 'string')) {
    out = new URLSearchParams(target as string);
  }

  return [null, !stringify ? out! : out!.toString()];
};

export let parserPathSplitter: ParserPathSplitFn;
parserPathSplitter = (path) => {
  const [identifierReg, separatorReg] = [
    new RegExp(/\.\b/),
    new RegExp(/(\/.*?\/|\[.*?\]|{.*?})/),
  ];

  const splitSeparator: string[] = path.split(separatorReg)
  .filter((e: string) => !!e);

  if (!splitSeparator.length) {
    return [`not found any vaild path in "${path}".`];
  }

  const out = [];

  for (const e of splitSeparator) {
    if (identifierReg.test(e)) {
      out.push(e.split(identifierReg).filter((e) => e !== '$') as string[]);
    }
    if (separatorReg.test(e)) {
      out.push(e);
    }
  }

  return [null, out as string[][]];
};

export let parserPathReducer: ParserPathReduceFn;
parserPathReducer = (path, response, stringify = false) => {
  const [error, ap] = parserPathSplitter(path);

  if (error !== null) { return [error]; }

  let out: string[] = [];

  for (let i = 0; i < ap!.length; i++) {
    const point = ap![i];

    if (istype(point, 'array')) { // get value
      out[i] = (point as string[]).reduce((r: any, c: string) => r[c], response);
      continue;
    }

    const last = out![i - 1] as any;

    if (istype(point, 'string')) {
      if (/\/.*\//.test(point as string)) { // just a separator
        out[i] = (point as string).replace(/\/(.+)\//, (_: string, $: string) => $);
      }

      if (istype(last, 'undefined')) { continue; }

      if (/\[.*\]/.test(point as string)) { // aim is array
        out[i - 1] = [...last]
          .join((point as string).replace(/\[(.*)\]/, (_: string, $: string) => $));
      }
      if (/\{.*\}/.test(point as string)) { // aim is object
        out[i - 1] = Object.values(last)
          .join((point as string).replace(/\{(.*)\}/, (_: string, $: string) => $));
      }
    }
  }

  out = out.filter((e) => !!e);

  return [null, !stringify ? out : out.join('')];
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
      e.replace(/{(.+)}/, (_, $1) => result![$1] as string));
  }

  return [null, rows, rows];
};
