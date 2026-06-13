'use client'

import { useEffect, useId, useRef, useState, type AnchorHTMLAttributes } from 'react'
import clsx from 'clsx'

import 'glightbox/dist/css/glightbox.min.css'

const GlightBox = ({
  children,
  href,
  className,
  ...other
}: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const reactId = useId()
  const id = `glightbox-${reactId.replace(/:/g, '-')}`
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let instance: { destroy?: () => void } | null = null
    if (!ref.current || !mounted || typeof window === 'undefined') return

    void import('glightbox').then(({ default: glightbox }) => {
      if (!ref.current) return
      try {
        instance = glightbox({
          selector: `#${id}`,
          openEffect: 'fade',
          closeEffect: 'fade',
        })
      } catch (e) {
        console.error('Failed to init glightbox', e)
      }
    })

    return () => {
      try {
        instance?.destroy?.()
      } catch {
        // ignore
      }
    }
  }, [id, mounted])

  return (
    <a id={id} ref={ref} href={href} {...other} className={clsx('glightbox', className)}>
      {children}
    </a>
  )
}
export default GlightBox
