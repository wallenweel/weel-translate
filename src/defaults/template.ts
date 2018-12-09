export default {
  'template-popup': [
    ['<button-voice src>', 'phoneticSrc', '~', '<button-pick>'],
    ['{{q}}'],
    ['<button-voice dest>', 'phoneticDest'],
    ['translation'],
    ['explain'],
  ],
  'template-fap': [
    ['<button-voice dest>', 'phoneticDest', '~', '<button-pick>'],
    ['translation'],
    ['explain'],
  ],
} as Template;
