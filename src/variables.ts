export const env: string = RUNTIME_ENV;

export const isDebug: boolean = env === 'development';

export const isRelease: boolean = env === 'production';

export const isWeb: boolean = TARGET_BROWSER === 'web';

export const extensionName: string = 'weel-translate-x';

export const extensionTagName: string = extensionName;

export const requestTimeout: number = 12000;

export const presetIdReg: RegExp = /[\d\w\_]+?/;

export const presetIdJsonReg: RegExp = /"id":"([\d\w\_]+?)"/;
