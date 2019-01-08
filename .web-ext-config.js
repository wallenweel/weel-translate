const sourceDir = 'dist/firefox'

module.exports = {
  verbose: true,
  sourceDir,
  run: {
    startUrl: [
      'about:debugging#addons'
    ]
  },
  build: {
    overwriteDest: true
  },
  ignoreFiles: [
    'js/**/*-legacy.*',
    'js/safari-nomodule-fix.js'
  ]
}
