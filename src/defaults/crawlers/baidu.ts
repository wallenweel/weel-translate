export default {
  id: 'baidu',
  name: 'Baidu',
  url: 'https://baidu.com/s?wd={q}',
  method: 'get',
  parser: {
    test: '$(.op_dict_content)',
    phonetic_src: '$(.op_dict3_other_line)!!replace|trim!!',
    phonetic_dest: '$(.op_dict3_other_line + tr)!!replace|trim!!',
    translation: '$(.op_dict3_english_result_table)!!replace|trim!!',
    explain: '$(.op_dict3_else td:last-child)!!replace|trim!!',
  },
} as CrawlerPreset;
