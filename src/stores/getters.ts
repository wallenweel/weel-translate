import { Getter } from 'vuex';
import { State } from '.';

type G = Getter<State, State>;

export const locale: G = (state): Language['code'] => state.preference.locale;

export const theme: G = (state) => ({
  mode: state.preference.theme,
  color: {
    primary: state.preference.primaryColor,
    secondary: state.preference.secondaryColor,
  },
});
