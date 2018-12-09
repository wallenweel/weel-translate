export default {
  // extends preset from 'google.com'
  extends: 'google_com',

  id: 'google_cn',
  name: '谷歌',
  url: 'https://translate.google.cn',
  fromto: ['auto', 'zh-cn'],
  include: ['auto', 'zh-cn', 'en', 'ja', 'ko', 'es', 'de'],
} as SourcePreset;
