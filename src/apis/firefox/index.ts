const {
  storage,
  runtime,
} = browser as any;

const manifest = runtime.getManifest();

export default {
  origin: browser as object,
  manifest,
  storage,
  runtime,
  // get storage(): object { return browser.storage; },
} as Browser;
