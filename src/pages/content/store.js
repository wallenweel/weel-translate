import Weelx from '@/functions/Weelx'
import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

const store = new Weelx({
  state: {
    test: false,

    container: null, // container element of float action
    targets: [], // contains all <v> tag's details

    current_template_id: 'default'
  },
  mutations: {
    templateLoaded (state, { container, targets }) {
      state.container = container
      state.targets = targets
    },
    getSelection (state, selection) {
      state.selectionText = selection.toString()
      state.selectionRect = selection.getRangeAt(0).getBoundingClientRect()
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
