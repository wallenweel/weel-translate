import merge from 'deepmerge'
import { storage } from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  MERGE_STORAGE_STATE,
  GET_LANGUAGE_LIST,
  STORAGE_TYPE_SET
} from '@/types'

const __ = {}

__[BACKGROUND_INITIALIZE] = ({ state, commit }) => {
  storage.sync.get(state.storage.sync).then(all => {
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

__[STORAGE_TYPE_SET] = ({ state }, { type, key }) => {
  storage[type].set({[key]: merge({}, state[key])}).then(
    // TODO: remove here
    () => {
      storage[type].get().then(all =>
        console.log(`storage.${type}.set success\n`, all))
    },
    error => {
      console.log(`storage.${type}.set fail\n`, error)
    }
  )
}

__[GET_LANGUAGE_LIST] = ({ state }, { payload: { id }, emit }) => {
  const api = state.api[id] || Object.values(state.api)[0]

  if (!api) {
    // TODO: add alert
    console.log('Must Supply One API Preset At Least!')
    return
  }

  emit(merge([], api.languages))

  state.settings = {
    test: 'emmm3'
  }
}

export default __
