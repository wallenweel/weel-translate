import merge from 'deepmerge'
import { istype } from '@/functions/utils'
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
  sources.current_id = first
  // sources.current_api = sources.compiled[first]
  sources.items = Object.values(sources.compiled)
    .reduce((p, { id, name }) => p.push({ id, name }) && p, sources.items)
}

// TODO: maybe can have a compiled history
export const pushHistory = ({ tmp }, [type, { id }]) => {
  if (typeof tmp[type].history[id] === 'undefined') {
    tmp[type].history[id] = []
  }
  tmp[type].history[id].unshift({
    // response: tmp[type].current_response,
    // result: tmp[type].current_result,
    // input: tmp[type].current_input,
    // queryDetail: tmp[type].query_detail,
    // api: tmp[type].current_api,
    preset: tmp[type].preset[id]
  })

  // console.log(tmp[type].history[id])
}

export const nextServiceSource = ({ tmp }) => {
  const IDs = Object.keys(tmp.sources.compiled)

  let nextIndex = IDs.indexOf(tmp.sources.current_id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  tmp.sources.current_api = Object.values(tmp.sources.current_id)[nextIndex]
}

export const currentEditorChanges = ({ tmp }, [type, { id, content }]) => {
  // console.log(content)
  tmp[type].preset[id] = content
}

export const compileCurrentCodes = ({ tmp }, [type, { id, content }]) => {
  try {
    JSON.parse(content)
  } catch (error) {
    tmp[type].alert = [true, 'Preset content is not JSON.']
    console.error(error)
    return
  }

  let api
  try {
    api = compilePreset(parsePreset(content, tmp[type].preset))
  } catch (error) {
    tmp[type].alert = [true, 'Compile Preset Failed.']
    console.error(error)
    return
  }

  tmp[type].preset[id] = content
  tmp[type].current_api = api
}

export const createdNewPreset = ({ tmp }, [type, { id, name, preset }]) => {
  tmp[type].current_id = id
  tmp[type].preset[id] = preset
  tmp[type].items.unshift({ id, name })
}

export const removeCurrentPreset = ({ tmp }, [type, { id }]) => {
  tmp[type].items = tmp[type].items
    .reduce((p, c) => c.id === id ? p : (p.push(c) && p), [])

  delete tmp[type].preset[id]
  tmp[type].current_id = Object.keys(tmp[type].preset)[0]
}

export const changeCurrentPreset = ({ tmp }, [type, { id }]) => {
  if (tmp[type].current_id === id) return false

  tmp[type].current_id = id
  tmp[type].history = []
}

export const saveCurrentPreset = (state, [type]) => {
  const presets = state.tmp[type].preset

  let newPresets
  try {
    newPresets = Object.values(presets).reduce((p, c, i) => {
      let preset = JSON.parse(c)
      if (istype(preset, 'array')) {
        preset = preset.pop()
      }
      if (istype(preset, 'object')) {
        p[preset.id] = c
      }
      return p
    }, {})
  } catch (error) {
    state.tmp[type].alert = [true, 'Preset content is not JSON.']
    return
  }

  state.sources.preset = newPresets
  state.tmp[type].alert = [true, 'All Presets Have been Saved.']
}

export const tmpResponse = ({ tmp: { sources } }, response) => {
  sources.current_response = response
  sources.current_result = sources.current_api.parser(sources.current_response)
}

export const tmpCurrentRestore = ({ tmp }, [type, { id }]) => {
  const h = tmp[type].history[id][0]

  // tmp[type].current_response = h.response
  // tmp[type].current_result = h.result
  // tmp[type].current_input = h.input
  // tmp[type].current_api = h.api
  // tmp[type].query_detail = h.queryDetail
  tmp[type].preset[id] = h.preset

  // tmp[type].history.shift()
}

export const tmpStateUpdate = ({ tmp }, [ type, data ]) => {
  Object.assign(tmp[type], data)
}
