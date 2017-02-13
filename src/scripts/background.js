function handleMessage(request, sender, sendResponse) {
  sendResponse({response: "Response from background script"})
}

browser.runtime.onMessage.addListener(handleMessage)
