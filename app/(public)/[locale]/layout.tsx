import type { ReactNode } from 'react'

/** No client providers here — public routes stay server-first for FCP/LCP. */
const PublicLocaleLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export default PublicLocaleLayout

