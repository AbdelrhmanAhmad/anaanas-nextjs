'use client'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import type { ChildrenType } from '@/types/component'
import FallbackLoading from '../FallbackLoading'

const AuthProtectionWrapper = ({ children }: ChildrenType) => {
  const { status } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()



  useEffect(() => {
    // Don't redirect if user is on authentication pages
    const isAuthPage = 
    pathname?.includes('/auth/sign-in') 
    || pathname?.includes('/auth/sign-up')
    // console.log("pathname" ,pathname)

    const isGlobalPage =
    (!pathname || pathname === '/' || pathname === '/ar' || pathname === '/en')
    ;


    if (!isGlobalPage && status === 'unauthenticated' && !isAuthPage) {
      push(`/auth/sign-in?redirectTo=${pathname}`)
    }



  }, [status, pathname, push])

  // if (status === 'unauthenticated') {
  //   return <FallbackLoading />
  // }

  return <Suspense>{children}</Suspense>
}

export default AuthProtectionWrapper
