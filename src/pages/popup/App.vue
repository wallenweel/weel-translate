<template lang="pug">
v-app
  //- v-navigation-drawer(app floating)
    v-list
      v-list-tile(v-for="item in items" :key="item.title" @click="")
        v-list-tile-action
          v-icon
            |{{ item.icon }}
        v-list-tile-content
          v-list-tile-title
            |{{ item.title }}
  v-toolbar(app)
  v-content
    v-container(fluid)
      router-view
  v-footer(app)
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      items: [
        { title: 'Dashboard', icon: 'dashboard' },
        { title: 'Account', icon: 'account_box' },
        { title: 'Admin', icon: 'gavel' }
      ]
    }
  }
}
</script>

<style lang="scss">
@include preset;

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
  // overflow: hidden;
}
</style>
