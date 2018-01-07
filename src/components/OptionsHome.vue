<template lang="pug">
  v-layout(column style="overflow-y: auto;")
    v-parallax(src="/img/01.jpg" :height="180" style="min-height: 180px;")
      v-layout(column align-center justify-center)
        h1.white--text Weel Translate DIY
        h4.white--text You could modify some parts of this extension in here

    v-container
      v-subheader Documents
      v-expansion-panel(focusable)
        v-expansion-panel-content
          div(slot="header") 自定义翻译源 API （未支持加密的请求）
          v-card
            v-card-text(class="grey lighten-3")
              a(:href="document.api" target="_blank") {{ document.api }}
        v-expansion-panel-content
          div(slot="header") 自定义结果模板（只支持默认模板修改保存）
          v-card
            v-card-text(class="grey lighten-3")
              a(:href="document.api" target="_blank") {{ document.api }}

      v-subheader Questions & Answers
      v-expansion-panel(focusable)
        v-expansion-panel-content(v-for="(item, i) in questions" :key="i")
          div(slot="header") {{ `${i + 1}. ${item[0]}` }}
          v-card
            v-card-text(class="grey lighten-3") {{ item[1] }}
</template>

<script>
const questions = [
  [
    '为什么要提供自定义翻译源的功能，有什么好处吗？',

    '大部分的浏览器翻译扩展基本都使用是的第三方翻译接口，尤其是个人开发者的免费扩展。因此，这样的扩展程序' +
    '就会非常被动，需要在翻译源接口变动时跟进更新然后重新被 AMO 审核，耗费的时间精力无法有一个准确的预估，这对大多' +
    '数仅凭兴趣爱好的开发者（像是我）来说是非常困扰的，时常会有作者' +
    '在某个时期就弃坑了，然后在之后某次接口变动后彻底失去可用性（翻译源才是扩展的核心），所以，让用户' +
    '可以在翻译源出现问题时快速调整配置数据让扩展重新可用就显得很重要了，这么做对开发者和用户都是有明显的好处的。'
  ],
  [
    '我听说过这种情况，但是为什么大多数扩展并没有这么做呢？',

    '其他人的原因我不是很清楚，这个扩展现在是 V2.0 版本，它跳过 V1.0 是因为我一开始也没打算做到这种程度的定制，因为' +
    '这会让扩展变得复杂和不可控，尤其在它还是一个没有什么实质回报的情况下，作者很难会去付出过多的精力做各种设计' +
    '和验证来保证程序不出错，这个扩展现阶段也是这样，它只做了基本的内容检查和提醒，用户需要遵循一些简单的约定来让它能够' +
    '良好运行。当然，还有一点就是，对于我这样并业余开发者，无法长期维护项目的人来说，采用这种方案' +
    '是一种可以续命的有效做法 😏。'
  ],
  [
    '这样做能保证扩展长久工作么？',

    '一般来讲，只要（火狐）浏览器不再出现 Quantum 版这种剧烈的技术迭代，扩展的主程序依然可以继续运行，最坏的情况只是' +
    '扩展内置的翻译源配置不可用（像是最近这次有道 API 转为付费更换接口），只需要在安装扩展后修改或使用其它人提供的有效' +
    '配置即可。'
  ],
  [
    '我是一个普通用户，没有这方面的知识，可以用这个扩展吗？',

    '可以，扩展本身是开箱即用的，自带几款作者配置的翻译源，可以随意调整删改。'
  ],
  [
    '改错东西或者想恢复默认配置怎么办？',

    '如果没有影响到扩展本身的运行，只需要到工具栏的弹出面板，也就是主面板，找到 "设置" 点击最下面的 "重置" 按钮即可；' +
    '如果程序已经无法正常运行了，也只需要卸载然后重新安装就行了。'
  ],
  [
    '那我该到哪里来找其它翻译源配置呢？',

    '现阶段还没有确定一个安全且方便的方式来供大家来分享，也许之后会利用 Github 的 Wiki 或者 Gist 功能来管理它们。'
  ],
  [
    '我很喜欢这个扩展，如何支持它的发展呢？',

    '如果有前端开发经验的话，例如 Javascript(es6)、Vue2 这样的开发能力可以 Fork 此项目然后提交 PR 来贡献代码；或者' +
    '只是单纯认同我的这项工作的话可以在 Popup 主面板找到 "打赏" 的部分给这个项目一点小酬劳，当然，随意就好，主要是想在' +
    '不长的编程学习后也想像其它人一样有个能够值得被打赏的项目，至于为什么金额是 2 元，其实很简单，因为现在是 V2 版了（笑。'
  ],
  [
    '作者接下来的打算是什么，将来也会弃坑吗？',

    '我只是个习惯于设想最坏结果的家伙而已，这个项目是完全自由的 MIT 协议，任何人都可以任意修改或重新发布。加下来我自己会继续' +
    '学习和制作过去想要从事的漫画工作，写出有趣的故事，在此说出来也算是加深决心了。'
  ]
]

export default {
  name: 'OptionsHome',
  data () {
    return {
      document: {
        api: 'https://github.com/wallenweel/weel-translate#自由定制添加翻译源api',
        template: 'https://github.com/wallenweel/weel-translate#自定义翻译结果模板实验性'
      },
      questions
    }
  }
}
</script>
