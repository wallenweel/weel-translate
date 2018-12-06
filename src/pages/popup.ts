import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import App from './Popup.vue';
import router from '@/routers/popup';
import store from '@/store';

import 'normalize.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/src/stylus/app.styl';

Vue.config.productionTip = false;
Vue.use(Vuetify);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// tslint:disable-next-line:no-console
// console.log(location);
