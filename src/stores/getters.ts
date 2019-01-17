import { Getter } from 'vuex';
import { State } from '.';
import { locale as autoLocale } from '@/i18n';
import { presetLanguagesFilter, presetLanguagesModifier } from '@/functions';
import standardLanguages from '@/assets/languages.json';

type G = Getter<State, State>;

export const locale: G = (state): Language['code'] => state.preference.locale || autoLocale;

export const theme: G = (state) => ({
  mode: state.preference.theme,
  color: {
    primary: state.preference.primaryColor,
    secondary: state.preference.secondaryColor,
  },
});

export const languages: G = (state, getters) => {
  const { preset } = getters;
  if (!preset) { return []; }

  let out: Language[];
  if (!!preset.languages) {
    out = preset.languages;
  } else {
    out = standardLanguages;
  }

  out = presetLanguagesFilter(out, preset.include, preset.exclude)[1] as Language[];
  out = presetLanguagesModifier(out, preset.modify)[1] as Language[];

  return out;
};
