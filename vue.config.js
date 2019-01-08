const path = require('path');
const {
  DefinePlugin
} = require('webpack')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')

// firefox, chrome, etc
const TARGET_BROWSER = process.env.TARGET_BROWSER || 'web'
const AMO_ID = `@weel-translate`

module.exports = {
  outputDir: `dist/${TARGET_BROWSER}`,

  pages: {
    'background/main': 'src/pages/background.ts',
    'popup/main': 'src/pages/popup.ts',
    'options/main': 'src/pages/options.ts',
    'content/main': 'src/pages/content.ts'
  },

  filenameHashing: false,

  // crossorigin: true,

  productionSourceMap: false,

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  configureWebpack: {
    // @see https://github.com/webpack/webpack/issues/5627#issuecomment-393007416
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      // prevent webpack from injecting eval / new Function through global polyfill
      global: false
    },

    devtool: "inline-source-map",
    plugins: plugins()
  },

  css: {
    loaderOptions: {
      sass: {
        includePaths: [path.resolve(__dirname, 'node_modules')],
      },
    },
  },
}

function plugins() {
  const r = [
    new DefinePlugin({
      TARGET_BROWSER: JSON.stringify(TARGET_BROWSER),
      RUNTIME_ENV: JSON.stringify(process.env.NODE_ENV)
    })
  ]

  if (TARGET_BROWSER !== 'web') {
    const { version } = require(`./package.json`)

    const base = require(`./src/assets/manifests/${TARGET_BROWSER}.base.json`)
    const target = require(`./src/assets/manifests/${TARGET_BROWSER}.${process.env.NODE_ENV}.json`)
    const modify = { ...target, version }

    if (process.env.TARGET_PLATFORM === 'amo') {
      modify.applications = base.applications
      modify.applications.gecko.id = AMO_ID;
    }

    r.push(new GenerateJsonPlugin('manifest.json', Object.assign(base, modify)))
  }

  return r
}
