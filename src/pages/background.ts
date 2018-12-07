import store from '@/stores/background';
import defaultConfig from '@/defaults/config';
import browser from '@/apis/browser';

const { storage, runtime } = browser;

(async () => {
  // await storage.sync.clear();
  // const a = await storage.sync.get('test');
  // tslint:disable-next-line:no-console
  console.log(defaultConfig);
})();
