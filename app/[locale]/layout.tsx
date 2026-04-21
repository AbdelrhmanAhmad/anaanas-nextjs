import TopHeader from '@/components/layout/TopHeader'
import AnnouncementModal from '@/components/layout/AnnouncementModal'
import type { ChildrenType } from '@/types/component'

const SocialLayout = ({ children }: ChildrenType) => {
  return (
    <>
      <TopHeader />
      {children}
      <AnnouncementModal />
    </>
  )
}

export default SocialLayout
