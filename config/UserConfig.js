import DefaultConfig from './DefaultConfig'

export default class UserConfig extends DefaultConfig {

  constructor() {
    super()

    this.renew('server.bs', {
      port: 3030,
      ui: false,
      open: false,
      notify: false,
    })
    .renew('images.cwd', {
      dest: 'img',
    })
    .renew('styles', {
      min: '',
    })
    .renew('scripts', {
      browserify: {
        debug: false,
      },
      min: '',
    })
  }

}
