<template>
  <div class="translation-result">
    <transition name="fade">
      <mdc-card class="_section" :data-id="layout.id" v-if="has">
        <div class="_row"
          v-for="(row, n) in this.parseResultRows" :key="n"
          :data-row="n + 1"
        >
          <template v-for="(value, i) in row">
            <voice-action-button class="_button" :key="`a_${i}`"
              v-if="isAction(value, 'voice')"
              :params="parseAction(value)"
            />
            <pick-action-button class="_button" :key="`a_${i}`"
              v-else-if="isAction(value, 'pick')" :params="parseAction(value)"
            />

            <span class="_span" :key="`s_${i}`" v-else
              :data-tag="layout.rows[n][i]"
            >{{ value === '__unfound__' ? $t(value) : value }}</span>
          </template>
        </div>
      </mdc-card>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VoiceActionButton from '@/components/ActionButtonVoice.vue';
import PickActionButton from '@/components/ActionButtonPick.vue';
import { templateLayoutParser, stringParamsParaser, istype } from '@/functions';
import debug from '@/functions/debug';

@Component({
  components: {
    VoiceActionButton,
    PickActionButton,
  },
})
export default class TranslationResult extends Vue {
  // private result: SourcePreset['parser'] = {
  //   phonetic_src: 'transˈlāSHən',
  //   phonetic_dest: 'Fan Yi',
  //   translation: '翻译',
  //   explain: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  // };

  @Prop(Object) private result!: translationResult;
  @Prop(Boolean) private has!: boolean;
  @Prop(Object) private layout!: templatePreset;

  private get parseResultRows(): templatePreset['rows'] {
    if (!this.layout.id) { return []; }

    const [error, rows] = templateLayoutParser(this.result, this.layout);
    debug.log(error, rows);
    return rows!;
  }

  private isValue(value: string): boolean { return Object.values(this.result as object).includes(value); }
  private parseAction(value: string): null | { name: string, [param: string]: any } {
    if (!/<(.+)>/.test(value)) { return null; }

    const match = value.match(/[<](.+)[>]/);
    const [error, result, name] = stringParamsParaser(match![1]);

    if (error !== null) {
      return { name: result as string };
    }

    return { name, ...result as object };
  }
  private isAction(value: string, name?: string): boolean {
    const action: null | any = this.parseAction(value);

    if (!action || !name) { return false; }

    return action.name === name;
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.translation-result {
  padding: 0 16px;
  position: relative;

  ._section {
    margin: 16px 0;
    padding: 16px;

    &[data-id="standard"] {
      ._row {
        display: flex;
        align-items: center;
        &[data-row="1"] {
          height: 0;
          display: flex;
          position: relative;
          .translation-action-pick {
            margin-top: 24px;
            margin-left: auto;
            margin-right: -8px;
          }
        }
        &[data-row="2"],
        &[data-row="3"] {
          font-size: 12px;
        }
        &[data-row="4"] {
          font-weight: bolder;
          margin-top: 4px;
          padding-bottom: 8px;
        }
        &[data-row="5"] {
          color: val(--mdc-theme-text-secondary-on-light, #555555);
          font-size: 12px;
          line-height: 1.35;
          border-top: 1px solid var(--mdc-theme-text-secondary-on-background, #999999);
          padding: 8px 0;
        }
      }
    }
    
    &[data-id="simple"] {
      ._row {
        display: flex;
        align-items: center;
        &[data-row="1"] {
          height: 0;
          display: flex;
          position: relative;
          .translation-action-pick {
            margin-top: 24px;
            margin-left: auto;
            margin-right: -8px;
          }
        }
        &[data-row="2"] {
          font-size: 12px;
        }
        &[data-row="3"] {
          font-weight: bolder;
          margin-top: 4px;
          padding-bottom: 8px;
        }
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
