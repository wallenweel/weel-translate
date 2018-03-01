# Weel Translate 2 
[![Dependency Status](https://david-dm.org/wallenweel/weel-translate.svg)](https://david-dm.org/wallenweel/weel-translate)
[![Build Status](https://travis-ci.org/wallenweel/weel-translate.svg)](https://travis-ci.org/wallenweel/weel-translate)

> 一款 MD 风格使用新版火狐扩展接口的翻译工具，支持自定义配置翻译服务源。

## 小提示 ✨

- **翻译语言** 中的 **自动** 为支持此语言参数的翻译源完成的，不过例如 google 不支持 **自动语言** 的发音，所以需要手动选择正确的目标语言
- 因为一些支持 HTML 的富文本编辑器会用到 iframe 元素保存内容，在 v2.3.2 之后默认在 iframe 中不启用，可到 **设置** 中手动开启
- 扩展自带中国版和国际版的 Google 翻译源，前者大陆地区偶尔会有延迟但可用且推荐使用，后者需要先开启外网代理
- 如果遇到新安装扩展或者升级浏览器一些功能不可用的情况可以在 **设置** 中重置扩展数据（偶尔有邮件提到这个问题，我自己没有遇到过所以不清楚缘故，猜测是浏览器初始化扩展时出现意外）



## 界面 i18n 翻译

- English
- Chinese Simplified
- Japanese (thanks ScratchBuild)


## 自由定制/添加翻译源（API）

> Weel Translate 2 采取以 JSON 配置来约定翻译源跟内部程序的数据交互，扩展内置的配置可以自由删改或者新建其它的配置。

### 操作方法
1. 打开浏览器的 **附加组件** 页面，`about:addons` 为 Firefox 的地址
2. 找到 **Weel Translate** 一项，点击 **选项**
3. 在打开的页面左侧找到 **服务源 API**

### 示例说明（仅作演示无法复制运行）:
```js
"* 必需项"
"~ 推荐项"
"? 未使用"

/**
 * JSON 格式
 * 实际调整可参考内置的 APIs
 */
{
  *"id": "google", // 翻译源 ID，不可重复，创建后不建议修改
  ~"name": "Google", // 翻译源的名称，字符随意，例如： "网易·有道"
  ?"icon": "", // base64 图片数据，当前未在程序中使用

  // 翻译源地址，主要用于提供变量，不用的话可省略
  ~"host": "https://translate.google.com",

  // 定义一些响应内容的设置
  ~"response": {
    ~"type": "json" // or "text", response data type
  },

  // 查询对象
  *"query": {
    // 文本翻译的请求
    *"text": {
      ~"method": "GET", // 请求方式，GET 或者 POST，默认为 GET

      // 如果 "method" 为 POST, 可以自定义一个常规的"请求头"
      // @see https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers
      // 请求头必须是一个对象字面量
      // 留空默认: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      ~"header": {},

      // 请求地址，变量 {{host}} 获取 "host": "https://translate.google.com"
      // 如果 "method" 为 GET 的话，可以只提供查询地址 "url": "url?[,param]"
      *"url": "{{host}}/translate_a/single",

      // 查询参数，"method" 为 GET 的话支持字符串形式 "q={{q}}&from={{from}}&..."
      // 此外只支持二位数组，[,[key, value]]
      ~*"params": [
        ["q", "{{q}}"], // {{q}} 获取需要翻译的文本
        ["sl", "{{from}}"], // {{from}} 为源语言的 code
        ["tl", "{{to}}"], // {{to}} 为目标语言的 code

        // 如果存在多条键名相同，可使用数组作为 "value"
        ["test", ["foo", "bar"]],

        // 无限制数量，不过尽量只添加需要的参数
        ["other", "param"]
      ]
    },

    // 发音的请求，不必使用同一翻译源的发音服务，可以搭配其它服务源的
    ~"audio": {
      ?"method": "GET", // 默认 GET，当前未支持 POST
      ?"header": {}, // 当前未支持

      // 发音请求地址
      *"url": "{{host}}/translate_tts",

      // 与文本翻译部分类似
      ~*"params": [
        ["q", "{{q}}"], // 获取发音文本

        // 获取发音源语言，根据服务源的情况可能不稳定，
        // 可以不使用变量来固定某一语言的发音
        ["tl", "{{from}}"]
      ]
    }
  },

  // 翻译结果解析，实例以 google translate api 为例
  // 为了避免安全审核问题，现在采用的是占位字符来解析获取对应结果
  // 当前版本只有演示的四个关键字可用
  *"parser": {
    // 这里返回的 json 结果中 'sentences' 是一个对象数组，需要
    // 内容 'trans' 在对象内部，通过圆括号来索引所有数组元素中对象属性
    *"translation": "sentences(trans)",

    // '$' 为索引 'sentences' 这个数组的倒数第一个元素
    // 类似的，通过 '$$' 两个 $ 来索引倒数第二个，以此类推
    // 当然可以这样 'sentences.0.translit' 数字索引正常顺序的元素
    ~"phonetic_src": "sentences.$.src_translit", // 源音标
    ~"phonetic_dest": "sentences.$.translit", // 目标音标

    // 这里的 `(pos, terms)` 类似于 'translation'，但是它可以获取更多
    // 的键值，可以使用任何 "." 点字符以外符号替代 ", " 来作为结果的分隔符
    // 例如：" " 空格、"&"、"/"，"////" 四个正斜杠可以作为 "\n" 换行符
    ~"explain": "dict(pos, terms)"
    ~?"explain": "dict(,)" // 可以只使用符号
    ~"explain": "dict.foobar(pos.0.foo, terms.1.bar)" // 支持用点操作符深度索引
  }

  // [源语言, 目标语言]
  // 此项可选，但非常建议使用，如果未提供此项的话，默认两者都是语言列表的首个
  ~*"fromto": ["en", "zh-cn"],
  
  // @see `[repo]/src/api/languages.json` 这里是默认支持的语言列表
  // "include" 用于只包含一些语言，建议使用，因为默认载入所有的语言会造成轻微的启动迟缓
  ~*"include": ["en", "zh-cn", "ja"], // 数组形式，推荐使用
  // also
  ~"include": "en/zh-cn/ja", // 字符串形式，使用 '/' 来分隔

  // 通常各个翻译源的语言码并不统一，需要对应修改，比如 'ja' -> 'jp'
  // 使用 `:>` 字符来在编译时对应修改成正确的语言码
  ~*"include": ["en", "zh-cn:>zh-CHS", "ja:>jp"],
  ~"include": "en/zh-cn:>zh-CHS/ja:>jp",

  // 使用方法和 "include" 类似，如果使用此项将忽略 "include" 的配置内容
  ~"exclude": ["fr", "zh"],

  // 如果默认的语言列表未包含所需语言，或者想要自定义语言列表（使用 "include": [] 来屏蔽所有默认语言)
  // 可以用下面的形式来定制
  // 提示：如果定制语言，无需再额外将它们的语言码添加到 "include" 中
  ~"languages": [{
    *"code": "zh", // 语言码
    *"name": "Chinese", // 语言名称
    ~*"locale": "中文" // 语言名称翻译
  }, {
    *"code": "jp",
    *"name": "Japanese",
    ~*"locale": "日文"
  }]
}

```

### 从其它已有的服务源继承配置
```js
// 使用数组来定义继承配置，数组的最后一个对象元素为新的配置，它们会被深度
// 覆盖到前面的父级配置中
[
  // 父级 API 的 ID
  *"google",
  {
    *"id": "google_cn", // 新配置的 ID，不可与其它配置相同

    // 需要覆盖的项
    ~"url": "https://translate.google.cn",
    ~"include": ["en", "ja:>jp"]
    // 更多
  }
]
```


## 自定义翻译结果模板（实验性）

> 并未实现（其实基本已经写好了），现阶段只计划支持网页中的 **浮动面板和按钮**，通过 `content script` 的载入。实现方式类似 vue 的单文件模板，使用 `eval(vue2 + vuex)` 的方式直接渲染注入到目标网页中。不确定 AMO 对这种做法的审核容忍度，原本的方案是像 **API 模板** 那样约定数据格式来内部编译，但时间精力考虑下做了保留处理并切换到现在的方案，个人觉得这样对有这方面需求的人来说更方便友好一些，只是看到 AMO 愈发保（Yan）守（Ge）的态度和一长串的 lint 警告有些心冷 ＞﹏＜。。所以，先通过审核再说。

### 示例说明（仅作演示无法复制运行）
```html
<!-- 解析器，可选，允许模板可以定制和覆盖 API 模板中的 "parser" -->
<!-- !!当前版本未实现!! -->
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

<!-- 模板，必需，规则基本与 Vue 相同 -->
<!-- "id" 定义模板 ID，"name" 定义名称，当前未使用 -->
<template id="default" name="">
  <!-- 必须有且只能有一个根元素 -->
  <div>
    <!-- 如果熟悉 Vue 字符串模板的话，这里没有任何不同 -->
    <h1>{{`${foo} ${bar}`}}</h1>
    <!-- 输出 Hello World -->
  </div>
</template>

<!-- 脚本，可选 ?，通过一个方法包裹返回 Vue 实例的 "options" 对象 -->
<script>
  // 必须用函数方法来包裹，这里使用的是 ES6 的箭头函数
  // 返回的必须是实例化 Vue 的合法选项对象
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

<!-- 样式，可选，会使用 tab.injectCSS() 来注入到目标网页 -->
<!-- 可用 "scoped" 属性来给 CSS 规则添加作用域避免污染目标网页的内容 -->
<!-- 如果 "scoped" 留空，默认生成一个基于时间戳的伪 hash 字符串 [data-47a39a3b] -->
<!-- 可通过 scoped="demo" 来自定义作用域名称，示例将输出 [data-demo] h1 { color: red; } -->
<style scoped>
  /* 如果样式规则中出现 [scoped] 字样它将会替换成正确的内容，如下 */
  /* [data-47a39a3b], [data-47a39a3b] * { color: blue; } */
  [scoped], [scoped] * {
    /* 建议使用此规则来覆盖屏蔽目标网页的样式，但这样会需要手动还原一些默认样式 */
    /* 比如 a 标签的字体颜色和下划线都会被重置消失 */
    all: initial;
    font-family: Arial, sans-serif;
  }

  /* 输出: [data-47a39a3b] h1 { color: red; } */
  h1 {
    color: red;
  }
</style>
```


## 感谢这些使用到的开源项目 👍

+ [Vue2](https://github.com/vuejs/vue)
+ [Vuetify](https://github.com/vuetifyjs/vuetify)
+ [Vuex](https://github.com/vuejs/vuex)
+ [Vue Router](https://github.com/vuejs/vue-router)
+ [Material Desigon Icons](https://github.com/google/material-design-icons/)
+ ...

## 项目构建命令

``` bash
# 按装依赖
npm install

# 同上，推荐
yarn

# 开启一个 web 服务器 localhost:3030，用于使用 vue 开发工具编写页面
npm run dev:server

# 开发环境下编译并监听源代码
npm run dev:watch

# 开发环境下打开一个临时的浏览器
npm run dev:ext

# 发布环境编译（压缩）
npm run build:pro 

# 打包编译完成的扩展资源
npm run build:ext

# 开发环境下编译并打包扩展
npm run release

```
