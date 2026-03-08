'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import styles from '../homeBanner.module.css'
import bannerImage from '@/assets/images/banner1.svg'

type HomeBannerProps = {
  locale: string
}

export default function HomeBanner({ locale }: HomeBannerProps) {
  const { data: session } = useSession()
  const userName = (session as any)?.user?.name

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    const isMorning = hour < 12
    if (locale === 'ar') {
      return isMorning ? 'صباح الخير' : 'مساء الخير'
    }
    return isMorning ? 'Good morning' : 'Good evening'
  }, [locale])

  return (
    <div className={styles.bannerWrap}>
      <Image
        src={bannerImage}
        alt="Banner"
        fill
        priority
        className={styles.bannerImg}
      />
      <div className={styles.bannerText}>
        <div className={styles.greeting}>
          {greeting}
          {userName ? `، ${userName}` : ''}
        </div>
      </div>
    </div>
  )
}

