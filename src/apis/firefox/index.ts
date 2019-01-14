const {
  storage,
  runtime,
  tabs,
  i18n,
  contextMenus,
} = browser as any;

const manifest = runtime.getManifest();

export default {
  origin: browser,
  manifest,
  storage,
  runtime,
  tabs,
  i18n,
  contextMenus,
} as Browser;
