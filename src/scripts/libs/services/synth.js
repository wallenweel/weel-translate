const synth = window.speechSynthesis

export const voices = synth.getVoices()

export default content => {
  const utterThis = new SpeechSynthesisUtterance(content)

  utterThis.voice = voices[0]
  utterThis.pitch = 1
  utterThis.rate = 1

  synth.speak(utterThis)
}
