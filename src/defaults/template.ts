import stringifyLayoutPresets, { layoutPresets } from './layouts';
import { sourcePresets } from './sources';

const enabledLayouts: TemplateConfig['template_enabled_layouts'] = layoutPresets
  .map(({ id, test, title }) => ({ id, test, title }));

const enabledSources: TemplateConfig['template_enabled_sources'] = sourcePresets
  .reduce((p: any, { id }) => !!Object.assign(p, { id: enabledLayouts }) && p, {});

const templateConfig: TemplateConfig = {
  template_enabled_sources: enabledSources,
  template_enabled_layouts: enabledLayouts,
  template_layouts: stringifyLayoutPresets,
};

export const prefixer = (name: string): string => `template_${name}`;

export default templateConfig;
