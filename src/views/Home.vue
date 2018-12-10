<template>
  <div class="home">
    <hello-world class="app__hello"
      title="Welcome to your Vue MDC Adapter App"
      :vmaLinks="vmaLinks"
      :mdcLinks="mdcLinks"
    ></hello-world>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  private vmaLinks = [
    {
      title: 'Documentation',
      url: 'https://stasson.github.io/vue-mdc-adapter',
    },
  ];
  private mdcLinks = [
    {
      title: 'Documentation',
      url: 'https://material.io/components/web/',
    },
  ];
}
</script>
