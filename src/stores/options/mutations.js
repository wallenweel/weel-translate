import merge from 'deepmerge'
import { whattype } from '@/functions/utils'
import serviceHelper, { compilePreset, parsePreset } from '@/functions/serviceHelper'

export const mergeState = (state, storage) => {
  state = merge(state, storage)
}

export const compileTmpPreset = ({ tmp }) => {
  tmp.sources.compiled = serviceHelper(tmp.sources.preset)
}

export const initialTmpSource = (
  { tmp: { sources } },
  [first] = Object.keys(sources.compiled)
) => {
  sources.editor_content = sources.preset[first]
  sources.current_id = first
  // sources.current_api = sources.compiled[first]
  sources.items = Object.values(sources.compiled)
    .reduce((p, { id, name }) => p.push({ id, name }) && p, sources.items)
}

export const nextServiceSource = ({ tmp }) => {
  const IDs = Object.keys(tmp.sources.compiled)

  let nextIndex = IDs.indexOf(tmp.sources.current_id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  tmp.sources.current_api = Object.values(tmp.sources.current_id)[nextIndex]
}

export const compileCodes = ({ tmp: { sources } }, preset) => {
  const api = compilePreset(parsePreset(preset, sources.preset))

  sources.current_api = api
}

export const tmpResponse = ({ tmp: { sources } }, response) => {
  sources.current_response = JSON.parse(response)
  sources.current_result = sources.current_api.parser(sources.current_response)
}

export const tmpReset = (state) => {
  for (const [key, value] of Object.entries(state.tmp.sources)) {
    state.tmp.sources[key] = {
      'object': {},
      'string': '',
      'array': []
    }[whattype(value)]
  }
  console.log(state.tmp.sources)
}
