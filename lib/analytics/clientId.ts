export function getClientId(): string {
  if (typeof window === 'undefined') return 'server'

  try {
    const key = 'ananas_client_id'
    const existing = window.localStorage.getItem(key)
    if (existing && existing.length > 8) return existing

    const id =
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `cid_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`)

    window.localStorage.setItem(key, id)
    return id
  } catch {
    return `cid_mem_${Date.now().toString(16)}`
  }
}

