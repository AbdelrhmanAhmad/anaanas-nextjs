import type { ReactNode } from 'react'

const PublicLocaleLayout = ({ children }: { children: ReactNode }) => {
  // Layout خفيف بدون أي تغليفات Client لضمان SSR كامل
  return <>{children}</>
}

export default PublicLocaleLayout

