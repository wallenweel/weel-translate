export default {
  'preference-theme': 'light',
  'preference-fab-enable': true,
  'preference-fab-position': 'center',
  'preference-fap-enable': true,
  'preference-fap-position': 'center',
  'preference-fap-position-edge': 'tc',
} as PreferenceConfig;

export const prefixer = (name: string): string => `preference-${name}`;
