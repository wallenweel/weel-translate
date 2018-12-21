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

declare interface PresetParamsParseFn {
  (target: queryParams, requestParams: { [key: string]: string; }, stringify?: boolean): std<URLSearchParams | string>;
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
  (response: any, parserPreset: SourcePreset['parser'],
    stringify?: boolean): std<SourcePreset['parser']>;
}

declare interface TemplateLayoutParseFn {
  (result: SourcePreset['parser'], rowsPreset: LayoutPreset['rows'],
    copy?: boolean): std<LayoutPreset['rows']>;
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
  connect(extensionId?: string, connectInfo?: { [k: string]: any }): RuntimePort;

  onConnect: {
    addListener(listener: (port: RuntimePort) => void): void;
    removeListener(listener: (port: RuntimePort) => void): void;
    hasListener(listener: (port: RuntimePort) => void): boolean;
  },
  onMessage: {
    // send a response asynchronously, `return true;` in the listener
    addListener(listener: listenerHandler): void;
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
  onMessage: BrowserRuntime['onMessage'];
  postMessage(message: { [k: string]: any }): void;
  sender?: MessageSender;
}

declare type listenerHandler = (message: { [k: string]: any }, sender: MessageSender, sendResponse: () => {}) => boolean | Promise<any>;

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

  // use these language's code that in "@/assets/languages.json"
  ui_language: Language['code'];
  request_timeout?: number;
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
  translation_current_source: SourcePresetItem;
  translation_enabled_sources: SourcePresetItem[] | [];
  translation_sources: translationSources;
}

declare type translationResult = {
  [name: string]: string | string[];
};
declare type translationSources = {
  [index: number]: jsonString;
};

declare type SourcePresetItem = {
  id: SourcePreset['id'];
  name: SourcePreset['name'];
  fromto: SourcePreset['fromto'];
  modify?: SourcePreset['modify'];
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
  query?: {
    text: TextQuery;
    audio?: AudioQuery;
  } | false;

  // parse response result
  // must be set in parent preset, optional in children
  // preset which has extends
  parser?: {
    [name: string]: selector;
  };

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
  params: queryParams;
}

declare interface AudioQuery extends TextQuery {
  tune?: any;
}

// object index such as "a.b.c" or Dom selecotr
declare type selector = string | string[] | undefined;

// config/template part
declare type templatePreset = LayoutPreset;

declare interface LayoutPresetItem {
  id: LayoutPreset['id'];
  test: LayoutPreset['test'],
  title?: LayoutPreset['title'];
}

declare type templateId = presetId;

declare interface LayoutPreset extends Preset {
  id: templateId;
  extends?: templateId;

  // check has or not existed "keys" in result. such as
  // test ['phonetic', 'translation'] in result { phonetic: '...', translation: '...' } is true
  test: string[],

  // layout
  rows: string[][];

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
  template_layouts: jsonString[];
}
