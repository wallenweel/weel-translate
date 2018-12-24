import languages from './baidu_languages.json';

export default {
  id: 'baidu_fanyi',
  name: 'Baidu',
  url: 'https://fanyi.baidu.com',
  method: 'get',
  query: {
    text: {
      method: '{method}',
      url: '{url}/#{from}/{to}/{q}',
    },
  },
  parser: {
    phonetic_src: '$(.phonetic-transcription:first-child)',
    phonetic_dest: '$(.phonetic-transcription:last-child)',
    translation: '$(.dictionary-title .strong)',
    explain: '$(.dictionary-comment)',
  },
  fromto: ['en', 'zh'],
  languages,
} as CrawlerPreset;
