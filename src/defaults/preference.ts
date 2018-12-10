export default {
  preference_theme: 'light',
  preference_fab_enable: true,
  preference_fab_position: 'center',
  preference_fap_enable: true,
  preference_fap_position: 'center',
  preference_fap_position_edge: 'tc',
} as PreferenceConfig;

export const prefixer = (name: string): string => `preference_${name}`;
