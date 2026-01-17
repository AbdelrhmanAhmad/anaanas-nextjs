import TopHeader from '@/components/layout/TopHeader'
import AuthProtectionWrapper from '@/components/wrappers/AuthProtectionWrapper'
import type { ChildrenType } from '@/types/component'

const SocialLayout = ({ children }: ChildrenType) => {
  return (
    <AuthProtectionWrapper>
      <TopHeader />
      {children}
    </AuthProtectionWrapper>
  )
}

export default SocialLayout
