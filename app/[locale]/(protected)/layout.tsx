import AuthProtectionWrapper from '@/components/wrappers/AuthProtectionWrapper'
import type { ChildrenType } from '@/types/component'

const SocialLayout = ({ children }: ChildrenType) => {
  return (
    <>  
        <AuthProtectionWrapper>
        {children}
    </AuthProtectionWrapper>

 
    </>
  )
}

export default SocialLayout
