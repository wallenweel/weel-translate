import merge from 'deepmerge'
import { storage } from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  MERGE_STORAGE_STATE,
  GET_LANGUAGE_LIST
} from '@/types'

const __ = {}

__[BACKGROUND_INITIALIZE] = ({ state, commit }) => {
  storage.sync.get(state.storageSync).then(all => {
    // merge sync storage to state
    commit(MERGE_STORAGE_STATE, all)

    state.initialized.storageSync = true
  }, () => { state.initialized.storageSync = false })

  storage.local.get(state.storageLocal).then(all => {
    // merge local storage to state
    commit(MERGE_STORAGE_STATE, all)

    state.initialized.storageLocal = true
  }, () => { state.initialized.storageLocal = false })
}

__[GET_LANGUAGE_LIST] = ({ state }, { payload: { id }, emit }) => {
  const api = state.api[id] || Object.values(state.api)[0]

  if (!api) {
    // TODO: add alert
    console.log('Must Supply One API Preset At Least!')
    return
  }

  emit(merge([], api.languages))
}

export default __
