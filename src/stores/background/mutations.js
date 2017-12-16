import merge from 'deepmerge'
import serviceHelper from '@/functions/serviceHelper'
import {
  MERGE_STORAGE_STATE,
  COMPILE_SERVICE_SOURCES
} from '@/types'

const __ = {}

__[MERGE_STORAGE_STATE] = (state, storage = {}) => {
  for (const [name, config] of Object.entries(storage)) {
    state[name] = merge(state[name], config, { arrayMerge: (des, src) => src })
  }
}

__[COMPILE_SERVICE_SOURCES] = (state) => {
  state.api = serviceHelper(state.sources)
}

export default __
