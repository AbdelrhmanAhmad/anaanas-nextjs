'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'

import { NotificationProvider } from '@/context/useNotificationContext'
import type { ChildrenType } from '@/types/component'
import { ChatProvider } from '@/context/useChatContext'
import { AppDataProvider } from '@/context/AppDataContext'
import { CurrentUserProvider } from '@/context/useCurrentUser'
import { LayoutProvider } from '@/context/useLayoutContext'
import AutoLoginWrapper from './AutoLoginWrapper'
import { EmailVerificationProvider } from '@/context/EmailVerificationProvider'
import DirectionSync from '@/components/DirectionSync'
import ScrollToTopOnRoute from '@/components/ScrollToTopOnRoute'

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  useEffect(() => {
    const splashElement = document.querySelector<HTMLDivElement>('#__next_splash')
    const splashScreen = document.querySelector('#splash-screen')

    if (!splashElement || !splashScreen) return

    const handleMutations = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && splashElement.hasChildNodes()) {
          splashScreen.classList.add('remove')
        }
      }
    }
    const observer = new MutationObserver(handleMutations)
    observer.observe(splashElement, { childList: true, subtree: true })
    if (splashElement.hasChildNodes()) {
      splashScreen.classList.add('remove')
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <DirectionSync />
      <ScrollToTopOnRoute />
      <AutoLoginWrapper>
        <EmailVerificationProvider>
          <CurrentUserProvider>
            <AppDataProvider>
              <LayoutProvider>
                <ChatProvider>
                  <NotificationProvider>
                    {children}
                    <ToastContainer theme="colored" />
                  </NotificationProvider>
                </ChatProvider>
              </LayoutProvider>
            </AppDataProvider>
          </CurrentUserProvider>
        </EmailVerificationProvider>
      </AutoLoginWrapper>
    </SessionProvider>
  )
}
export default AppProvidersWrapper
