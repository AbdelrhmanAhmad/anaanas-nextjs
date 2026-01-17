import type { ChildrenType } from '@/types/component'

// Layout لمجموعة (pages) فقط يقوم بتمرير الأبناء كما هي
// الـ sidebar وهيكل الصفحة يتم التحكم فيه من `page.tsx` و`[section]/layout.tsx`

const PagesLayout = ({ children }: ChildrenType) => {
  return <>{children}</>
}

export default PagesLayout
