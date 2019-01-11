import stringifyLayoutPresets, { layoutPresets } from './layouts';
import { sourcePresets } from './sources';

const enabledLayouts: TemplateConfig['template_enabled_layouts'] = layoutPresets
  .map(({ id, expect, title }) => ({ id, expect, title }));

const [google, googleCN] = sourcePresets;
const enabledSources: TemplateConfig['template_source_layouts'] = [google, googleCN]
  .reduce((p: object, { id }) => ({ ...p, [id]: [enabledLayouts[0].id, enabledLayouts[0].id] }), {});

const templateConfig: TemplateConfig = {
  template_source_layouts: {
    ...enabledSources,
    youdao: [enabledLayouts[1].id, enabledLayouts[1].id],
  },
  template_crawler_layouts: {},
  template_enabled_layouts: enabledLayouts,
  template_layouts: stringifyLayoutPresets,
};

export const prefixer = (name: string): string => `template_${name}`;

export default templateConfig;
