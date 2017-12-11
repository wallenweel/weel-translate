import { onMessage } from '@/functions/runtime'
import {
  STORAGE_CHANGE
} from '@/actions/types'

const {
  storage
} = window.browser

// storage.sync.clear()
storage.sync.set({
  test: true
})
storage.sync.get().then(res => {
  console.log(res)
})

onMessage.addListener((message, from, send) => {
  const {
    type,
    payload
  } = message

  switch (type) {
    case STORAGE_CHANGE:
      storage.sync.set(payload)
      send(payload)
      break

    default:
      console.log(
        `%cYou Must Provide A Object Data Contains 'type' Key At Least When You Call '[type].sendMessage'!`,
        'background-color: crimson; color: white; display: block;',
        `Yours: ${JSON.stringify(message)}`
      )
      break
  }
})
