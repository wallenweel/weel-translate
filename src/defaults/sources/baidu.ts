import languages from '@/assets/baidu_languages.json';

export default {
  id: 'baidu_fanyi',
  name: 'Baidu',
  url: 'https://fanyi.baidu.com',
  method: 'get',
  query: {
    text: {
      method: 'post',
      url: '{url}/v2transapi',
      params: [
        ['from',	'{from}'],
        ['to',	'{to}'],
        ['query',	'{q}'],
        ['simple_means_flag',	'3'],
        ['sign',	'501406.214447'],
        ['token',	'6900cfce4beddf9a613d39cf338f034f'],
      ],
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
} as SourcePreset;
