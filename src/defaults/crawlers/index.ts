import baidu from './baidu';

export const crawlerPresets: CrawlerPreset[] = [
  baidu,
];

export const stringifyCrawlerPresets: jsonString[] = crawlerPresets
.map((preset) => JSON.stringify(preset));

export default stringifyCrawlerPresets;
