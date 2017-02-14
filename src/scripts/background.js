function handleMessage(request, sender, sendResponse) {
  console.log(request)
  sendResponse({response: "Response from background script"})
}

browser.runtime.onMessage.addListener(handleMessage)
