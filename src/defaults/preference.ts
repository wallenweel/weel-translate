export default {
  'preference-theme': 'light',
  'preference-fab-enable': true,
  'preference-fab-position': 'center',
  'preference-fap-enable': true,
  'preference-fap-position': 'center',
  'preference-fap-position-edge': 'tc',
} as Preference;

export const prefixer = (name: string): string => `preference-${name}`;

export interface Preference {
  'preference-theme': 'dark' | 'light';

  // enable float action button
  'preference-fab-enable': boolean;

  // after selection | center of selection | follow mouse
  'preference-fab-position': 'after' | 'center' | 'follow';

  // enable float action (result) panel
  'preference-fap-enable': boolean;

  // center of selection | follow fab | window edge
  'preference-fap-position': 'center' | 'follow' | 'edge';
  // vaild if above set "edge"
  // top left | top center | top right | bottom left | bottom center | bottom right
  'preference-fap-position-edge': 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';

  // enable context menu entry
  'preference-context-menu-enable': boolean;
}
