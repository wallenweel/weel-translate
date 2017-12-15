import merge from 'deepmerge'
import {
  MERGE_STORAGE_STATE
} from '@/types'

const __ = {}

__[MERGE_STORAGE_STATE] = (state, storage = {}) => {
  for (const [name, config] of Object.entries(storage)) {
    state[name] = merge(state[name], config, { arrayMerge: (des, src) => src })
  }
}

export default __
