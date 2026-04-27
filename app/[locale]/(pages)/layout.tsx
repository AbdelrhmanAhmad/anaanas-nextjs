import type { ChildrenType } from '@/types/component'

// Minimal pass-through: no extra wrappers (smaller DOM, less style recalc on route changes).

const PagesLayout = ({ children }: ChildrenType) => {
  return <>{children}</>
}

export default PagesLayout
