/**
 * نغمة قصيرة عند التفاعل داخل معالج الإنشاء (أزرار تنقل، اختيار بطاقة).
 * لا يُشغَّل عند prefers-reduced-motion: reduce.
 */
let sharedCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null
  } catch {
    /* ignore */
  }

  type Win = Window & { webkitAudioContext?: typeof AudioContext }
  const Ctor = window.AudioContext || (window as Win).webkitAudioContext
  if (!Ctor) return null

  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new Ctor()
  }
  return sharedCtx
}

export function playWizardStepChime(): void {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    void ctx.resume().catch(() => {})
  } catch {
    return
  }

  try {
    const t0 = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.1, t0)
    master.gain.exponentialRampToValueAtTime(0.001, t0 + 0.32)
    master.connect(ctx.destination)

    const freqs = [523.25, 659.25, 783.99]
    freqs.forEach((hz, i) => {
      const start = t0 + i * 0.045
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(hz, start)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.001, start)
      g.gain.linearRampToValueAtTime(0.32, start + 0.018)
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
      osc.connect(g)
      g.connect(master)
      osc.start(start)
      osc.stop(start + 0.24)
    })
  } catch {
    /* ignore */
  }
}
