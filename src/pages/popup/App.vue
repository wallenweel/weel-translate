<template lang="pug">
  #app
    router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@include head;

body {
  background-color: $primary-color_lighter;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  background-color: hsl(0, 100%, 100%);

  height: auto;
  max-height: 48rem;
  width: 32rem;
  max-width: 32rem;

  margin: auto;
  overflow: hidden;
}
</style>
