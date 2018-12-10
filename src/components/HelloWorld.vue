<template>
  <div class="hello">
    <div class="hello__hero">
      <mdc-layout-grid>
        <mdc-layout-cell desktop="12" tablet="8" phone="4">
          <img class="hello__logo" src="../assets/logo.png" alt="Vue MDC Adapter">
          <h1 class="hello__title">{{ title }}</h1>
          <p class="hello__blurb">
            <a href="https://github.com/webdenim/vue-cli-plugin-material" target="_blank" rel="noopener">vue-cli-plugin-material</a> is a Vue CLI plugin to help you get started with Material Design Components for Vue.js. It's created and maintained by <a href="https://twitter.com/rustemgareev" target="_blank" rel="noopener">Rustem Gareev</a> at <a href="https://www.webdenim.io/" target="_blank" rel="noopener">Webdenim</a>.
            <a href="https://github.com/rustemgareev" target="_blank" rel="noopener">Follow me on GitHub</a> to get news and updates on other Vue.js and Material Design-related stuff.
          </p>
        </mdc-layout-cell>
      </mdc-layout-grid>
    </div>

    <div class="hello__content">
      <mdc-layout-grid>
        <mdc-layout-cell desktop="6" tablet="4" phone="4">
          <h3 class="hello__subtitle">Vue MDC Adapter Links</h3>
          <ul class="hello__links">
            <li v-for="(link, idx) in vmaLinks" :key="idx">
              <a :href="link.url" target="_blank" rel="noopener">{{ link.title }}</a>
            </li>
          </ul>
        </mdc-layout-cell>

        <mdc-layout-cell desktop="6" tablet="4" phone="4">
          <h3 class="hello__subtitle">Material Components Links</h3>
          <ul class="hello__links">
            <li v-for="(link, idx) in mdcLinks" :key="idx">
              <a :href="link.url" target="_blank" rel="noopener">{{ link.title }}</a>
            </li>
          </ul>
        </mdc-layout-cell>
      </mdc-layout-grid>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    props: {
      title: String,
      vmaLinks: Array,
      mdcLinks: Array
    }
  }
</script>

<style lang="scss">
  // First, set the value for variable
  $mdc-layout-grid-max-width: 800px;

  // Then, import required files
  @import "@material/layout-grid/mdc-layout-grid";
  @import "@material/rtl/mixins";
  @import "@material/theme/color-palette";
  @import "@material/theme/mixins";

  .hello {
    &__hero {
      @include mdc-theme-prop(color, text-primary-on-dark);

      padding: 2.5rem 0;
      background-color: $material-color-grey-900;

      @media (min-width: 480px) {
        text-align: center;
      }

      a {
        @include mdc-theme-prop(color, text-primary-on-dark);
      }
    }

    &__logo {
      width: 144px;

      @media (min-width: 840px) {
        width: 192px;
      }
    }

    &__title {
      margin-top: 0;
      font-size: 2.125rem;
      font-weight: 400;
      line-height: 2.625rem;
    }

    &__blurb {
      line-height: 1.5rem;
    }

    &__content {
      padding: 2.5rem 0;      
    }

    &__subtitle {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.75rem;
    }

    &__links {
      @include mdc-rtl-reflexive-box(padding, left, 0);

      list-style: inside disc;

      li {
        padding-bottom: .5rem;
      }

      a {
        @include mdc-theme-prop(color, text-primary-on-background);
      }
    }
  }
</style>
