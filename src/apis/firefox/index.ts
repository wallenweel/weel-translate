const {
  storage,
  runtime,
} = browser as any;

const manifest = runtime.getManifest();

export default {
  origin: browser,
  manifest,
  storage,
  runtime,
} as Browser;
