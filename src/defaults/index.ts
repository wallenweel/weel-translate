/**
 * defaults storage data struct
 */

import ExtensionConfig, { Config } from './config';
import TranslationData, { Data } from './translation';

export default {
  ...ExtensionConfig,
  ...TranslationData,
} as DefaultAll;

export const storage: DefaultStorage = {
  ...ExtensionConfig,
  ...TranslationData,
};

export interface DefaultAll extends Config, Data {
  // [name: string]: any;
}

export interface DefaultStorage extends Config, Data {
  // [name: string]: any;
}
