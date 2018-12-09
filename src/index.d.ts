declare type messageText = string;
declare type std<T = any> = [Error | null | true | messageText, T?];

/** /funtions */
declare type versionFresh = 'VERSION_FRESH';
declare type versionUpdate = 'VERSION_UPDATED';
declare type versionSame = 'VERSION_SAME';
declare type versionOutdated = 'VERSION_OUTDATED';

declare interface VersionCheckFn {
  (current: string, last: string | undefined): std<versionFresh | versionUpdate | versionSame | versionOutdated>;
}

declare interface TranslationSourcesParserFn {
  (presets: jsonString[]): std<TranslationSourcePreset[]>
}

declare interface TranslationSourcesStringifyFn {
  (presets: TranslationSourcePreset[]): std<jsonString[]>;
}

/** /apis/browser */
declare interface Browser {
  // browser's original global object
  readonly origin?: any;

  readonly runtime: Runtime;
  readonly storage: Storage;
  readonly [name: string]: any;
}

declare type version = string; // like 0.0.0

declare interface Runtime {
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

declare interface Storage {
  readonly local: StorageAreaMethods;
  readonly sync: StorageAreaMethods;
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

/** /defaults */
declare interface DefaultConfig extends Preference, TranslationData {
  'runtime-env': 'development' | 'production';

  'version': version;
  'last-version'?: version;

  [name: string]: any;
}

declare interface Preference {
  'preference-theme': 'dark' | 'light';

  // enable float action button
  'preference-fab-enable': boolean;

  // after selection | center of selection | follow mouse
  'preference-fab-position': 'after' | 'center' | 'follow';

  // enable float action (result) panel
  'preference-fap-enable': boolean;

  // center of selection | follow fab | window edge
  'preference-fap-position': 'center' | 'follow' | 'edge';
  // vaild if above set "edge"
  // top left | top center | top right | bottom left | bottom center | bottom right
  'preference-fap-position-edge': 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';

  // enable context menu entry
  'preference-context-menu-enable': boolean;
}

declare interface TranslationData {
  'translation-recent': TranslationListItem[] | [];
  'translation-picked': TranslationListItem[] | [];
  'translation-sources': TranslationSources;
}

declare interface TranslationListItem {
  id: string;
  title: string;
  description?: string;
}

declare type jsonString = string;

declare interface TranslationSources {
  // id: "source-[source.id]"
  [id: number]: jsonString;
}

// translation source's id, only accpet en words and "_" as separator
declare type translationSourceID = string;

declare interface TranslationSourcePreset {
  // extends a full preset, by source's id
  readonly extends?: translationSourceID,

  readonly id: translationSourceID;

  // display name
  name: string;

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
  parser: TextParser;

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
declare type selector = string | undefined;

declare interface TextParser {
  phoneticSrc?: selector;
  phoneticDest?: selector;
  translation: selector;
  explain?: selector;
  [more: string]: selector;
}

declare type parserItemResult = string;

declare interface Template {
  'template-popup': parserItemResult[][];
  'template-fap': parserItemResult[][];
}
