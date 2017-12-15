import { storage } from '@/globals'
import store from '@/stores/background'

export default () => {
  const {
    commit,
    state
  } = store
  store.watch(state => state.settings, (a, b) => {
    console.log(a, b)
  })
  console.log(state)
  // const {
  //   began = false, // storage is whether or not initialized
  //   settings,
  //   preferences,
  //   translation,
  //   sources
  // } = store.state

  // const [syncItems, localItems] = [[], []]

  // storage.sync.clear()
  // storage.sync.set({
  //   test: false
  // })
  storage.sync.get().then(config => {
    commit('storageGet', {
      test: 'test'
    })
    console.log(config)
  })
}
