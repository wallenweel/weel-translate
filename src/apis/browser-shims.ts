const storageAreaMethods: StorageAreaMethods = {
  get: (keys) => new Promise(() => ({})),
  set: (keys) => new Promise(() => ({})),
};

const port: RuntimePort = {
  name: 'mock_port',
  disconnect: () => void(0),
  error: null,
  onDisconnect: {
    addListener: () => void(0),
  },
  onMessage: {
    addListener: () => void(0),
    removeListener: () => void(0),
  },
  postMessage: () => void(0),
};

export const browserShim: Browser = {
  origin: window,
  tabs: {
    sendMessage: (tabId, message) => new Promise(() => void(0)),
    query: (queryInfo) => new Promise(() => [{}]),
  },
  runtime: {
    lastError: null,
    Port: port,
    getManifest: () => ({ version: '0.0.0' }),
    getURL: (path = '') => '',
    connect: () => port,
    onConnect: {
      addListener: () => void(0),
      removeListener: () => void(0),
      hasListener: () => true,
    },
    sendMessage: () => new Promise(() => void(0)),
    onMessage: {
      addListener: () => void(0),
    },
  },
  storage: {
    local: storageAreaMethods,
    sync: storageAreaMethods,
  },
  i18n: {
    getMessage: (name, substitions) => '',
    getUILanguage: () => '',
  },
};

if (TARGET_BROWSER === 'web') {
  Object.assign(window, {
    browser: browserShim,
    chrome: browserShim,
  });
}
