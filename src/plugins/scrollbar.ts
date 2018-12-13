import { VueConstructor } from 'vue';
import VuePrefectScrollbar from 'vue-perfect-scrollbar';

class Scrollbar {
  public install(Vue: VueConstructor) {
    Vue.component('scrollbar', VuePrefectScrollbar);
  }
}

export default new Scrollbar();
