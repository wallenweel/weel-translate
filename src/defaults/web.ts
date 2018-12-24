import stringifyCrawlerPresets, { crawlerPresets } from './crawlers';

const enabledCrawlers: CrawlerPresetItem[] = crawlerPresets
  .map(({ id, name }) => ({ id, name }));

const webConfig: WebConfig = {
  web_enabled_crawlers: enabledCrawlers,
  web_crawlers: stringifyCrawlerPresets,
};

export const prefixer = (name: string): string => `web_${name}`;

export default webConfig;
