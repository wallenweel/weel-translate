/**
 * try to fix some problems in package
 * "vue-mdc-adapter" temporarily
 */

class MdcAdapterPatch {
  public install(Vue: any, options: any) {
    // fix $vm.$root.$options.components['router-link'] is undefind
    // that make mdc-adapter get wrong
    if (
      Vue.options.components['router-link'] === undefined &&
      Vue.options.components.RouterLink
    ) {
      Vue.component('router-link', Vue.options.components.RouterLink);
    }
  }
}

export default new MdcAdapterPatch();
