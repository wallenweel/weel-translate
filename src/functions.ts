import * as types from './types';

export let versionCheck: VersionCheckFn;
versionCheck = (current, last) => {

  if (!last) {
    return [`last version is not existed`, types.VERSION_FRESH];
  }

  const toNumber = (s: version): number[] =>
    s.split(/\./).map((n: string) => parseInt(n, 10));

  const [c, l] = [toNumber(current), toNumber(last)];

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

export let translationSourcesParser: TranslationSourcesParserFn;
translationSourcesParser = (presets) => {
  try {
    const tmp: { [id: string]: TranslationSourcePreset } = {};
    const result = presets.map((preset) => {
      const json: TranslationSourcePreset = JSON.parse(preset);

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
    return [new Error(error)];
  }
};
