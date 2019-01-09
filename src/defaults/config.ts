/**
 * defaults storage config struct
 */
import browser from '@/apis/browser';
import preference from './preference';
import translation from './translation';
import web from './web';
import template from './template';
import { presetLanguagesModifier } from '@/functions';
import { modifiedLocaleRules } from '@/variables';

export const manifest = browser.runtime.getManifest();
export const UILanguage = browser.i18n.getUILanguage();

export const locale: Language['code'] =  presetLanguagesModifier(
  [{ name: UILanguage, code: (UILanguage || 'en').toLowerCase() }],
  modifiedLocaleRules)[1]![0].code;

const base: BaseConfig = {
  runtime_env: RUNTIME_ENV,
  version: manifest.version,
  last_version: '',
  ui_language: locale,
  request_timeout: 10000,
};

const isChina: boolean = /^zh(\-[a-z]+)?/.test(locale);
if (isChina) {
  translation.translation_current_source = translation.translation_enabled_sources[1];
}

const defaultConfig: DefaultConfig = {
  ...base,
  ...preference,
  ...translation,
  ...web,
  ...template,
};

export default defaultConfig;

export { base, preference, translation, web, template };
