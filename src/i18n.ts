import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  silentTranslationWarn: RUNTIME_ENV === 'production',
});

/** detect user language */
import { modifiedLocaleRules as rules } from '@/variables';
import { presetLanguagesModifier } from './functions';

export const language: Language['code'] = (browser.i18n.getUILanguage() || 'en').toLowerCase();
export const locale: Language['code'] = presetLanguagesModifier([{
  name: language,
  code: language,
}], rules)[1]![0].code;
