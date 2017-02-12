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
    .renew('styles', {
      include: ['**/*.scss'],
      exclude: ['**/_*.scss', '**/~*.scss', 'lib/*.scss'],
    })
    .renew('images.cwd', {
      dest: 'img',
    })
    .renew('scripts.browserify', {
      debug: false,
    })
  }

}
