import serviceHelper from '@/functions/serviceHelper'
import templateHelper from '@/functions/templateHelper'

export const mergeStorageState = (state, storage = {}) => {
  for (const [name, config] of Object.entries(storage)) {
    if (
      typeof config === 'object' &&
      Object.keys(config).includes('compiled')
    ) {
      delete config.compiled
    }

    state[name] = config
  }
}

export const compileSourcesPreset = (state) => {
  state.sources.compiled = serviceHelper(state.sources.preset)
}

export const compileTemplatesPreset = (state) => {
  state.templates.compiled = templateHelper(state.templates.preset)
}
