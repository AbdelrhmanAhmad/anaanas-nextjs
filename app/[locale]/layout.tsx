import ResponsiveTopHeader from '@/components/layout/TopHeader/ResponsiveTopHeader'
import AnnouncementModal from '@/components/layout/AnnouncementModal'
import ResponsiveDailyUpdatesBanner from '@/components/layout/ResponsiveDailyUpdatesBanner'
import NewPostRealtime from '@/components/realtime/NewPostRealtime'
import type { ChildrenType } from '@/types/component'

const SocialLayout = ({ children }: ChildrenType) => {
  return (
    <>
      <ResponsiveTopHeader />
      <ResponsiveDailyUpdatesBanner />
      {children}
      <AnnouncementModal />
      <NewPostRealtime />
    </>
  )
}

export default SocialLayout
