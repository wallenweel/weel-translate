const {
  storage,
  runtime,
  tabs,
} = browser as any;

const manifest = runtime.getManifest();

export default {
  origin: browser,
  manifest,
  storage,
  runtime,
  tabs,
} as Browser;
