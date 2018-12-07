import browser from '@/apis/browser';

const manifest = browser.runtime.getManifest();

export default {
  version: manifest.version,
} as Config;

export interface Config {
  version: string | 'v0.0.0';

}
