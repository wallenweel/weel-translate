/**
 * defaults storage data struct
 */

import ExtensionConfig, { Config } from './config';
import TranslationData, { Data } from './translation';

export default () => ({
  ...ExtensionConfig,
  ...TranslationData,
}) as DefaultsStruct;


interface DefaultsStruct extends Config, Data {
  // [name: string]: any;
}
