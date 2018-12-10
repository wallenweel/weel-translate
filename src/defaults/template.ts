export default {
  template_popup: [
    ['<button-voice src>', 'phoneticSrc', '~', '<button-pick>'],
    ['{{q}}'],
    ['<button-voice dest>', 'phoneticDest'],
    ['translation'],
    ['explain'],
  ],
  template_fap: [
    ['<button-voice dest>', 'phoneticDest', '~', '<button-pick>'],
    ['translation'],
    ['explain'],
  ],
} as TemplateConfig;
