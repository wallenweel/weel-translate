<template>
  <div class="view-preference">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">
        If changes got anything wrong, please click "reset" button.
        <!-- Changes are not saved automaticly, click "Save" button to validate. -->
      </mdc-text>
    </mdc-layout-grid>

    <mdc-layout-grid class="-options">
      <mdc-layout-cell class="-row">
        <mdc-headline>Interface</mdc-headline>
        <mdc-subheading>UI Languages</mdc-subheading>
        <!-- v-model="locale" -->
        <mdc-radio :picked="locale" @change="handleLocale"
          v-for="(lang, n) in locales" :key="n"
          name="ui-language" :value="lang.code" :label="$t(lang.locale)"
        />
      </mdc-layout-cell>

      <mdc-layout-cell class="-row" v-for="(item, i) in items" :key="`item_${i}`">
        <preference-option class="-option" :wl-value="item.value"
          :values="values" :item="item" :key="`opt_${i}`" />

        <template v-if="!!item.appends" v-for="(append, n) in item.appends">
          <preference-option class="-option" :wl-value="append.value"
            :values="values" :item="append" :key="`opt_${n}`" />
        </template>
      </mdc-layout-cell>

      <mdc-layout-cell class="-row">
        <mdc-headline>Network</mdc-headline>
        <mdc-subheading>Request Timeout (in seconds)</mdc-subheading>
        <mdc-slider min=0 max=120 step=10 display-markers v-model="timeoutValue" />
      </mdc-layout-cell>
    </mdc-layout-grid>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import PreferenceOption from '@/components/PreferenceOption.vue';
import debug from '@/functions/debug';

const __ = namespace('preference');

@Component({
  components: {
    PreferenceOption,
  },
})
export default class PreferenceView extends Vue {
  // TODO: add these two into action
  // private locale: string = 'en';
  private timeoutValue: number = 20;

  private values: any = {
    theme: null,
    fabEnable: null,
    fabPosition: null,
    fapEnable: null,
    fapPosition: null,
    fapPositionEdge: null,
    contextMenuEnable: null,
  };

  @__.State private locale!: Language['code'];
  @__.State private locales!: Language[];

  @__.Getter private options!: any;

  @__.Action('save') private saveOption!: any;

  private items: any = [
    {
      headline: 'Theme Color',
      type: 'radio',
      name: 'theme-color',
      values: [['Light', 'light'], ['Dark', 'dark']],
      value: 'theme',
    },
    {
      headline: 'Float Action Button',
      type: 'checkbox',
      label: 'Enable FAB',
      value: 'fabEnable',
      appends: [
        {
          subheading: 'Appearance Position',
          type: 'radio',
          name: 'fab-position',
          values: [['After', 'after'], ['Center', 'center'], ['Follow', 'follow']],
          value: 'fabPosition',
        },
      ],
    },
    {
      headline: 'Float Action Panel',
      type: 'checkbox',
      label: 'Enable FAP',
      value: 'fapEnable',
      appends: [
        {
          subheading: 'Appearance Position',
          type: 'radio',
          name: 'fap-position',
          values: [['Center', 'center'], ['Follow', 'follow'], ['Edge', 'edge']],
          value: 'fapPosition',
        },
        {
          subheading: 'Edge Appearance Position',
          type: 'radio',
          name: 'fap-position-edge',
          values: [
            ['Top Left', 'tl'], ['Top Center', 'tc'], ['Top Right', 'tr'],
            ['Bottom Left', 'bl'], ['Bottom Center', 'bc'], ['Bottom Right', 'br'],
          ],
          value: 'fapPositionEdge',
        },
      ],
    },
    {
      headline: 'Context Menu Trigger',
      type: 'checkbox',
      label: 'Enable Context Menu',
      value: 'contextMenuEnable',
    },
  ];

  private created() {
    debug.log(JSON.stringify(this.options));
    Object.assign(this.values, this.options);

    for (const k of Object.keys(this.values)) {
      this.$watch(`values.${k}`, (val, old) => {
        this.saveOption({ [k]: val });
      });
    }
  }

  private handleLocale(v: any) {
    debug.log('cc', this);
  }
  // @Watch('locale')
  // private onLocale(val: string) {
  //   this.$i18n.locale = val;
  // }
}
</script>

<style lang="scss">
.view-preference {
  .-banner {
    background-color: var(--mdc-theme-primary, #6200ee);
    color: var(--mdc-theme-text-primary-on-dark, #ffffff);
    padding: 0 16px 16px;
  }

  .mdc-headline,
  .mdc-subheading {
    width: 100%;
    margin: 8px 0;
    flex-shrink: 0;
  }
  .mdc-headline {
    border-radius: 0 16px 16px 0;
    background-color: var(--mdc-theme-primary, #6200ee);
    color: var(--mdc-theme-text-primary-on-dark, #ffffff);
    font-size: 1rem;
    position: relative;
    &::before {
      content: "";
      background-color: var(--mdc-theme-primary, #6200ee);
      height: 100%;
      width: 16px;
      margin: auto;
      left: -16px;
      top: 0;
      bottom: 0;
      position: absolute;
      display: block;
    }
  }
  .mdc-subheading {
    font-size: .75rem;
  }

  .-options {
    label {
      font-size: .75rem;
    }

    .-row {
      padding: 0 16px 16px;
    }

    .-option {
      flex-wrap: wrap;
      display: flex;

      &[wl-value="fapPositionEdge"] {
        .mdc-form-field {
          width: 50%;
        }
      }
    }
  }
}
</style>
