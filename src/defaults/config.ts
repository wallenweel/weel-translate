/**
 * defaults storage config struct
 */
import browser from '@/apis/browser';
import extensionPreference from './preference';
import translationData from './translation';

const manifest = browser.runtime.getManifest();

export default {
  'runtime-env': RUNTIME_ENV,
  'version': manifest.version,

  ...extensionPreference,
  ...translationData,
} as DefaultConfig;
