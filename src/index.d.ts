declare type messageText = string;

declare type jsonString = string;

// standard return
declare type std<T = any> = [Error | null | true | messageText, T?, any?];

/** /funtions */
declare interface IsTypeFn {
  (target: any, type: string | string[]): boolean;
}

declare interface PathValueFn {
  (path: 'string', target: any): string | any;
}

type configPairs<S, C = DefaultConfig> = { [k in keyof C]?: keyof S };
type ConfigRegistFn<S, C = DefaultConfig> =
  (pairs: configPairs<S, C>, order: 'pull' | 'push') => (stuffs: C | S | any) => S | C | any;

// parse params string to params object
// such as: 'host?a&b=b&c=c' => { a: true, b: 'b', c: 'c' }
declare interface StringParamsParseFn {
  (target: queryParams):
    std<string | { [k: string]: any }>;
}

declare type versionFresh = 'VERSION_FRESH';
declare type versionUpdate = 'VERSION_UPDATED';
declare type versionSame = 'VERSION_SAME';
declare type versionOutdated = 'VERSION_OUTDATED';
declare type versionStatus = versionFresh | versionUpdate | versionSame | versionOutdated;

// => [error, versionStatus, incompatibleLevel]
// incompatible level: compatible(-1), maybe(0), must(1)
declare interface VersionCheckFn {
  (current: string, last: string | undefined): std<versionStatus>;
}

declare type presetId = string;

declare interface Preset {
  // translation source's id, only accpet en words
  // and "_" as separator
  readonly id: presetId;
  // extends a full preset, by source's id
  // must be set in children preset
  readonly extends?: presetId;

  [index: string]: any;
}

declare type presetStringJson = jsonString;

declare interface PresetInvokeFn {
  (id: presetId, presets: presetStringJson[]):
    std<Preset | SourcePreset | LayoutPreset>;
}

declare interface PresetLanguagesModifyFn {
  (languages: Language[], rules: SourcePreset['modify']): std<Language[]>
}

declare interface PresetLanguagesFilterFn {
  (languages: Language[], include?: Array<Language['code']>, exclude?: Array<Language['code']>): std<Language[]>
}

declare interface PresetsParseFn {
  (presets: jsonString[]): std<Preset[]>;
}

declare interface PresetsStringifyFn {
  (presets: Preset[]): std<jsonString[]>;
}

declare interface ParamsParseFn<T> {
  (target: T, params: { [k: string]: string | undefined }, parse?: boolean): std<T>;
}

declare interface PresetParamsParseFn {
  (target: queryParams, requestParams: { [key: string]: string | undefined; }, stringify?: boolean): std<URLSearchParams | string>;
}

declare interface ParserPathSplitFn {
  (path: string): std<string[] | string[][]>;
}

declare interface ParserPathReduceFn {
  (path: string, response: any, stringify?: boolean): std<string[] | string>;
}

declare interface ConfigKeysReduceFn {
  (keys: storageKeys, config: any): std<any>;
}

declare interface TranslationResultParseFn {
  (response: any, preset: SourcePreset, stringify?: boolean): std<translationResult>;
}

declare interface TemplateExpectCheckFn {
  (rules: LayoutPreset['expect'], items: { [k: string]: any }): std<boolean>;
}

declare interface TemplateLayoutParseFn {
  (result: SourcePreset['parser'], preset: LayoutPreset): std<LayoutPreset['rows']>;
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
  lastError: null | Error;
  Port: RuntimePort;

  getManifest(): { version: version; };
  connect(extensionId?: string | connectInfo, connectInfo?: connectInfo): RuntimePort;

  onConnect: {
    addListener(listener: (port: RuntimePort) => void): void;
    removeListener(listener: (port: RuntimePort) => void): void;
    hasListener(listener: (port: RuntimePort) => void): boolean;
  },
  // @see: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
  sendMessage(
    extensionId?: sendMessageExtensionId | sendMessageMessage, message?: sendMessageMessage | sendMessageOptions,
    options?: sendMessageOptions): Promise<any>;
  onMessage: {
    // send a response asynchronously, `return true;` in the listener
    addListener(listener: listenerHandler): void | boolean;
  };
}

declare type sendMessageExtensionId = string;
declare type sendMessageMessage = any;
declare type sendMessageOptions = { includeIlsChannelId?: boolean, toProxyScript?: boolean };

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

declare interface IpcAction {
  port?: boolean; // whether a prot message or not
  name?: RuntimePort['name']; // connect port name, needed if is a port message

  type: string; // reacting action's type
  token?: string; // flag action which start a query
  from?: string; // page name
  payload?: any;
  error?: null | any;
}

declare interface IpcResponse {
  name?: RuntimePort['name']; // existed if sender is a port message

  type: string; // reacted action's type
  token?: string; // flag action which start a query
  payload?: any;
  error?: null | any;
}

declare interface connectInfo {
  name?: RuntimePort['name'];
  includeTlsChannelID?: boolean,
  [k: string]: any;
}

declare interface RuntimePort {
  name: string;
  disconnect(): void;
  error: any;
  onDisconnect: {
    addListener(listener: (port: RuntimePort) => void): void;
  };
  onMessage: {
    addListener(listener: (message: any) => void): void;
    removeListener(listener: (message: any) => void): void;
  };
  postMessage(message: { [k: string]: any }): void;
  sender?: MessageSender;
}

declare type listenerHandler = (message: { [k: string]: any }, sender: MessageSender, sendResponse: (data: any) => {}) => boolean | Promise<any>;

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
declare type configCat = 'config' | 'translation' | 'preference' | 'template' | 'web';
declare interface DefaultConfig extends
WebConfig,
TemplateConfig,
TranslationConfig,
PreferenceConfig,
BaseConfig {
  // [name: string]: any;
  test?: boolean;
}

interface BaseConfig {
  runtime_env: 'development' | 'production';
  version: version;
  last_version?: version;

  // use these language's code that in "@/assets/languages.json"
  ui_language: Language['code'];
  request_timeout?: number;
}

declare interface PreferenceConfig {
  preference_theme: 'dark' | 'light';

  // enable float action button
  preference_fab_enable: boolean;

  // after selection | center of selection | follow mouse
  preference_fab_position: 'after' | 'center' | 'follow' | 'auto-center';

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
  source: SourcePresetItem;
  text: string;
  title?: string;
  excerpt?: string;
};

declare interface TranslationConfig {
  translation_hotkey: 'enter' | 'ctrl+enter';
  translation_recent: translationListItem[] | [];
  translation_recent_numbers: number;
  translation_picked: translationListItem[] | [];
  translation_current_source: SourcePresetItem;
  translation_enabled_sources: SourcePresetItem[] | [];
  translation_sources: translationSources;
}

declare type translationResult = {
  [name: string]: string | string[];
};
declare type translationSources = jsonString[];

declare type SourcePresetItem = {
  id: SourcePreset['id'];
  name: SourcePreset['name'];
  fromto: SourcePreset['fromto'];
};

declare type sourceId = presetId;

declare interface SourcePreset extends Preset {
  readonly id: sourceId;

  readonly extends?: sourceId;

  // display name
  readonly name?: string;

  // query.<type>.url can override this
  url: string;

  // request method
  method?: 'get' | 'post' | string;

  // translation request
  // if false, use xhr or fetch by "url" and
  // parser's selectors as Dom selector
  query: {
    text: TextQuery;
    audio?: AudioQuery;
  } | false;

  // parse response result
  // must be set in parent preset, optional in children
  // preset which has extends
  parser: { [name: string]: selector; };

  // test parser's item whether got vaild result or not
  // use string as RegExp param: '\\w\\W+' 
  // use custom placeholder repeat default: ['.+', 'Not Existed']
  test?: { [name: string]: string | [string, string]; };

  // support ['auto:>AUTO', 'zh-cn:>zh-CHS', ...]
  // or [['auto', 'AUTO'], ['zh-cn', 'zh-CHS'], ...]
  // or [[{ code: 'auto' }, { code: 'AUTO' }], ...]
  modify?: string[] |
    Array<Language['code'][]> |
    Array<[
      { code: Language['code'], name?: Language['name'], locale?: Language['locale'] },
      { code?: Language['code'], name?: Language['name'], locale?: Language['locale'] }
    ]>;

  // initial translating direction
  fromto: [Language['code'], Language['code']];

  // just include necessary languages
  // if not exist, load all of languages
  include?: Array<Language['code']>;

  // invalid when "include" is set
  // if exist, exclude from all languages
  exclude?: Array<Language['code']>;

  // custom all languages that your preset needs
  languages?: Array<Language>;
}

declare interface Language {
  readonly code: string; // standard language code
  readonly name: string; // show when has not "locale"
  readonly locale?: string; // for i18n translation
}

declare type queryParams = string | { [param: string]: string | string[]; } | string[][];
declare interface TextQuery {
  method: 'get' | 'post' | string;
  url: string;
  params?: queryParams;
  unsupport?: Language['code'][];
}

declare interface AudioQuery extends TextQuery {
  // Feature: not implement
  tune?: {
    volume: number; // float number, minimum: 0 ~ maximum: 1
  };
}

// object index such as "a.b.c" or Dom selecotr
declare type selector = string | string[] | undefined;

declare type crawlerId = string;

declare interface CrawlerPresetItem {
  id: CrawlerPreset['id'];
  name: CrawlerPreset['name'];
}

declare interface CrawlerPreset extends Preset {
  id: crawlerId;
  extends?: crawlerId;
  name: string;
  url: string;
  method?: 'get' | string;
  parser: {
    [key: string]: selector;
  };
  template?: LayoutPreset['rows'],
}

declare interface WebConfig {
  web_enabled_crawlers: CrawlerPresetItem[];
  web_crawlers: presetStringJson[];
}

// config/template part
declare type templatePreset = LayoutPreset;

declare interface LayoutPresetItem {
  id: LayoutPreset['id'];
  expect: LayoutPreset['expect'],
  title?: LayoutPreset['title'];
}

declare type templateId = presetId;

declare interface LayoutPreset extends Preset {
  id: templateId;
  extends?: templateId;

  // layout
  rows: string[][];

  // check has or not existed "keys" in result. such as
  // expect ['phonetic', 'translation'] in result { phonetic: '...', translation: '...' } is true
  expect?: string[],

  // replace string while result's item got unexpect things
  // string: as placeholder if no content
  // string[]: [regexp string for test, regexp string as replace rule, replaceing string]
  // undefined: ignore this one
  replace?: (string | string[] | undefined)[];

  title?: string;
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
  template_layouts: presetStringJson[];
}
