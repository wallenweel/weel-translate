<template lang="pug">
  v-layout(wrap column)
    v-alert(
      style="margin: 0 0; width: 100%;"
      type="info" :value="true"
      )
      |{{ i18n.getMessage('DONATE_INFO') }}
    blockquote.blockquote
      |{{ i18n.getMessage('DONATE_HEADING', 2) }}
    h4(style="text-align: center;").subheading (/ω＼*)……… (/ω•＼*)

    v-container
      v-layout(column :class="$style.wrap")
        v-card(width="180px" flat :class="$style.card")
          v-card-media(
            class="white--text"
            height="160px"
            contain
            src="/img/wx.png"
            )
          v-card-title(primary-title)
            h2.title.green--text Wechat
            v-spacer
            h2.title 2 RMB
        
        v-card(width="180px" flat :class="$style.card")
          v-card-media(
            class="white--text"
            height="160px"
            contain
            src="/img/ali.png"
            )
          v-card-title
            h2.title.blue--text Alipay
            v-spacer
            h2.title 2 RMB
</template>

<script>
export default {
  name: 'PopupAbout',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" module>
.wrap {
  align-items: center;
}

.card {
  margin-bottom: 12px;
  padding-top: 16px;
  :gloabl {
    .card__title {
      text-align: center;
    }
  }
}
</style>

