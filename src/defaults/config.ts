/**
 * defaults storage config struct
 */
import browser from '@/apis/browser';
import translationConfig from './translation';
import preferenceConfig from './preference';
import templateConfig from './template';

const manifest = browser.runtime.getManifest();

export const baseConfig: BaseConfig = {
  runtime_env: RUNTIME_ENV,
  version: manifest.version,
  last_version: '',
};

export default {
  ...baseConfig,
  ...translationConfig,
  ...preferenceConfig,
  ...templateConfig,
} as DefaultConfig;
