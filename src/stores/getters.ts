import { Getter } from 'vuex';
import { State } from '.';
import { locale as autoLocale } from '@/i18n';

type G = Getter<State, State>;

export const locale: G = (state): Language['code'] => state.preference.locale || autoLocale;

export const theme: G = (state) => ({
  mode: state.preference.theme,
  color: {
    primary: state.preference.primaryColor,
    secondary: state.preference.secondaryColor,
  },
});
