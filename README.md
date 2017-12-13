# Weel Translate 2

> A Material Design Style Translation Extension For Browser(Firefox). 

## Add Translation Service Source

> Weel Translation 2 begin to support custom API config, feel free
to make your own translation service.

Open `options page` then find ....

### Example:
```js
// JSON Format
{
  "id": "google",
  "name": "Google",

  // get languages list from `[project root]/src/api/languages.json`
  "include": ["en", "zh-cn", "ja"], // array
  // or
  "include": "en/zh-cn/ja", // split by '/'
  // if you need to change language's code, like 'ja' -> 'jp'
  "include": ["en", "zh-cn", "ja:>jp"],
  "include": "en/zh-cn/ja:>jp",

  "exclude": ["fr", "zh"], // same with "include" but will ignore "include"

  // if you supply "languages" key like below,
  // extension's corresponding item will be override.
  // you don not need to put their 'code' in "include"
  "languages": [{
    "code": "zh",
    "name": "Chinese",
    "locale": "中文"
  }, {
    "code": "jp",
    "name": "Japanese",
    "locale": "日文"
  }]
}
```

## Custom Styles

> Modify some elements's appearance by your custom CSS


## Thanks & Using These Projects

+ vue2
+ vue-router
+ vuex
+ vuetify
+ material desigon icons

## Build Setup

``` bash
# install dependencies
npm install // or yarn

# serve with hot reload at localhost:3030
npm run dev:server

# dynamic compile /src to /dist and listen files change
npm run dev:watch

# start a temporary firefox for extension development
npm run dev:ext

# build for production with minification
npm run build:pro 

# package /dist to /web-ext-artifacts/[extension_name-version].zip
npm run build:ext

```
