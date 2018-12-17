export const popup: LayoutPreset = {
  id: 'default_popup',
  test: ['phonetic_src', 'phonetic_dest', 'translation', 'explain'],
  title: 'Default For Popup',
  description: 'default translation result template in popup page.',
  rows: [
    ['<pick>'],
    ['<voice?src>', '[', '{phonetic_src}', ']'],
    ['<voice?dest>', '[', '{phonetic_dest}', ']'],
    ['{translation}'],
    ['{explain}'],
  ],
};

export const float: LayoutPreset = {
  id: 'default_float',
  test: ['phonetic_dest', 'translation', 'explain'],
  title: 'Default For Float',
  description: 'default translation result template in content page as float panel.',
  rows: [
    ['<voice-dest>', '`', '{phonetic_dest}', '`'],
    ['{translation}'],
    ['{explain}'],
  ],
};
