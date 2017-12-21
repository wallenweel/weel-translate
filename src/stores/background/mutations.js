import merge from 'deepmerge'
import serviceHelper from '@/functions/serviceHelper'

export const mergeStorageState = (state, storage = {}) => {
  for (const [name, config] of Object.entries(storage)) {
    state[name] = merge(state[name], config, { arrayMerge: (des, src) => src })
  }
}

export const compileSourcePreset = (state) => {
  state.sources.compiled = serviceHelper(state.sources.preset)
}
