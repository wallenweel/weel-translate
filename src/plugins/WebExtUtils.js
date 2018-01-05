/**
 * repack some common APIs of
 * web extension for vue
 */
import * as i18n from '@/functions/i18n'
import * as runtime from '@/functions/runtime'

class WebExtUtils {
  install (Vue, options) {
    Vue.mixin({
      computed: {
        i18n: () => i18n,
        i: () => i18n.getMessage,
        runtime: () => runtime
      }
    })
  }
}

export default new WebExtUtils()
