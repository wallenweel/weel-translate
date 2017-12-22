import merge from 'deepmerge'
import { whattype } from '@/functions/utils'
import serviceHelper from '@/functions/serviceHelper'

export const mergeState = (state, storage) => {
  state = merge(state, storage)
}

export const compileTmpPreset = ({ tmp }) => {
  tmp.sources.compiled = serviceHelper(tmp.sources.preset)
}

export const initialTmpSource = ({ tmp }, id = Object.keys(tmp.sources.compiled)[0]) => {
  tmp.sources.current_id = id
  tmp.sources.current_api = tmp.sources.compiled[id]
}

export const nextServiceSource = ({ tmp }) => {
  const IDs = Object.keys(tmp.sources.compiled)

  let nextIndex = IDs.indexOf(tmp.sources.current_id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  tmp.sources.current_api = Object.values(tmp.sources.current_id)[nextIndex]
}

export const compileCodes = ({ tmp }, preset) => {
  console.log('todo:compileCodes')
  // tmp.sources.api = compilePreset(preset)
}

export const tempResponse = ({ tmp }, response) => {
  tmp.sources.current_result = tmp.sources.current_api.parser(response)
}

export const tempReset = (state) => {
  for (const [key, value] of Object.entries(state.tmp.sources)) {
    state.tmp.sources[key] = {
      'object': {},
      'string': '',
      'array': []
    }[whattype(value)]
  }
  console.log(state.tmp.sources)
}
