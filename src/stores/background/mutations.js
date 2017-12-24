import merge from 'deepmerge'
import serviceHelper from '@/functions/serviceHelper'

export const mergeStorageState = (state, storage = {}) => {
  for (const [name, config] of Object.entries(storage)) {
    state[name] =
      typeof config === 'object'
      // deepmerge make string to object, for that
      // just use deepmerge with array and object.
      ? merge(state[name], config, { arrayMerge: (des, src) => src })
      : config
  }
}

export const compileSourcePreset = (state) => {
  state.sources.compiled = serviceHelper(state.sources.preset)
}
