<template>
  <div class="translation-result">
    <mdc-card class="_section" :wlt-id="layout.id">
      <div v-for="(row, n) in this.parseRows" :key="n"
        class="_row" :wlt-id="n">
        <template v-for="(value, i) in row">
          <voice-action-button class="_button" :key="`a_${i}`"
            v-if="isAction(value, 'voice')" :params="parseAction(value)">
          </voice-action-button>
          <pick-action-button class="_button" :key="`a_${i}`"
            v-else-if="isAction(value, 'pick')" :params="parseAction(value)">
          </pick-action-button>

          <span class="_span" :key="`s_${i}`" v-else
            :wlt-tag="layout.rows[n][i]">{{value}}</span>
        </template>
      </div>
    </mdc-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VoiceActionButton from '@/components/ActionButtonVoice.vue';
import PickActionButton from '@/components/ActionButtonPick.vue';
import { templateLayoutParser, paramsParser } from '@/functions';
import { popup as popupLayout } from '@/defaults/layouts/translation';
import debug from '@/functions/debug';

@Component({
  components: {
    VoiceActionButton,
    PickActionButton,
  },
})
export default class TranslationResult extends Vue {
  private layout: templatePreset = popupLayout;
  private result: SourcePreset['parser'] = {
    phonetic_src: 'transˈlāSHən',
    phonetic_dest: 'Fan Yi',
    translation: '翻译',
    explain: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  };

  private get parseRows(): templatePreset['rows'] {
    const [, rows] = templateLayoutParser(this.result, this.layout.rows);
    return rows!;
  }

  private isValue(value: string): boolean { return Object.values(this.result).includes(value); }
  private parseAction(value: string): null | { name: string, [param: string]: any } {
    if (!/<(.+)>/.test(value)) { return null; }

    const match = value.match(/[<](.+)[>]/);
    const [error, result, name] = paramsParser(match![1]);

    if (error !== null) {
      return { name: result };
    }

    return { name, ...result };
  }
  private isAction(value: string, name?: string): boolean {
    const action: null | any = this.parseAction(value);

    if (!action || !name) { return false; }

    return action.name === name;
  }
}
</script>

<style lang="scss">
.translation-result {
  padding: 0 16px;
  position: relative;
  ._section {
    margin: 16px 0;
    padding: 16px;
    ._row {
      display: flex;
      align-items: center;
      &:nth-child(1) {
        height: 0;
        display: flex;
        position: relative;
        .translation-action-pick {
          margin-top: 24px;
          margin-left: auto;
          margin-right: -8px;
        }
      }
      &:nth-child(2),
      &:nth-child(3) {
        font-size: .75rem;
      }
      &:nth-child(4) {
        font-weight: bolder;
        margin-top: 4px;
        padding-bottom: 8px;
      }
      &:nth-child(5) {
        color: val(--mdc-theme-text-secondary-on-light, #555555);
        font-size: 0.75rem;
        line-height: 1.35;
        border-top: 1px solid var(--mdc-theme-text-secondary-on-background, #999999);
        padding: 8px 0;
      }
    }

    ._button {
      &.translation-action-voice {
        height: 32px;
        width: 32px;
        margin-left: -8px;
        margin-right: 8px;
      }
    }
  }
}
</style>