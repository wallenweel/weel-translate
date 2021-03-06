import * as types from '@/types';
import debug from '@/functions/debug';
import {
  istype,
  plainCopy,
  versionCheck,
  presetsParser,
  presetsStringifier,
  templateLayoutParser,
  stringParamsParaser,
  presetParamsParser,
  parserPathSplitter,
  parserPathReducer,
  translationResultParser,
  presetLanguagesModifier,
  presetLanguagesFilter,
  presetInvoker,
  paramsParaser,
} from '@/functions';
import stringifySourcePresets, { sourcePresets } from '@/defaults/sources';
import stringifyLayoutPresets, { layoutPresets } from '@/defaults/layouts';
import languages from '@/assets/languages.json';

describe('functions/debug', () => {
  it(`return <global>.console object`, () => {
    expect(debug.log).toBeDefined();
    expect(debug.warn).toBeDefined();
    expect(debug.error).toBeDefined();
    expect(debug.info).toBeDefined();
  });
});

describe('functions/plainCopy', () => {
  it(`simple copy a plain object`, () => {
    const o1 = { test: true };
    const [, o2] = plainCopy(o1);

    expect(o2.test).toBe(true);
    o2.test = false;
    expect(o2.test).toBe(false);
    expect(o1.test).toBe(true);
  });
});

describe('functions/istype', () => {
  it(`check target's type`, () =>
    expect(istype(null, 'null')).toBe(true));
  it(`check target's type whether or not in types list (type[])`, () =>
    expect(istype([], ['string', 'array'])).toBe(true));
});

describe('functions/versionCheck', () => {
  const fn = versionCheck;

  it(`check extension whether or not first install`, () =>
    expect(fn('3.0.1', undefined)[1]).toBe(types.VERSION_FRESH));
  it(`check extension does or not updated`, () =>
    expect(fn('3.0.1', '2.3.2')[1]).toBe(types.VERSION_UPDATED));
  it(`check extension has or not same version`, () =>
    expect(fn('3.0.1', '3.0.1')[1]).toBe(types.VERSION_SAME));
  it(`check extension whether or not outdated`, () =>
    expect(fn('3.0.0', '3.1.0')[1]).toBe(types.VERSION_OUTDATED));
  it(`chekc version whether or not incompatible`, () => {
    expect(fn('2.0.1', '3.0.1')[2]).toBe(1);
    expect(fn('3.12.1', '3.20.1')[2]).toBe(0);
    expect(fn('3.6.15', '3.6.11')[2]).toBe(-1);
  });
});

describe('functions/presetsParser', () => {
  const fn = presetsParser;

  it(`parse presets list`, () => {
    expect(fn(stringifySourcePresets)[1]).toHaveProperty('length');
    expect(fn(stringifyLayoutPresets)[1]).toHaveProperty('length');
  });
});

describe('functions/presetsStringifier', () => {
  const fn = presetsStringifier;

  it(`stringify presets list`, () => {
    expect(fn(sourcePresets)[1]).toHaveProperty('length');
    expect(fn(layoutPresets)[1]).toHaveProperty('length');
  });
});

describe('function/templateLayoutParser', () => {
  const fn = templateLayoutParser;
  const result = { a: 'r_a', b: 'r_b', c: 'r_c' };
  const preset = {
    expect: ['a', 'c'],
    rows: [
      ['<action>', '{a}', '{b}', '{c}'],
      ['{b}', '<action>'],
      ['[ ', '{c}', ' ]'],
    ],
  } as LayoutPreset;

  it(`parse layout's preset in result`, () =>
    expect(fn(result, preset)[1]![0][1]).toBe(result.a));
  it(`return original content if does not parse`, () =>
    expect(fn(result, preset)[1]![0][0]).toBe('<action>'));
});

describe('functions/stringParamsParaser', () => {
  const fn = stringParamsParaser;

  it(`parse params string to params object`, () => {
    const { test, key } = fn('test&key=value&extra=more')[1] as any;
    expect(test).toBe(true);
    expect(key).toBe('value');
  });
  it(`parse params object to parms string`, () =>
    expect(fn({ q: 'test', m: ['a', 'b'] })[1]).toBe('q=test&m=a&m=b'));
  it(`parse params <string[][]> to parms string`, () =>
    expect(fn([['q', 'test'], ['m', 'a'], ['m', 'b']])[1]).toBe('q=test&m=a&m=b'));
  it(`return "host" as third element in 'std' type`, () =>
    expect(fn('https://test.io?q=something')[2]).toBe('https://test.io'));
});

describe('functions/presetParamsParser', () => {
  const fn = presetParamsParser;
  const r = { q: 'test', t: 'a' };
  const [s, o, a, x] = [
    'q=test&m=a&m=b',
    fn({ q: '{q}', m: ['{t}', 'b'] }, r)[1],
    fn([['q', '{q}'], ['m', '{t}'], ['m', 'b']], r)[1],
    fn([['q', '{q}'], ['m', '{t}'], ['m', 'b']], r, true)[1],
  ];

  it(`parse <string>params to <URLSearchParams>`, () =>
    expect(s!.toString()).toBe('q=test&m=a&m=b'));
  it(`parse <object>params to <URLSearchParams>`, () =>
    expect(o!.toString()).toBe('q=test&m=a&m=b'));
  it(`parse <string[][]>params to <URLSearchParams>`, () =>
    expect(a!.toString()).toBe('q=test&m=a&m=b'));
  it(`parse <string[][]>params to <URLSearchParams<string>> directly`, () =>
    expect(x).toBe('q=test&m=a&m=b'));
});

describe('functions/parserPathSplitter', () => {
  const fn = parserPathSplitter;
  const s = '/Start /$.a[0, -1]{a,b}< | > /; / $.b.c[0,2]{0,2}<, >/; /$.c.a//$.c.b//$.d/./';

  it(`split path selector pattern to meta list`, () =>
    expect(fn(s)[1]).toHaveLength(11));
});

describe('functions/parserPathReducer', () => {
  const fn = parserPathReducer;
  const s = '/Start /$.a[0, -1]{a,b}< | > /; / $.b[0,2]{0,2}<, >/; /$.c.a//$.c.b//d.a/./';
  const response = {
    a: [{a: 'h', b: 'e'}, {a: 'l', b: 'l'}, {a: 'o'}, {a: 'nil'}],
    b: [['w', 0, 'o'], ['r', 1, 'l'], ['d', 2], ['nil']],
    c: {},
    d: { a: 'End' },
  };
  const result = 'Start h | e | l | l | o; w, o, r, l, d; End.';

  it(`support "range|reverse range|insert separactor text|object,array values format..."`, () =>
    expect(fn(s, response, true)[1]).toBe(result));
});

describe('functions/translationResultParser', () => {
  const fn = translationResultParser;
  const p = {
    parser: {
      title: 'a.b.c',
      message: '$.c<>',
      content: 'a.b.c /: "/ $.c<> /" (/ b.1<_> /) "/ b.-0.g/"~/',
      holder: '$.a.d',
      extra: '$.a.d',
    },
    test: {
      message: '\\w+',
      content: ['.+\\:\\s.+', 'correct'],
      holder: '\\w+',
      extra: ['\\w+', 'incorrect'],
    },
  } as any;
  const r = {
    a: { b: { c: 'Test' } },
    b: [{}, { d: 't', e: 'h', f: 'e' }, { g: 'world' }],
    c: ['h', 'e', 'l', 'l', 'o'],
  };
  const result = fn(r, p)[1]!;

  it(`return parser preset that have got real value in selector path`, () => {
   expect(result.title).toBe('Test');
   expect(result.message).toBe('hello');
  });
  it(`could use pettern format string`, () =>
    expect(result.content).toBe('Test: "hello" (t_h_e) "world"~'));
  it(`default playceholder`, () => expect(result.holder).toBe('__unfound__'));
  it(`custom playceholder`, () => expect(result.extra).toBe('incorrect'));
});

describe('functions/presetLanguagesModifier', () => {
  const fn = presetLanguagesModifier;

  it(`modifies origin language's meta to target's`, () => {
    const stringDemo = fn(languages, ['auto:>AUTO', 'zh-cn:>CHS'])[1];
    expect(stringDemo![0].code).toBe('AUTO');
    expect(stringDemo![15].code).toBe('CHS');

    const arrayDemo = fn(languages, [['auto', 'AUTO'], ['zh-cn', 'CHS']])[1];
    expect(arrayDemo![0].code).toBe('AUTO');
    expect(arrayDemo![15].code).toBe('CHS');

    const objectDemo = fn(languages, [
      [{ code: 'auto' }, { code: 'AUTO', locale: 'auto' }],
      [{ code: 'zh-cn' }, { code: 'CHS', name: '简体中文' }],
    ])[1];
    expect(objectDemo![0].code).toBe('AUTO');
    expect(objectDemo![15].code).toBe('CHS');
    expect(objectDemo![0].locale).toBe('auto');
    expect(objectDemo![15].name).toBe('简体中文');
  });
});

describe('functions/presetLanguagesFilter', () => {
  const fn = presetLanguagesFilter;
  const [include, exclude] = [
    ['auto', 'zh-cn', 'ja', 'en'],
    ['auto', 'da'],
  ];

  it(`filters languages if set "include" or "exclude" params in preset`, () => {
    const includeDemo = fn(languages, include)[1];
    expect(includeDemo).toHaveLength(4);
    expect(includeDemo![0].code).toBe('auto');

    const excludeDemo = fn(languages, undefined, exclude)[1];
    expect(excludeDemo).toHaveLength(103);
    expect(excludeDemo![0].code).not.toBe('auto');

    expect(fn(languages, include, exclude)[1]).toHaveLength(3);
  });
});

describe('functions/presetInvoker', () => {
  const fn = presetInvoker;

  it(`invokes a preset from JSON string to object.`, () => {
    const demo = fn('google_cn', stringifySourcePresets)[1];
    expect(demo!.name).toBe('谷歌');
    expect(demo).toHaveProperty('parser');
  });
});

describe('functions/paramsParaser', () => {
  const fn = paramsParaser;
  const p = { url: 'test', a: 'hello', b: 'world' };

  it(`value string in params object`, () =>
    expect(fn('{url}/{a}/{b}', p)[1]).toBe('test/hello/world'));
  it(`value object in params object`, () =>
    expect(fn({ url: '{url}', a: '{a}', b: '{b}' }, p)[1]!.url).toBe('test'));
});
