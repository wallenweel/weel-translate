import stringifyLayoutPresets, { layoutPresets } from './layouts';

const enabledLayouts: LayoutPresetItem[] = layoutPresets
  .map(({ id, test, title }) => ({ id, test, title }));

const templateConfig: TemplateConfig = {
  template_enabled_layouts: enabledLayouts,
  template_layouts: stringifyLayoutPresets,
};

export const prefixer = (name: string): string => `template_${name}`;

export default templateConfig;
