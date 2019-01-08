const isAmo = process.env.TARGET_PLATFORM === 'amo';

module.exports = {
  verbose: false,
  sourceDir: 'dist/firefox',
  artifactsDir: `web-ext-artifacts${isAmo ? '/amo' : ''}`,
  run: {
    startUrl: [
      'about:debugging#addons'
    ]
  },
  build: {
    overwriteDest: true
  },
  ignoreFiles: [
    'js/**/*-legacy.*'
  ]
}
