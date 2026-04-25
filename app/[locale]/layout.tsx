import TopHeader from '@/components/layout/TopHeader'
import AnnouncementModal from '@/components/layout/AnnouncementModal'
import DailyUpdatesBanner from '@/components/layout/DailyUpdatesBanner'
import NewPostRealtime from '@/components/realtime/NewPostRealtime'
import type { ChildrenType } from '@/types/component'

const SocialLayout = ({ children }: ChildrenType) => {
  return (
    <>
      <TopHeader />
      <DailyUpdatesBanner />
      {children}
      <AnnouncementModal />
      <NewPostRealtime />
    </>
  )
}

export default SocialLayout
