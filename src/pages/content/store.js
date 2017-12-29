import Weelx from '@/functions/Weelx'
import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

const store = new Weelx({
  state: {
    test: false,

    current_template_id: 'default'
  },
  mutations: {
    test (state) {
      console.log(state)
      state.current_template_id = 'test'
    }
  },
  actions: {
    [INITIAL_FROM_BACKGROUND] ({ state }) {
      return sendMessage(INITIAL_FROM_BACKGROUND)
      .then(({
        templates,
        preferences
      }) => Object.assign(state, {
        templates,
        preferences
      }), () => false)
    }
  }
})

export default store
