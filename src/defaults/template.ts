import stringifyTemplatePresets, { templatePresets } from './layouts';

const enabledTemplates: TemplatePresetItem[] = templatePresets
  .map(({ id, test, title }) => ({ id, test, title }));

const templateConfig: TemplateConfig = {
  template_enabled_layouts: enabledTemplates,
  template_layouts: stringifyTemplatePresets,
};

export const prefixer = (name: string): string => `template_${name}`;

export default templateConfig;
