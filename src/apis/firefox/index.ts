const {
  storage,
  runtime,
  tabs,
  i18n,
} = browser as any;

const manifest = runtime.getManifest();

export default {
  origin: browser,
  manifest,
  storage,
  runtime,
  tabs,
  i18n,
} as Browser;
