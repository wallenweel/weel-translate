export const env: string = RUNTIME_ENV;

export const isDebug: boolean = env === 'development';

export const isRelease: boolean = env === 'production';

export const isWeb: boolean = TARGET_BROWSER === 'web';

// this ext's project name
export const extensionName: string = 'weel-translate-x';

// custom tag for rejecting to content page
export const extensionTagName: string = extensionName;

// default timeout number for net request
export const requestTimeout: number = 12000;

// check whether is preset's id format
export const presetIdReg: RegExp = /[\d\w\_]+?/;
// check whether is preset's format
export const presetIdJsonReg: RegExp = /"id":"([\d\w\_]+?)"/;

// things that should to be avoid
export const avoidanceReg = {
  urls: [
    /^about:/,
    /^http[s]:\/\/addons\.mozilla\.org/,
  ],
};

// define default theme's stuffs
export const theme = {
  color: {
    primary: '#6200ee',
    secondary: '#5800d5',
  },
};

// make browser's user locale fit i18n files
export const modifiedLocaleRules = ['en-us:>en', 'zh:>zh-cn'];

// these config keys need to reset after updated
export const updatedConfigKeys: { [v: string]: Array<keyof DefaultConfig> } = {
  '3.0.6': [
    'translation_sources',
    'translation_enabled_sources',
    'template_source_layouts',
    'template_layouts',
  ],
  '3.0.10': [
    'preference_theme_color_primary',
    'preference_theme_color_secondary',
    'translation_sources',
  ],
  '3.0.12': [
    'preference_fab_enable',
  ],
};
