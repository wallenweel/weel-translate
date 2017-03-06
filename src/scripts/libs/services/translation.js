try {
  const port = chrome.runtime.connect({ name: 'Connecting:Translate' })
} catch (e) {
  console.info('ReferenceError: chrome is not defined!\n', 'Meybe You Are In Common Page For Developing, You might ignore the notice.')

  const port = {}
}

export const translate = ({ q = 'translate' }) => {
  console.log(q)
}
