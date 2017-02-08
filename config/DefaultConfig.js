import path from 'path'
import fs from 'fs'

const DEBUG = !process.argv.includes('--release')
const VERBOSE = process.argv.includes('--verbose')

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
]

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? 'development' : 'production',
  __DEV__: DEBUG,
}

export default class DefaultConfig {

  globals = GLOBALS

  env = {
    dev: DEBUG,
    prod: !DEBUG,
  }

  static relativeRoot = '..'

  static rootdirs = {
    root: '',
    tasks: 'tasks',
    src: 'src',
    build: 'build',
    dist: 'dist',
    test: 'test',
  }

  alias = {
    ...DefaultConfig.rootdirs,
  }

  tasks = {
    handleName(files) {
      return files.map(k => k.replace(/^\d{1,3}\.(.+)\.js$/, '$1'))
    },

    files: this.getValidFiles(this.path.tasks()),
    get filesName() { return this.handleName(this.files)},

    get contents() { return this.files.filter(k => /^0\d{1,2}\..+\.js$/.test(k)) },
    get contentsName() { return this.handleName(this.contents) },

    get tools() { return this.files.filter(k => /^1\d{1,2}\..+\.js$/.test(k)) },
    get toolsName() { return this.handleName(this.tools) },
  }

  /**
   * Getting Vaild Files
   *
   * @param  {String} dirpath need to read directory
   * @param  {String} parent  suffix of each item with '/'
   * @return {Array}          a collection of these files's name
   */
  getValidFiles(dirpath, parent) {
    const files = fs.readdirSync(dirpath)

    return files.filter(f => /^(?![\.\_\!\~]).+\..+$/.test(f))
      .map(k => parent ? `${parent}/${k}` : k)
  }

  /**
   * Generate Absolute Paths
   * @return {Object}   Path get approach collection
   */
  get path() {
    const result = {}
    const absoluteRoot = path.join(__dirname, DefaultConfig.relativeRoot)

    Object.keys(this.alias)
      .forEach(k => (result[k] =
        (...dir) => path.join(absoluteRoot, this.alias[k], ...dir)
      ))

    return result
  }

  /**
   * Current Work Directory (Relate to project root)
   * @return {Object} path generator collection
   */
  static get cwd() {
    return Object.keys(DefaultConfig.rootdirs).reduce((prev, curr) => {
      prev[curr] = (...dir) => DefaultConfig.rootdirs[curr] + (dir ? `/${dir.join('/')}` : '')
      return prev
    }, {})
  }

  static src(cfg, match = []) {
    const cwd = aim => DefaultConfig.cwd.src(cfg.cwd.src, aim)

    cfg.include.forEach(k => match.push(cwd(k)))
    cfg.exclude.forEach(k => match.push(`!${cwd(k)}`))

    return match
  }

  static dest(cfg) {
    const aim = (cfg && typeof cfg === 'object') ? cfg.cwd.dest : cfg
    const cwd = DEBUG ? 'dist' : 'build'

    return DefaultConfig.cwd[DefaultConfig.rootdirs[cwd]](aim)
  }

  ///////////////////
  // Task's Config //
  ///////////////////

  styles = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.dest(this) },

    cwd: {
      src: 'styles',
      dest: 'css',
    },

    include: ['*.scss'],
    exclude: [],

    min: '.min',

    entries: () => this.getValidFiles(
      this.path.src(this.styles.cwd.src),
      DefaultConfig.cwd.src(this.styles.cwd.src)
    ),

    sass: {
      outputStyle: 'expanded',
    },

    autoprefixer: {
      browsers: AUTOPREFIXER_BROWSERS,
    },
  }

  scripts = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.dest(this) },

    cwd: {
      src: 'scripts',
      dest: 'js',
    },

    include: ['*.{js,jsx}'],
    exclude: ['_*.{js,jsx}'],

    min: '.min',

    entries: () => this.getValidFiles(
      this.path.src(this.scripts.cwd.src),
      DefaultConfig.cwd.src(this.scripts.cwd.src)
    ),

    browserify: {
      debug: DEBUG,
      transform: ['babelify'],
    },
  }

  templates = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.dest(this) },

    cwd: {
      src: 'templates',
      dest: '',
    },

    include: ['*.{html,pug}'],
    exclude: ['_*.{html,pug}'],

    pug: {
      pretty: DEBUG ? 1 : 0,
    },
  }

  images = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.dest(this) },

    cwd: {
      src: 'images',
      dest: 'images',
    },

    include: ['**/*.{jpg,jpeg,png,gif,svg}'],
    exclude: ['sprites/**/*.*'],

    /** More options see: https://github.com/sindresorhus/gulp-imagemin */
    imagemin: {},

  }

  sprites = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.cwd.src() },

    cwd: {
      src: 'images/sprites',
      dest: '',
    },

    include: ['*.{png,jpg,jpeg}'],
    exclude: [],

    /** More options see: https://github.com/twolfson/gulp.spritesmith#spritesmithparams */
    params: {
      imgName: 'images/sprites.png',
      cssName: 'styles/_sprites.scss',
      imgPath: '/img/sprites.png',
      padding: 10,
      algorithm:'binary-tree',
    },
  }

  fonts = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.dest(this) },

    cwd: {
      src: 'fonts',
      dest: 'fonts',
    },

    include: ['**/*.{woff,woff2,ttf,eot,svg}'],
    exclude: [],
  }


  extras = {
    get src() { return DefaultConfig.src(this) },
    get dest() { return DefaultConfig.dest(this) },

    cwd: {
      src: 'extras',
      dest: '',
    },

    include: ['**/*'],
    exclude: [],
  }

  watch = {
    tasks: this.tasks.contentsName,
  }

  clean = {
    dest: DefaultConfig.dest,
  }

  build = {
    tasks: this.tasks.contentsName,
  }

  transfer = {
    src: [...this.fonts.src, ...this.extras.src],
    dest: DefaultConfig.dest(),
  }

  server = {
    /** More options see: browsersync.io/docs/options */
    bs: {
      reloadOnRestart: true,
      port: 3000,
      server: {
        baseDir: DefaultConfig.dest(),
        index: 'index.html',
      },
      files: DefaultConfig.dest('**/*'),
      open: true,
      notify: true,

      // "info", "debug", "warn", or "silent"
      logLevel: VERBOSE ? 'debug' : 'info',
    },
  }

  //////////////////
  // Some Assists //
  //////////////////

  /**
   * Type Parser
   * @param  {Any}    stuff Any need to check
   * @return {String}       Type name with lowercase
   */
  type(stuff, type = '') {
    const r = Object.prototype.toString
      .call(stuff).slice(8, -1).toLowerCase()

    if (!type) return r

    return r === type
  }

  /**
   * Mending Default Configuration
   * Could use like 'styles' or 'styles.include'
   * instead of this.styles.include

   * @param  {String || Object} type Need to be mended
   * @return {Function}      Param "props" is updating options
   */
  mend(type) {
    const genAim = str => {
      if (!/^[\$\_\w\d]+\.[\$\_\w\d]/.test(str)) return false

      return str.split('.').reduce((p, c) => p[c], this)
    }

    const aim = this.type(type, 'object') ? type : genAim(type) || this[type]

    /**
     * Updating options
     * @param  {Object} props New options
     * @return Assignment or Recursion
     */
    return (props) => {
      Object.keys(props).forEach(k =>
        !this.type(props[k], 'object') ? (aim[k] = props[k]) : this.mend(aim[k])(props[k])
      )
    }
  }

  /**
   * Update by chain
   */
  renew(type, props) {
    this.mend(type)(props)

    return this
  }

}
