import * as types from '../types';
import { presetIdJsonReg } from '../variables';
import debug from './debug';

export const istype: IsTypeFn = (target, type) => {
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

export const configRegister: ConfigRegistFn<any, any> = (pairs, order) => {
  const items = Object.entries(pairs);

  return (states) => {
    const s = { ...states };

    return items.reduce((p, c) => {
      const [k, v] = c as [string, string];
      if (order === 'pull' && s.hasOwnProperty(k)) { p[v] = s[k]; }
      if (order === 'push' && s.hasOwnProperty(v)) { p[k] = s[v]; }
      return p;
    }, {} as { [k: string]: any });
  };
};

export const stringParamsParaser: StringParamsParseFn = (target) => {
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

export const versionCheck: VersionCheckFn = (current, last): std<versionStatus> => {
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

export const presetsParser: PresetsParseFn = (presets) => {
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

export const presetsStringifier: PresetsStringifyFn = (presets) => {
  try {
    const result = presets.map((preset) => JSON.stringify(preset));
    return [null, result];
  } catch (error) {
    return [new Error(`translation sources's presets stringify failed`), error];
  }
};

export const paramsParaser: ParamsParseFn<any> = (target, params, parse = true) => {
  let out: string | queryParams;

  out = JSON.stringify(target)
  .replace(/{\b(.+?)\b}/g, (_, $) => params[$] || _)
  .replace(/(\r\n|\r|\n)/g, '\\n') as string;

  if (parse) {
    try {
      out = JSON.parse(out) as queryParams;
    } catch (error) {
      return [new Error(error), out];
    }
  }

  return [null, out];
};

export const presetParamsParser: PresetParamsParseFn = (target, requestParams, stringify = false) => {
  if (!istype(target, ['object', 'array', 'string'])) {
    return [`check target params type: ${target}`];
  }

  // object: {q: 'test'} -> {"q": "{q}"} => {"q": "test"}
  // array: {q: 'test'} -> [["q": "{q}"]] => [["q": "test"]]
  // string: {q: 'test'} -> 'q={q}&...' => "q=test&...""
  const params: queryParams = paramsParaser(target, requestParams)[1]!;

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

export const parserPathSplitter: ParserPathSplitFn = (path) => {
  const sectionReg = /(\/.*?\/)/;
  const operatorReg = /(\[.*?\]|\{.*?\}|\<.*?\>)/;

  const cleaner = (target: string[]): string[] => target
    .filter((s: string) => !!s.length)
    .map((s: string) => s.trim());

  const sections = cleaner(path.split(sectionReg));

  let out: string[][];
  out = sections.map((s: string) =>
    cleaner(s.split(operatorReg)));

  return [null, out];
};

export const parserPathReducer: ParserPathReduceFn = (path, response, stringify = false) => {
  const sectionReg = /\/(.*?)\//;
  const identifierReg = /\./;
  const rangeReg = /\[([-]*\d*),*\s*([-]*\d*)\]/;
  const selectReg = /\{(.*?)\}/;
  const multiReg = /\s*,\s*/;
  const separatorReg = /\<(.*?)\>/;

  const [_, splitedPath] = parserPathSplitter(path);

  if (!splitedPath) { return [`${splitedPath} is invaild path`]; }

  let out: any[] = [];

  for (const sp of splitedPath) {
    for (const point of sp) {
      if (sectionReg.test(point)) {
        out.push(point.match(sectionReg)![1] as string);
        continue;
      }
      if (identifierReg.test(point)) {
        const identifiers = point.split(identifierReg).filter((e) => e !== '$');
        const value: any = (identifiers as string[]).reduce((r: any, c: string) => {
          if (istype(r, 'object')) { return r[c]; }
          if (istype(r, 'array')) {
            const match = c.match(/-(\d+)/);
            if (!match) { return r[c]; }
            return r[r.length - parseInt(match[1], 10) - 1];
          }
          return r;
        }, response);
        out.push(value);
        continue;
      }

      const last: any = out[out.length - 1];

      if (last === undefined) { continue; }

      if (rangeReg.test(point) && istype(last, 'array')) {
        const [_, start = '0', end = '0'] = point.match(rangeReg)!;
        const [s, e] = [parseInt(start, 10), parseInt(end, 10)];
        if (s >= 0 && e >= 0) {
          last.splice(0, s);
          last.splice((e - s) + 1);
        }
        if (s >= 0 && e < 0) {
          last.splice(0, s);
          last.splice(-1, -e);
        }
        if (s < 0 && e < 0) {
          last.splice(s);
          last.splice(0, (last.length + (e - s)) - 1);
        }
        continue;
      }

      if (selectReg.test(point)) {
        const keys = point
          .match(selectReg)![1]
          .split(multiReg);

        let r = [] as any[];

        for (const item of last) {
          r = [
            ...r,
            ...Object.entries(item)
              .filter(([k, v]) => keys.includes(k))
              .map(([k, v]) => v),
          ];
        }

        out[out.length - 1] = r;
        continue;
      }

      if (separatorReg.test(point)) {
        const separator = point.match(separatorReg)![1];
        const r = out[out.length - 1];
        if (istype(r, 'array')) {
          out[out.length - 1] = r.join(separator || '');
          continue;
        }
        if (istype(r, 'object')) {
          out[out.length - 1] = Object.values(r).join(separator || '');
          continue;
        }
      }
    }
  }

  out = out.filter((s: string | undefined) => s !== '' || s !== undefined);

  return [null, !stringify ? out : out.join('')];
};

export const translationResultParser: TranslationResultParseFn = (
  response, { parser, test = {} }, stringify = true) => {
  const result: translationResult = {};

  for (const [name, selector] of Object.entries(parser)) {
    const [error, r = ''] = parserPathReducer((selector as string), response, stringify);

    if (error !== null) { return [error]; }

    result[name] = r;

    const rule = test[name];

    try {
      if (istype(rule, 'string')) {
        if (!new RegExp(rule as string).test(r as string)) {
          result[name] = '__unfound__';
        }
      } else if (istype(rule, 'array')) {
        const [reg, placeholder] = rule;
        if (!new RegExp(reg as string).test(r as string)) {
          result[name] = placeholder || '__unfound__';
        }
      }
    } catch (error) {
      return [error.message, result];
    }
  }

  return [null, result];
};

export const templateLayoutParser: TemplateLayoutParseFn = (result, { rows }) => {
  const out: LayoutPreset['rows'] = [];

  for (let i = 0; i < rows.length; i++) {
    out[i] = rows[i].map((e: string) =>
      e.replace(/{(.+?)}/gmi, (_, $1) => result![$1] as string || ''));
  }

  return [null, out];
};

export const configKeysReducer: ConfigKeysReduceFn = (keys, config) => {
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

export const presetLanguagesModifier: PresetLanguagesModifyFn = (languages, rules = []) => {
  if (!rules.length) {
    debug.log('no existed any language modifing rules');
    return [null, languages];
  }

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

export const presetLanguagesFilter: PresetLanguagesFilterFn = (languages, include, exclude) => {
  if (!include && !exclude) { return [null, languages]; }

  let out: Language[] = [...languages];

  if (include && include.length) {
    out = out.filter(({ code }) => include.includes(code));
  }

  if (exclude && exclude.length) {
    out = out.filter(({ code }) => !exclude.includes(code));
  }

  return [null, out];
};

export const presetInvoker: PresetInvokeFn = (presetId, presets) => {
  let preset: presetStringJson | Preset | SourcePreset | LayoutPreset;

  const find = (id: string) => presets.filter((stringifyPreset) => {
    const [_, mid] = stringifyPreset.match(presetIdJsonReg) || ['', ''];
    return id === mid;
  })[0];

  try {
    preset = find(presetId) as presetStringJson;

    if (!preset) { return [`no preset id is "${presetId}"`]; }

    preset = JSON.parse(preset) as Preset | SourcePreset | LayoutPreset;

    if (!!preset.extends) {
      const parent = find(preset.extends);

      if (!parent) {
        return [`no parent preset id is "${preset.extends}"`, preset];
      }

      preset = Object.assign(JSON.parse(parent), preset) as Preset | SourcePreset | LayoutPreset;
    }
  } catch (error) {
    return [new Error(error)];
  }

  return [null, preset];
};
