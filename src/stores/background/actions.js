import { storage } from '@/globals'
import serviceHelper from '@/functions/serviceHelper'
import {
  BACKGROUND_INITIALIZE,
  MERGE_STORAGE_STATE,
  GET_LANGUAGE_LIST
} from '@/types'

const __ = {}

__[BACKGROUND_INITIALIZE] = ({ state, commit }) => {
  storage.sync.get(state.inStorage).then(all => {
    // merge storage to state
    commit(MERGE_STORAGE_STATE, all)

    console.log(process.env)

    // set success status
    state.initialized = true
  }, () => {
    // set success status
    state.initialized = false
  })
}

__[GET_LANGUAGE_LIST] = ({ state }, { emit }) => {
  emit(serviceHelper({ state }))
}

export default __
