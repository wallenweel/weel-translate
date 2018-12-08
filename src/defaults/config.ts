import browser from '@/apis/browser';

const manifest = browser.runtime.getManifest();

export default {
  'runtime-env': RUNTIME_ENV,
  'version': manifest.version,
} as Config;

export interface Config {
  'runtime-env': 'development' | 'production';

  'version': string;
  'version-last'?: string;
}
