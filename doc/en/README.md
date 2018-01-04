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
"? Unused"

// JSON Format
{
  *"id": "google",
  ~"name": "Google", // source api's name such as "有道"
  ?"icon": "", // optional, base64 or uri, just be support to <img>'s src property

  ~"host": "https://translate.google.com",

  *"query": {
    *"text": {
      ~"method": "GET", // GET or POST, default GET

      // if "method" is POST, you can custom a request header
      // must be a plain object
      // default: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      ~"header": {},

      // request url, {{host}} = "https://translate.google.com"
      // if "method" is GET, also accept to use only "url" = "url?[,param]"
      *"url": "{{host}}/translate_a/single",

      ~*"params": [
        ["q", "{{q}}"], // {{q}} is input content
        ["sl", "{{from}}"], // {{from}} is source language
        ["tl", "{{to}}"], // {{to}} is destination language
        ["other", "param"]
      ]
    },
    // tip: have not to use same source's tts
    ~"audio": {
      ~"method": "GET",
      ~"header": {},
      *"url": "{{host}}/translate_tts",
      ~*"params": [
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
    "explain": "dict(,)" // only use a separator
    "explain": "dict.foobar(pos.0.foo, terms.1.bar)" // deep index
  }

  // [source, destination], it mean translate things from "en" to "zh-cn"
  // it is optional, but very recommend use it, if do not that both will use
  // the first language of source's "languages"
  ~*"fromto": ["en", "zh-cn"],
  
  // @see `[repo]/src/api/languages.json` get the list
  // can use "include" to select some common used languages
  // use all of these languages will delay popup(browser action) rending
  ~*"include": ["en", "zh-cn", "ja"], // first recommend use array
  // also
  "include": "en/zh-cn/ja", // split them by '/'

  // if you need to change language's code, like 'ja' -> 'jp'
  // just to use this `:>` flag
  "include": ["en", "zh-cn:>zh-CHS", "ja:>jp"],
  "include": "en/zh-cn:>zh-CHS/ja:>jp",

  // same with "include" but if it exist and will ignore "include"
  ~"exclude": ["fr", "zh"],

  // if default language list have not some language that you want
  // or you want to override some, supply "languages" key like below
  // tip: if you do this, new languages will auto include to "include" list
  ~"languages": [{
    *"code": "zh",
    *"name": "Chinese",
    *"locale": "中文"
  }, {
    *"code": "jp",
    *"name": "Japanese",
    *"locale": "日文"
  }]
}

```

### Inherit From Other Service API
```js
// Use array type instead of object
// the last element will be new api's preset and
// it will deep merge and override to foregoing presets
[
  // other api's id
  *"google",
  {
    *"id": "google_cn", // must not be same with others
    ~"url": "https://translate.google.cn",
    ~"include": ["en", "ja:>jp"]
    // ...
  }
]
```


## Custom Template

> Now only support "float action button/panel" in web page (run in content script)
> Current implement is full custom by using eval(vue2+vuex) due to I have not more enough
> time for the project and maybe this is better.

### Simple Example
```html
<!-- no work in current version -->
<!-- <parser> accept to define or override source's parser -->
<preser>
{
  "google|google_cn": {
    "phonetic_src": "sentences.$.src_translit",
    "phonetic_dest": "sentences.$.translit",
    "translation": "sentences(trans)",
    "explain": "dict(pos////terms)"
  }
}
</preser>
<template>
  <div>
    <!-- must have a root node -->
    <!-- feel free, if you know about vue string template -->
    <h1>{{`${foo} ${bar}`}}</h1>
    <!-- Hello World -->
  </div>
</template>
<script>
  // must use a function as entry
  // return a vue component options
  ({
    mapState,
    mapGetters,
    mapMutations,
    mapActions
  }) => ({
    name: "Demo",
    data () {
      return {
        foo: 'Hello',
        bar: 'World'
      }
    }
  })
</script>

<!-- recommend add the "scoped" property in order to do not effect page style -->
<!-- if "scoped" prop has a value "scoped=demo" and will output: -->
<!-- [demo] h1 { color: red; } -->
<style scoped>
  /* if css rules appear [scoped] it will auto replace with real one */
  /* [data-47a39a3b], [data-47a39a3b] * { color: blue; } */
  [scoped], [scoped] * {
    all: initial;
    font-family: Arial, sans-serif;
  }

  /* output: [data-47a39a3b] h1 { color: red; } */
  h1 {
    color: red;
  }
</style>
```


## Thanks These Projects

+ vue2
+ vuex
+ vue-router
+ vuetify
+ material desigon icons
+ ...

## Build Setup

``` bash
# install dependencies
npm install

# or but recommend
yarn

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
