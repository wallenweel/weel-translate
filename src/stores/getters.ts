import { Getter } from 'vuex';
import { presetInvoker } from '@/functions';
import { State, State as RootState } from './index';

type G = Getter<State, RootState>;

export const resultLayout: G = (state): LayoutPreset => {
  const {
    template_layouts: presets,
    template_enabled_sources: sources,
  } = state.storage;
  const id = sources[state.translation.source.id][0];
  return presetInvoker(id, presets)[1] as LayoutPreset;
};
