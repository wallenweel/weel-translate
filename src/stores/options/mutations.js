import merge from 'deepmerge'
import { compilePreset } from '@/functions/serviceHelper'

export const mergeState = (state, storage) => {
  state = merge(state, storage)
}

export const currentServiceSource = (state, {
  id, name, icon,
  languages
}) => {
  state.currentSource = { id, name, icon, languages }
}

export const nextServiceSource = (state) => {
  const IDs = Object.keys(state.api)

  let nextIndex = IDs.indexOf(state.currentSource.id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  state.currentSource = Object.values(state.api)[nextIndex]
}

export const presetRunPass = ({ temp }, preset) => {
  temp.api = compilePreset(preset)
}

export const tempResponse = ({ temp }, response) => {
  temp.response = response
}
