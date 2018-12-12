/**
 * integrated extension's apis of browsers
 */

import { browserShim } from './browser-shims';
import firefox from './firefox';
import chrome from './chrome';

const browser = ({
  firefox,
  chrome,
  web: browserShim, // useless
} as TargetBrowsers)[TARGET_BROWSER] as Browser;
export default browser;

export const storage: BrowserStorage = browser.storage;

interface TargetBrowsers {
  readonly [name: string]: Browser | object;
}
