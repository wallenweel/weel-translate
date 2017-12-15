import { storage } from '@/globals'
import merge from 'deepmerge'

export default (store) => {
  const {
    commit,
    state
  } = store

  store.watch(state => state.settings, (curr, prev) => {
    console.log(curr, prev)
  })
  console.log('state.merged', state.merged)

  console.log(merge({
    test: [true]
  }, {
    test: [false]
  }, {
    arrayMerge: (des, src) => src
  }))

  // storage.sync.clear()
  // storage.sync.set({
  //   settings: {
  //     test: true
  //   }
  // })
  storage.sync.get([ 'settings', 'preferences', 'translation', 'sources' ])
  .then(all => {
    console.log('all', all)
    commit('mergeStateWithStorage', all)
  })
}
