const GenerateJsonPlugin = require('generate-json-webpack-plugin')

module.exports = {
  pages: {
    'background/main': 'src/pages/background.ts',
    'popup/main': 'src/pages/popup.ts',
    'options/main': 'src/pages/options.ts',
    'content/main': 'src/pages/content.ts',
  },
  filenameHashing: false,
  configureWebpack: {
    devtool: "inline-source-map",
    plugins: [
      new GenerateJsonPlugin('manifest.json', Object.assign(
        require('./src/assets/manifest.base.json'),
        require(`./src/assets/manifest.${process.env.NODE_ENV}.json`)
      ))
    ]
  },
};
