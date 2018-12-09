import * as types from '@/types';
import {
  versionCheck,
  translationSourcesParser,
} from '@/functions';
import translationSourcePresets from '@/defaults/sources';

describe('functions/versionCheck', () => {
  it('return version status after installed', () => {
    const fn = versionCheck;

    expect(fn('3.0.1', undefined)[1]).toBe(types.VERSION_FRESH);
    expect(fn('3.0.1', '')[1]).toBe(types.VERSION_FRESH);
    expect(fn('3.0.1', '2.3.2')[1]).toBe(types.VERSION_UPDATED);
    expect(fn('3.0.1', '3.0.1')[1]).toBe(types.VERSION_SAME);
    expect(fn('3.0.0', '3.1.0')[1]).toBe(types.VERSION_OUTDATED);
  });
});

describe('functions/translationSourcesParser', () => {
  it('return "JSON.parse"ed full translation sources preset', () => {
    const fn = translationSourcesParser;

    expect(fn(translationSourcePresets)[1]).toHaveLength(2);
  });
});
