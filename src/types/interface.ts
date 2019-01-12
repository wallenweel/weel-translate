import { TranslateResult } from 'vue-i18n';

export interface Option<S> {
  headline?: string | TranslateResult;
  subheading?: string | TranslateResult;
  type: 'radio' | 'slider' | 'checkbox' | 'color';
  label?: string | TranslateResult;
  meta?: any;
  values?: Array<[string | TranslateResult, any]>;
  name: keyof S;
  value: S[Option<S>['name']];
  appends?: Array<OptionAppends<S>>;
}

interface OptionAppends<S> extends Option<S> {
  test?: [keyof S, any];
}
