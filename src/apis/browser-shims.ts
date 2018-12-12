const storageAreaMethods: StorageAreaMethods = {
  get: (keys) => new Promise(() => ({})),
  set: (keys) => new Promise(() => ({})),
};

export const browserShim: Browser = {
  origin: window,
  runtime: {
    getManifest: () => ({
      version: '0.0.0',
    }),
    onMessage: {
      addListener: () => void(0),
    },
  },
  storage: {
    local: storageAreaMethods,
    sync: storageAreaMethods,
  },
};

if (TARGET_BROWSER === 'web') {
  Object.assign(window, {
    browser: browserShim,
    chrome: browserShim,
  });
}
