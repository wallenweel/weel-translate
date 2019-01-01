/**
 * defaults storage config struct
 */
import browser from '@/apis/browser';
import preference from './preference';
import translation from './translation';
import web from './web';
import template from './template';

const manifest = browser.runtime.getManifest();

const base: BaseConfig = {
  runtime_env: RUNTIME_ENV,
  version: manifest.version,
  last_version: '',
  ui_language: 'en',
  request_timeout: 10000,
};

const defaultConfig: DefaultConfig = {
  ...base,
  ...preference,
  ...translation,
  ...web,
  ...template,
};

export default defaultConfig;

export { base, preference, translation, web, template };
