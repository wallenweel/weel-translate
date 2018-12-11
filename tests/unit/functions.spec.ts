import * as types from '@/types';
import debug from '@/functions/debug';
import {
  plainCopy,
  versionCheck,
  presetsParser,
  presetsStringifier,
  templateLayoutParser,
} from '@/functions';
import stringifySourcePresets, { sourcePresets } from '@/defaults/sources';
import stringifyLayoutPresets, { layoutPresets } from '@/defaults/layouts';

describe('functions/debug', () => {
  it(`return <global>.console object`, () => {
    expect(debug.log).toBeDefined();
    expect(debug.warn).toBeDefined();
    expect(debug.error).toBeDefined();
    expect(debug.info).toBeDefined();
  });
});

describe('function/plainCopy', () => {
  it(`simple copy a plain object`, () => {
    const o1 = { test: true };
    const [, o2] = plainCopy(o1);

    expect(o2.test).toBe(true);
    o2.test = false;
    expect(o2.test).toBe(false);
    expect(o1.test).toBe(true);
  });
});

describe('functions/versionCheck', () => {
  it(`return version status after installed`, () => {
    const fn = versionCheck;

    expect(fn('3.0.1', undefined)[1]).toBe(types.VERSION_FRESH);
    expect(fn('3.0.1', '')[1]).toBe(types.VERSION_FRESH);
    expect(fn('3.0.1', '2.3.2')[1]).toBe(types.VERSION_UPDATED);
    expect(fn('3.0.1', '3.0.1')[1]).toBe(types.VERSION_SAME);
    expect(fn('3.0.0', '3.1.0')[1]).toBe(types.VERSION_OUTDATED);
  });
});

describe('functions/presetsParser', () => {
  it(`parse presets list`, () => {
    const fn = presetsParser;

    expect(fn(stringifySourcePresets)[1]).toHaveProperty('length');
    expect(fn(stringifyLayoutPresets)[1]).toHaveProperty('length');
  });
});

describe('functions/presetsStringifier', () => {
  it(`stringify presets list`, () => {
    const fn = presetsStringifier;

    expect(fn(sourcePresets)[1]).toHaveProperty('length');
    expect(fn(layoutPresets)[1]).toHaveProperty('length');
  });
});

describe('function/templateLayoutParser', () => {
  it(`parse layout's preset in result`, () => {
    const fn = templateLayoutParser;
    const result = { a: 'r_a', b: 'r_b', c: 'r_c' };
    const rows = [
      ['<action>', '{{a}}', '{{b}}', '{{c}}'],
      ['{{b}}', '<action>'],
      ['[ ', '{{c}}', ' ]'],
    ];

    expect(fn(result, rows)[0]).toBeNull();
    expect(fn(result, rows)[1]![0][0]).toBe('<action>');
    expect(fn(result, rows)[1]![0][1]).toBe(result.a);
  });
});
