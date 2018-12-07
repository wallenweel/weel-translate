<template lang="pug">
  #app
    #nav
      router-link(to="/")
        v-btn Home
      router-link(to="/about")
        v-btn About
    router-view
</template>

<style lang="stylus">
html
  height 480px
  width 320px

body
  height inherit
  width inherit

#app
  font-family 'Roboto', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983
</style>
