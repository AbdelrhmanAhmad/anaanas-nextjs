import type { ReactNode } from 'react'

type Match = { start: number; end: number; kind: 'email' | 'url'; text: string }

function trimUrlTrailing(s: string): string {
  return s.replace(/[.,;:!?)}\]]+$/u, '')
}

function collectMatches(text: string): Match[] {
  const out: Match[] = []

  const emailRe = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
  let m: RegExpExecArray | null
  emailRe.lastIndex = 0
  while ((m = emailRe.exec(text)) !== null) {
    out.push({
      start: m.index,
      end: m.index + m[0].length,
      kind: 'email',
      text: m[0],
    })
  }

  const urlRe = /(?:https?:\/\/|www\.)[^\s<]+/gi
  urlRe.lastIndex = 0
  while ((m = urlRe.exec(text)) !== null) {
    const trimmed = trimUrlTrailing(m[0])
    if (trimmed.length < 4) continue
    out.push({
      start: m.index,
      end: m.index + trimmed.length,
      kind: 'url',
      text: trimmed,
    })
  }

  out.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    if (a.kind !== b.kind) return a.kind === 'email' ? -1 : 1
    return b.end - b.start - (a.end - a.start)
  })

  const merged: Match[] = []
  let lastEnd = -1
  for (const x of out) {
    if (x.start < lastEnd) continue
    merged.push(x)
    lastEnd = x.end
  }
  return merged
}

/**
 * Turn plain text into nodes with clickable `mailto:` and `http(s)` / `www.` links.
 */
export function linkifyPlainText(text: string, linkClassName?: string): ReactNode {
  if (!text) return text
  const matches = collectMatches(text)
  if (matches.length === 0) return text

  const parts: ReactNode[] = []
  let cursor = 0
  let k = 0
  for (const x of matches) {
    if (x.start > cursor) {
      parts.push(text.slice(cursor, x.start))
    }
    const href =
      x.kind === 'email'
        ? `mailto:${x.text}`
        : x.text.toLowerCase().startsWith('http')
          ? x.text
          : `https://${x.text}`

    parts.push(
      <a
        key={`ln-${k++}-${x.start}`}
        href={href}
        className={linkClassName}
        {...(x.kind === 'url'
          ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
          : { rel: 'nofollow' as const })}
        onClick={(e) => e.stopPropagation()}
      >
        {x.text}
      </a>,
    )
    cursor = x.end
  }
  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }
  return parts
}
