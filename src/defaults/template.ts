import stringifyLayoutPresets, { layoutPresets } from './layouts';
import { sourcePresets } from './sources';

const enabledLayouts: TemplateConfig['template_enabled_layouts'] = layoutPresets
  .map(({ id, expect, title }) => ({ id, expect, title }));

const enabledSources: TemplateConfig['template_enabled_sources'] = sourcePresets
  .reduce((p: object, { id }) => ({ ...p, [id]: [enabledLayouts[0].id, enabledLayouts[1].id] }), {});

const templateConfig: TemplateConfig = {
  template_enabled_sources: enabledSources,
  template_enabled_crawlers: {},
  template_enabled_layouts: enabledLayouts,
  template_layouts: stringifyLayoutPresets,
};

export const prefixer = (name: string): string => `template_${name}`;

export default templateConfig;
