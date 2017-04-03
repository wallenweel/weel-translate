const synth = window.speechSynthesis

export const voices = synth.getVoices()

export default (content = '', { tts_pitch, tts_rate, tts_volume }) => {
  const utterThis = new SpeechSynthesisUtterance(content)

  utterThis.voice  = voices[0]
  utterThis.volume = tts_volume || 1
  utterThis.pitch  = tts_pitch  || 1
  utterThis.rate   = tts_rate   || 1

  synth.speak(utterThis)
}
