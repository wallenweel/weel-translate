<template>
  <div class="app">
    <hello-world class="app__hello"
      title="Welcome to your Vue MDC Adapter App"
      :vmaLinks="vmaLinks"
      :mdcLinks="mdcLinks">
    </hello-world>
    <mdc-icon icon="favorite"></mdc-icon>
  </div>
</template>

<script>
  import HelloWorld from '@/components/HelloWorld.vue'

  export default {
    data () {
      return {
        vmaLinks: [
          {
            title: 'Documentation',
            url: 'https://stasson.github.io/vue-mdc-adapter'
          },
          {
            title: 'GitHub',
            url: 'https://github.com/stasson/vue-mdc-adapter'
          },
          {
            title: 'Twitter',
            url: 'https://twitter.com/vuemdc'
          },
          {
            title: 'Chat',
            url: 'https://gitter.im/vue-mdc-adapter/Lobby'
          }
        ],
        mdcLinks: [
          {
            title: 'Documentation',
            url: 'https://material.io/components/web/'
          },
          {
            title: 'GitHub',
            url: 'https://github.com/material-components/material-components-web'
          },
          {
            title: 'Guidelines',
            url: 'https://material.io/guidelines'
          },
          {
            title: 'Awesome Material Components',
            url: 'https://github.com/webdenim/awesome-material-components'
          }
        ]
      }
    },
    components: { HelloWorld }
  }
</script>

<style lang="scss">
  // First, set the value for variable
  $mdc-typography-font-family: "Roboto Mono", monospace;

  // Then, import required files
  @import "@material/typography/mixins";

  html {
    width: 100%;
    height: 100%;
  }

  body {
    @include mdc-typography(body2);

    width: 100%;
    min-height: 100%;
    margin: 0;
  }
</style>
