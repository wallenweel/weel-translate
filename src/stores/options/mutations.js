// import Vue from 'vue'
import merge from 'deepmerge'
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

export const pushHistory = ({ tmp }, type = '') => {
  tmp[type].history.unshift({
    response: tmp[type].current_response,
    preset: tmp[type].editor_content,
    result: tmp[type].current_result,
    input: tmp[type].current_input,
    queryDetail: tmp[type].query_detail,
    api: tmp[type].current_api
  })
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

export const createdNewPreset = ({ tmp: { sources } }, content) => {
  const { id, name } = JSON.parse(content)

  sources.preset[id] = content
  // Vue.set(sources.preset, id, content)
  sources.current_id = id
  sources.editor_content = content
  sources.items.unshift({ id, name })
}

export const removeCurrentPreset = ({ tmp: { sources } }, id) => {
  sources.items = sources.items.reduce((p, c) => {
    if (c.id === id) return p
    return p.push(c) && p
  }, [])

  delete sources.preset[id]
  sources.current_id = Object.keys(sources.preset)[0]
}

export const changeCurrentPreset = ({ tmp: { sources } }, id) => {
  if (sources.current_id === id) return

  sources.current_id = id
  sources.history = []
  sources.editor_content = sources.preset[id]
}

export const saveSourcesPreset = (state) => {
  const { tmp: { sources } } = state
  state.sources.preset = Object.assign(sources.preset, {
    [sources.current_id]: sources.editor_content
  })
  console.log(sources.preset)
}

export const tmpResponse = ({ tmp: { sources } }, response) => {
  sources.current_response = JSON.parse(response)
  sources.current_result = sources.current_api.parser(sources.current_response)
}

export const tmpSourcesRestore = ({ tmp: { sources } }) => {
  const h = sources.history[0]

  sources.current_response = h.response
  sources.editor_content = h.preset
  sources.current_result = h.result
  sources.current_input = h.input
  sources.current_api = h.api
  sources.query_detail = h.queryDetail

  // sources.history.shift()
}

export const tmpSourceUpdate = ({ tmp }, payload) => {
  Object.assign(tmp.sources, payload)
}
