# Weel Translate MD
> Material Design Style Web Extension for Languages Translating.

## Main Features
- [x] Support base translation (out of the box)
- [x] Main translation in popup page (Browser Action)
- [ ] Float translation panel in web page (Content Script)
- [ ] Easy frontend settings
- [ ] Base customizable components (in frontend settings)
- [ ] Advance preset templates costom support (in options page)
- [ ] Support web infomation crawler (for sources that no api)
- [ ] Custimizable styles
- [?] Multiple UI languages support (Ready: `en`, `zh-cn`)

## Screenshots

## Simple Useing

## Advance Features

## Translation Source Presets
### Interface
```typescript
{
  // source id, only support "_" as separator
  id: string;

  // display name
  name?: string;

  // extends a full preset, by source's id
  // must be set in children preset
  extends?: string;

  // query.<type>.url can override this
  url: string;

  // request method, axios relatived
  // could get this value by {{method}} in queries
  method?: 'get' | 'post' | string;

  // translation request
  // if is falsy, may use xhr or fetch by "url" and
  // parser's selectors as Dom selector
  query?: {
    text: TextQuery;
    audio?: AudioQuery;
  } | false;

  // parse response result
  // must be set in parent preset, optional in children
  // preset which has extends
  parser?: {
    // selector example:
    // "$.a/: /b.c[, ]/ /d.e{}/~/" in
    // { a: 'Example', b: { c: [1, 2, 3] }, d: { e: { 1: "he", 2: "llo" } } } =>
    // "Example: 1, 2, 3 hello~"
    // "/separator/", "[sep]" for array, "{sep}" for object
    [name: string]: selector;
  };

  // initial translating direction
  fromto?: [Language['code'], Language['code']];

  // support modify by symbol ":>"
  // such as "['auto:>AUTO', 'zh-cn:>zh-CHS']"
  modify?: string[];

  // just include necessary languages
  // if not exist, load all of languages
  include?: Array<Language['code']>;

  // invalid when "include" is set
  // if exist, exclude from all languages
  exclude?: Array<Language['code']>;
}
```

#### Example
```json
{
  "id": "google_com",
  "name": "Google",
  "url": "https://translate.google.com",
  "query": {
    "text": {
      "method": "get",
      "url": "{{url}}/translate_a/single",
      "params": {
        "q": "{{q}}",
        "sl": "{{from}}",
        "tl": "{{to}}",
        "hl": "{{to}}",
        "client": "gtx",
        "ie": "UTF-8",
        "oe": "UTF-8",
        "dt": ["bd", "rm", "t"],
        "dj": "1",
        "source": "icon"
      }
    },
    "audio": {
      "method": "get",
      "url": "{{url}}/translate_a/translate_tts",
      "params": {
        "q": "{{q}}",
        "tl": "{{from}}",
        "client": "gtx",
        "ie": "UTF-8"
      }
    }
  },
  "parser": {
    "phoneticSrc": "sentences.1.src_translit",
    "phoneticDest": "sentences.1.translit",
    "translation": "sentences.0.trans",
    "explain": "dict.0.pos/: /dict.0.terms[, ]"
  },
  "fromto": ["auto", "auto"]
}
```

### Template Layout

### Web Crawler

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development (web)
```
yarn run serve
```

### Compiles and minifies for production (web)
```
yarn run build
```

### Compiles and minifies for production (firefox)
```
yarn run build:firefox
```

### Compiles and auto reloads for development (firefox)
```
yarn run watch:firefox
```

### Strat a temporary browser for development (firefox)
```
yarn run webext:firefox
```

### Package a .zip extension file for publishing (firefox)
```
yarn run pack:firefox
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```
