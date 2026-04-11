/** نغمة نجاح قصيرة عبر Web Audio (بدون ملفات صوتية خارجية) */
export function playPostSuccessSound() {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const freqs = [523.25, 659.25, 783.99, 1046.5]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t0 = now + i * 0.07
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22)
      osc.start(t0)
      osc.stop(t0 + 0.24)
    })
    ctx.resume().catch(() => {})
  } catch {
    /* ignore */
  }
}
