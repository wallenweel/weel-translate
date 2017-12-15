import merge from 'deepmerge'

export const mergeStorageToState = (state, storage = {}) => {
  for (const [name, config] of Object.entries(storage)) {
    state[name] = merge(state[name], config, { arrayMerge: (des, src) => src })
  }
}

export const updateSettings = (state, payload) => {}
