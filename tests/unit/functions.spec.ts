import * as types from '@/types';
import {
  versionCheck,
  translationSourcesParser,
  translationSourcesStringify,
} from '@/functions';
import stringifySourcePresets, { sourcePresets } from '@/defaults/sources';

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

describe('functions/translationSourcesParser', () => {
  it(`return "JSON.parse"ed full translation sources's presets list`, () => {
    const fn = translationSourcesParser;

    expect(fn(stringifySourcePresets)[1]).toHaveLength(2);
  });
});

describe('functions/translationSourcesStringify', () => {
  it(`return "JSON.stringify"ed translation sources's presets list`, () => {
    const fn = translationSourcesStringify;

    expect(fn(sourcePresets)[1]).toHaveLength(2);
  });
});
