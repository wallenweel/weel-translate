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

export interface TargetBrowsers {
  readonly [name: string]: Browser | object;
}

export interface Browser {
  // browser's original global object
  readonly origin?: any;

  readonly runtime: Runtime;
  readonly storage: Storage;
  // readonly [name: string]: any;
}

interface Runtime {
  onMessage: {
    // send a response asynchronously, `return true;` in the listener
    addListener(listener: listenerHandler): void;
  };
  getManifest(): {
    version: string; // like 0.0.0
  };
}

interface Storage {
  readonly local: StorageAreaMethods;
  readonly sync: StorageAreaMethods;
  readonly [type: string]: StorageAreaMethods;
}

interface StorageAreaMethods {
  get(keys: storageKeys): Promise<object | Error>;
  set(keys: object): Promise<object | Error>;
}

type listenerHandler = (message: object, sender: MessageSender, sendResponse: () => {}) => boolean | Promise<any>;

interface MessageSender {
  tab?: any;
  frameId?: number;
  id?: string;
  url?: string;
  tlsChannelId?: string;
}
