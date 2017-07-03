import { apiParse, detectLanguage } from "../functions"
import { apiPick } from "../services/translation"

const synth = window.speechSynthesis

export const voices = synth.getVoices()

/**
 * APISpeaking use API's voice to speak content
 * @param {[type]} q         [description]
 * @param {[type]} api_src   [description]
 * @param {[type]} lang_from [description]
 */
export const APISpeaking = (q, { api_src, lang_from: { value } }) => {
  let lang = value
  const api = apiPick(api_src)

  if (api_src === 'youdao') {
    lang = detectLanguage(q, api.uniform) || ''
  }

  const url = apiParse(api, 'voice')({ q, from: lang }, true)
  const audio = new Audio()

  audio.src = url

  audio.play()
}

/**
 * TTSSpeaking use TTS to speak content
 * @param {[type]} content    [description]
 * @param {[type]} tts_pitch  [description]
 * @param {[type]} tts_rate   [description]
 * @param {[type]} tts_volume [description]
 */
export const TTSSpeaking = (content, { tts_pitch, tts_rate, tts_volume }) => {
  const utterThis = new SpeechSynthesisUtterance(content)

  utterThis.voice  = voices[0]
  utterThis.volume = tts_volume || 1
  utterThis.pitch  = tts_pitch  || 1
  utterThis.rate   = tts_rate   || 1

  synth.speak(utterThis)
}

export default (content = '', cfg) => {
  const { api_speaking } = cfg

  if (!!api_speaking) {
    APISpeaking(content, cfg)
  } else {
    TTSSpeaking(content, cfg)
  }
}
