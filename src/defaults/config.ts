/**
 * defaults storage config struct
 */
import browser from '@/apis/browser';
import preferenceConfig from './preference';
import translationConfig from './translation';
import webConfig from './web';
import templateConfig from './template';

const manifest = browser.runtime.getManifest();

export const baseConfig: BaseConfig = {
  runtime_env: RUNTIME_ENV,
  version: manifest.version,
  last_version: '',
  ui_language: 'en',
  request_timeout: 10000,
};

const defaultConfig: DefaultConfig = {
  ...baseConfig,
  ...preferenceConfig,
  ...translationConfig,
  ...webConfig,
  ...templateConfig,
};

export default defaultConfig;
