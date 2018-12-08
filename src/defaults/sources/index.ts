import google from './google';

export default [
  google,
] as jsonString[];

type jsonString = string;

export interface Sources {
  // id: "source-[source.id]"
  [id: number]: jsonString;
}

export interface SourcePreset {
  readonly id: string;

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

interface Language {
  readonly code: string; // standard language code
  readonly name: string; // show when has not "locale"
  readonly locale?: string; // for i18n translation
}

interface TextQuery {
  method: 'GET' | 'POST' | string;
  url: string;
  params: string | {
    [param: string]: string | string[];
  };
}

interface AudioQuery extends TextQuery {
  tune?: any;
}

// object index such as "a.b.c" or Dom selecotr
type selector = string | undefined;

interface TextParser {
  phoneticSrc?: selector;
  phoneticDest?: selector;
  translation: selector;
  explain?: selector;
  [more: string]: selector;
}
