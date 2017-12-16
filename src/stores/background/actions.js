import { storage } from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  MERGE_STORAGE_STATE,
  GET_LANGUAGE_LIST,
  COMPILE_SERVICE_SOURCES
} from '@/types'
// import * as mocks from '@/api/mocks'

const __ = {}

__[BACKGROUND_INITIALIZE] = ({ state, commit }) => {
  // storage.sync.set({
  //   test: false
  // })
  storage.sync.get(state.inStorage).then(all => {
    // merge storage to state
    commit(MERGE_STORAGE_STATE, all)

    commit(COMPILE_SERVICE_SOURCES)

    // console.log(state.api.google.parser(mocks['google']))
    // console.log(state.api.google.query.audio({ q: 'test', from: 'en', to: 'zh' }))
    console.log(JSON.stringify(state.api))

    // set success status
    state.initialized = true
  }, () => {
    // set success status
    state.initialized = false
  })
}

__[GET_LANGUAGE_LIST] = ({ state }, { emit }) => {
  // emit(serviceHelper({ state }))
}

export default __
