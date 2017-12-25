# Weel Translate 2

> A Material Design Style Translation Extension For Browser(Firefox). 

## Add Translation Service Source

> Weel Translation 2 begin to support custom API config, feel free
to make your own translation service.

Open `options page` then find ....

### Simple Example:
```js
"* Must"
"~ Recommended"

// JSON Format
{
  *"id": "google",
  ~"name": "Google",
  ~"icon": "", // base64 or uri, just be support to <img>'s src property

  ~"url": "https://translate.google.com",

  *"query": {
    *"text": {
      *"url": "{{url}}",
      ~"params": [
        ["q", "{{q}}"],
        ["sl", "{{from}}"],
        ["tl", "{{to}}"],
        ["other", "param"]
      ]
    },
    ~"audio": {
      *"url": "{{url}}/api_tts",
      ~"params": [
        ["q", "{{q}}"],
        ["tl", "{{from}}"],
        ["client", "gtx"],
        ["ie", "UTF-8"]
      ]
    }
  },

  *"parser": {
    // 'sentences' is a array, but it's elements are plain object
    // by `(trans)` get 'object.trans' of all to a array
    "translation": "sentences(trans)",
    // '$' mean 'sentences' this array's last one,
    // '$$' mean last but one, and so on.
    // use 'sentences.0.translit' get the first.
    "phonetic_src": "sentences.$.translit",
    // `(pos, terms)` like 'translation', but get two(or more) properties,
    // we can use other things replace `, ` such as `&` or
    // just ` ` a blank space, if want a `\n` use `\\\\`
    "explain": "dict(pos, terms)"
  }
  
  // get languages list from `[project root]/src/api/languages.json`
  ~"include": ["en", "zh-cn", "ja"], // array
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

### Inherit From Other Service API
```js
// Use array type instead of object
// the last element will be new api's preset and
// it will deep merge and override to foregoing presets
[
  *"google", // other api's id

  // "more", // no limit, support compose some api presets

  {
    *"id": "google_cn", // its
    "url": "https://translate.google.cn"
  }
]
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
