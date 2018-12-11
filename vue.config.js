const path = require('path');
const {
  DefinePlugin
} = require('webpack')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')

// firefox, chrome, etc
const TARGET_BROWSER = process.env.TARGET_BROWSER || 'web'

module.exports = {
  outputDir: `dist/${TARGET_BROWSER}`,

  pages: {
    'background/main': 'src/pages/background.ts',
    'popup/main': 'src/pages/popup.ts',
    'options/main': 'src/pages/options.ts',
    'content/main': 'src/pages/content.ts'
  },

  filenameHashing: false,

  configureWebpack: {
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
    r.push(
      new GenerateJsonPlugin('manifest.json', Object.assign(
        require(`./src/assets/manifests/${TARGET_BROWSER}.base.json`),
        require(`./src/assets/manifests/${TARGET_BROWSER}.${process.env.NODE_ENV}.json`)
      ))
    )
  }

  return r
}