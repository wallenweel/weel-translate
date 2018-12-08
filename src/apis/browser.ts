/**
 * integrated extension's apis of browsers
 */

import firefox from './firefox';
import chrome from './chrome';

const browser = ({
  firefox,
  chrome,
  web: window, // useless
} as TargetBrowsers)[TARGET_BROWSER] as Browser;

export default browser;

export const storage: Storage = browser.storage;

interface TargetBrowsers {
  readonly [name: string]: Browser | object;
}
