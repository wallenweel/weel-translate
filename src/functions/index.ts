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
    return [`last version is not existed`, types.VERSION_FRESH, -1];
  }

  const intArr = (s: version): number[] =>
    s.split(/\./).map((n: string) => parseInt(n, 10));

  const [c, l] = [intArr(current), intArr(last)];

  const incompatibleLevel = (idx: number, c: number[], l: number[]): number => {
    // (1).2.1 & (3).1.1 => must be incompatible
    if (idx === 0 && c[0] !== l[0]) { return 1; }

    const [cv, lv] = [c[1], l[1]];

    // 3.(11).2 & 3.(10).2 => maybe incompatible
    if (cv >= 10 && lv >= 10) {
      const [c, l] = [`${cv}`.replace(/\d$/, ''), `${lv}`.replace(/\d$/, '')];
      if (Math.abs(parseInt(c, 10) - parseInt(l, 10)) > 0) {
        return 0;
      }
    }

    return -1; // compatible
  };

  for (let i = 0; i < c.length; i++) {
    if (c[i] > l[i]) { // [current].0.0 > [last].0.0
      return [null, types.VERSION_UPDATED, incompatibleLevel(i, c, l)];
    }

    if (c[i] < l[i]) { // [current].0.0 < [last].0.0
      return [null, types.VERSION_OUTDATED, incompatibleLevel(i, c, l)];
    }
  }

  return [null, types.VERSION_SAME, -1];
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
presetParamsParser = (target, requestParams, stringify = false) => {
  if (!istype(target, ['object', 'array', 'string'])) {
    return [`check target params type: ${target}`];
  }

  // object: {q: 'test'} -> {"q": "{q}"} => {"q": "test"}
  // array: {q: 'test'} -> [["q": "{q}"]] => [["q": "test"]]
  // string: {q: 'test'} -> 'q={q}&...' => "q=test&...""
  const params = JSON.parse(JSON.stringify(target)
    .replace(/{\b(.+?)\b}/g, (_, $) => requestParams[$] || _));

  let out: URLSearchParams;

  if (istype(params, 'object')) {
    out = new URLSearchParams(stringParamsParaser(params)[1] as string);
  }

  if (istype(params, 'array')) {
    out = new URLSearchParams(params as string[][]);
  }

  // no url host, just 'q=q&...' or '?q=q&...'
  if (istype(params, 'string')) {
    out = new URLSearchParams(params as string);
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
translationResultParser = (response, parserPreset, stringify = true) => {
  const entries = Object.entries(parserPreset!);

  const result: { [n: string]: any } = {};

  for (const [name, selector] of entries) {
    const reducer = parserPathReducer((selector as string), response, stringify);
    result[name] = reducer[1];
  }

  return [null, result];
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

export let configKeysReducer: ConfigKeysReduceFn;
configKeysReducer = (keys, config) => {
  const out: { [k: string]: any } = {};

  if (istype(keys, 'string')) {
    const k = keys as string;
    out[k] = config[k];
  }
  if (istype(keys, 'array')) {
    for (const k of keys as string[]) {
      out[k] = config[k];
    }
  }
  if (istype(keys, 'object')) {
    for (const k of Object.keys(keys as string[])) {
      out[k] = config[k];
    }
  }

  return [null, out];
};

export let presetLanguagesModifier: PresetLanguagesModifyFn;
presetLanguagesModifier = (languages, rules = []) => {
  if (!rules.length) { return ['no any rules']; }

  const out: Language[] = [];

  for (const lang of languages) {
    let { code, name, locale } = lang;

    for (const rule of rules) {
      // ['auto:>AUTO', ...]
      if (istype(rule, 'string')) {
        const [origin, target] = (rule as string).split(':>');

        if (!origin || !target) { continue; }

        if (code === origin) {
          code = target; name = name; locale = locale;
        }
        continue;
      }

      if (istype(rule, 'array')) {
        const [origin, target] = rule;

        // [['auto', 'AUTO'], ...]
        if (istype(origin, 'string') && istype(target, 'string')) {
          if (!origin || !target) { continue; }

          if (code === origin) {
            code = (target as string); name = name; locale = locale;
          }
          continue;
        }

        // [[{ code: 'auto', ... }, { code: 'AUTO', ... }], ...]
        if (istype(origin, 'object'), istype(target, 'object')) {
          if (code === (origin as Language).code) {
            const { code: tc, name: tn, locale: tl } = (target as Language);
            code = tc || code;
            name = tn || name;
            locale = tl || locale;
          }
        }
      }
    }

    out.push({ code, name, locale });
  }

  return [null, out];
};
