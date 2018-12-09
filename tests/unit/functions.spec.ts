import * as types from '@/types';
import debug from '@/functions/debug';
import {
  versionCheck,
  sourcePresetsParser,
  sourcePresetsStringifier,
} from '@/functions';
import stringifySourcePresets, { sourcePresets } from '@/defaults/sources';

describe('functions/debug', () => {
  it(`return <global>.console object`, () => {
    expect(debug.log).toBeDefined();
    expect(debug.warn).toBeDefined();
    expect(debug.error).toBeDefined();
    expect(debug.info).toBeDefined();
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

describe('functions/sourcePresetsParser', () => {
  it(`return "JSON.parse"ed full translation sources's presets list`, () => {
    const fn = sourcePresetsParser;

    expect(fn(stringifySourcePresets)[1]).toHaveLength(2);
  });
});

describe('functions/sourcePresetsStringifier', () => {
  it(`return "JSON.stringify"ed translation sources's presets list`, () => {
    const fn = sourcePresetsStringifier;

    expect(fn(sourcePresets)[1]).toHaveLength(2);
  });
});
