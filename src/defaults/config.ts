/**
 * defaults storage config struct
 */
import browser from '@/apis/browser';
import extensionPreference, { Preference } from './preference';
import translationData, { Data } from './translation';
// import manifest from ''

const manifest = browser.runtime.getManifest();

export default {
  'runtime-env': RUNTIME_ENV,
  'version': manifest.version,

  ...extensionPreference,
  ...translationData,
} as DefaultConfig;

export interface DefaultConfig extends Preference, Data {
  'runtime-env': 'development' | 'production';

  'version': string; // 0.0.0
  'version-last'?: string;

  [name: string]: any;
}
