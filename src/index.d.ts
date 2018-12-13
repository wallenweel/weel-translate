declare type messageText = string;

declare type jsonString = string;

declare type std<T = any> = [Error | null | true | messageText, T?, any?];

/** /funtions */
declare type versionFresh = 'VERSION_FRESH';
declare type versionUpdate = 'VERSION_UPDATED';
declare type versionSame = 'VERSION_SAME';
declare type versionOutdated = 'VERSION_OUTDATED';
declare type versionStatus = versionFresh | versionUpdate | versionSame | versionOutdated;

declare interface VersionCheckFn {
  (current: string, last: string | undefined): std<versionStatus>;
}

declare interface Preset {
  id: string;
  [index: string]: any;
}

declare interface PresetsParseFn {
  (presets: jsonString[]): std<Preset[]>;
}

declare interface PresetsStringifyFn {
  (presets: Preset[]): std<jsonString[]>;
}

declare interface TranslationResultParseFn {
  (response: any, preset: SourcePreset['parser'],
    copy?: boolean): std<SourcePreset['parser']>;
}

declare interface TemplateLayoutParseFn {
  (result: SourcePreset['parser'], preset: layoutPreset['rows'],
    copy?: boolean): std<layoutPreset['rows']>;
}

/** /apis/browser */
declare interface Browser {
  // browser's original global object
  readonly origin?: any;

  readonly runtime: BrowserRuntime;
  readonly storage: BrowserStorage;
  // readonly i18n: BrowserI18n;

  readonly [name: string]: any;
}

declare type version = string; // like 0.0.0

declare interface BrowserRuntime {
  onMessage: {
    // send a response asynchronously, `return true;` in the listener
    addListener(listener: listenerHandler): void;
  };
  getManifest(): {
    version: version;
  };
}

declare type storageType = 'local' | 'sync' | 'managed';

declare type storageKeys = null | string | object | string[];

declare interface BrowserStorage {
  readonly local: StorageAreaMethods;
  readonly sync: StorageAreaMethods;
  [area: string]: StorageAreaMethods;
}

declare interface StorageAreaMethods {
  get(keys: storageKeys): Promise<object | Error>;
  set(keys: object): Promise<object | Error>;
}

declare type listenerHandler = (message: object, sender: MessageSender, sendResponse: () => {}) => boolean | Promise<any>;

declare interface MessageSender {
  tab?: any;
  frameId?: number;
  id?: string;
  url?: string;
  tlsChannelId?: string;
}

declare interface BrowserI18n {
  readonly getMessage: {
    (messageName: string, substitutions?: string | string[]): string;
  };
}

/** /defaults */
declare interface DefaultConfig extends
TemplateConfig,
TranslationConfig,
PreferenceConfig,
BaseConfig {
  [name: string]: any;
}

interface BaseConfig {
  runtime_env: 'development' | 'production';
  version: version;
  last_version?: version;
}

declare interface PreferenceConfig {
  preference_theme: 'dark' | 'light';

  // enable float action button
  preference_fab_enable: boolean;

  // after selection | center of selection | follow mouse
  preference_fab_position: 'after' | 'center' | 'follow';

  // enable float action (result) panel
  preference_fap_enable: boolean;

  // center of selection | follow fab | window edge
  preference_fap_position: 'center' | 'follow' | 'edge';
  // vaild if above set "edge"
  // top left | top center | top right | bottom left | bottom center | bottom right
  preference_fap_position_edge: 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';

  // enable context menu entry
  preference_context_menu_enable: boolean;
}

declare type translationListItem = {
  id: string;
  title: string;
  description?: string;
};

declare interface TranslationConfig {
  translation_recent: translationListItem[] | [];
  translation_picked: translationListItem[] | [];
  translation_enabled_sources: SourcePresetItem[] | [];
  translation_sources: translationSources;
}

declare type translationSources = {
  [index: number]: jsonString;
};

// translation source's id, only accpet en words and "_" as separator
declare type sourceId = string;

declare type SourcePresetItem = {
  readonly id: sourceId;
  readonly name?: string; // display name
};

declare interface SourcePreset extends SourcePresetItem {
  // extends a full preset, by source's id
  readonly extends?: sourceId;

  // query.<type>.url can override this
  url: string;

  // translation request
  // if false, use xhr or fetch by "url" and
  // parser's selectors as Dom selector
  query?: {
    text: TextQuery;
    audio?: AudioQuery;
  } | false;

  // parse response result
  parser: {
    [name: string]: selector;
  };

  // initial
  fromto?: [Language['code'], Language['code']];

  // support modify by symbol ":>"
  // such as "['auto:>AUTO', 'zh-cn:>zh-CHS']"
  modify?: string[];

  // if not exist, load all of languages
  include?: Array<Language['code']>;

  // invalid when "include" is set
  // if exist, exclude from all languages
  exclude?: Array<Language['code']>;
}

declare interface Language {
  readonly code: string; // standard language code
  readonly name: string; // show when has not "locale"
  readonly locale?: string; // for i18n translation
}

declare interface TextQuery {
  method: 'GET' | 'POST' | string;
  url: string;
  params: string | {
    [param: string]: string | string[];
  };
}

declare interface AudioQuery extends TextQuery {
  tune?: any;
}

// object index such as "a.b.c" or Dom selecotr
declare type selector = string | string[] | undefined;

// config/template part
declare type templatePreset = layoutPreset;

declare type templateId = string;

declare interface LayoutPresetItem {
  id: templateId;
  // check has or not existed "keys" in result. such as
  // test ['phonetic', 'translation'] in result { phonetic: '...', translation: '...' } is true
  test: string[],
  title?: string;
}

declare interface layoutPreset extends LayoutPresetItem {
  rows: string[][]; // output
  description?: string;
}

declare interface TemplateConfig {
  // template_enabled_crawlers: {
  //   [crawlerId: string]: LayoutPresetItem;
  // },
  template_enabled_sources: {
    [sourceId: string]: [LayoutPresetItem, LayoutPresetItem];
  };
  template_enabled_layouts: LayoutPresetItem[];
  template_layouts: jsonString[];
}
