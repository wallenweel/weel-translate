import {
  TEST,
} from '@/types';
import store from '@/stores/background';
// import defaultConfig from '@/defaults';
// import browser from '@/apis/browser';

// const { storage, runtime } = browser;

const { dispatch } = store;

(async () => {
  const result = await dispatch(TEST);

  // tslint:disable-next-line:no-console
  console.log(result);
})();
