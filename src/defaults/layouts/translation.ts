export const standard: LayoutPreset = {
  title: 'Standard Translation Result',
  description: 'Default enabled in popup and web page.',

  id: 'standard',
  expect: ['phonetic_src', 'phonetic_dest', 'translation', 'explain'],
  rows: [
    ['<pick>'],
    ['<voice?src>', '[', '{phonetic_src}', ']'],
    ['<voice?dest>', '[', '{phonetic_dest}', ']'],
    ['{translation}'],
    ['{explain}'],
  ],
};

export const simple: LayoutPreset = {
  title: 'Simple Translation Result',
  description: 'Shows a few base stuffs as result.',

  id: 'simple',
  expect: ['phonetic_dest', 'translation', 'explain'],
  rows: [
    ['<voice?dest>', '[', '{phonetic_dest}', ']'],
    ['{translation}'],
    ['{explain}'],
  ],
};
