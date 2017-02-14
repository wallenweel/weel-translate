document.body.addEventListener('mouseup', ev => {
  const selectedText = window.getSelection().toString().trim()

  if (selectedText.length > 0) {
    browser.runtime.sendMessage({
      type: 'HAS_SELECTION',
      payload: {
        text: selectedText,
      },
    })
  }
}, false)
