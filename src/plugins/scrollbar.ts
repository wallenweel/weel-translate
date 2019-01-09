import VuePrefectScrollbar from 'vue-perfect-scrollbar';

class Scrollbar {
  public install(Vue: any) {
    Vue.component('scrollbar', VuePrefectScrollbar);
  }
}

export default new Scrollbar();
