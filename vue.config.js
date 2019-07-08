const path = require('path');
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const ReplaceInFile = require('replace-in-file-webpack-plugin')
const WebpackDelete = require('webpack-delete-plugin')

// firefox, chrome, etc
const TARGET_BROWSER = process.env.TARGET_BROWSER || 'web'
const outputDir = `dist/${TARGET_BROWSER}`
const AMO_ID = `@weel-translate`

const pages = {
  production: {
    'background/main': 'src/pages/background.ts',
    'popup/main': 'src/pages/popup.ts',
    'content/main': 'src/pages/content.ts'
  },
  development: {
    'background/main': 'src/pages/background.ts',
    'popup/main': 'src/pages/popup.ts',
    'options/main': 'src/pages/options.ts',
    'content/main': 'src/pages/content.ts'
  }
}[process.env.NODE_ENV]

module.exports = {
  outputDir,

  pages,

  filenameHashing: false,

  productionSourceMap: false,

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  chainWebpack: config => {
    config
      .devtool('inline-source-map')
      .node.set('global', false)
      .end()
      .plugin('define')
        .tap(args => {
          return [{
            ...args[0]['process.env'],

            gloabl: 'window', // repeat gloabl object to window

            TARGET_BROWSER: JSON.stringify(TARGET_BROWSER),
            RUNTIME_ENV: JSON.stringify(process.env.NODE_ENV)
          }]
        })

    if (TARGET_BROWSER !== 'web') {
      const { version } = require(`./package.json`)
      const base = require(`./src/assets/manifests/${TARGET_BROWSER}.base.json`)
      const target = require(`./src/assets/manifests/${TARGET_BROWSER}.${process.env.NODE_ENV}.json`)
      const modify = { ...target, version }

      if (process.env.TARGET_PLATFORM === 'amo') {
        modify.browser_specific_settings = base.browser_specific_settings
        modify.browser_specific_settings.gecko.id = AMO_ID
      }

      if (
        TARGET_BROWSER === "firefox" &&
        process.env.TARGET_PLATFORM !== "amo"
      ) {
        modify.browser_specific_settings = base.browser_specific_settings;
        modify.browser_specific_settings.gecko.update_url =
          process.env.VUE_APP_UPDATE_URL_FIREFOX;
      }

      config.plugin('generate-json')
        .use(GenerateJsonPlugin, ['manifest.json', { ...base, ...modify }])
    }

    if (
      process.env.NODE_ENV === 'production' &&
      process.env.VUE_CLI_MODERN_BUILD &&
      process.env.VUE_CLI_MODERN_MODE
    ) {
      const search = `Function("return this")()`
      const replace = '(function(){return this})()'

      config
        .plugin('replace-in-file')
          .use(ReplaceInFile, [[{
            dir: 'dist/firefox/js',
            files: ['chunk-vendors.js'],
            rules: [{ search, replace }]
          }]])
        .end()
        .plugin('webpack-delete')
          .use(WebpackDelete, [[`./${outputDir}/js/**/*-legacy.js`]])
    }

    // console.log(config.toConfig().plugins)
  },

  css: {
    loaderOptions: {
      sass: {
        includePaths: [path.resolve(__dirname, 'node_modules')],
      },
    },
  },
}
