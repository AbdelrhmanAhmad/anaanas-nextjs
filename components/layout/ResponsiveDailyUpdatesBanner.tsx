'use client'

import DailyUpdatesBanner from '@/components/layout/DailyUpdatesBanner'
import MobileDailyUpdatesBanner from '@/components/layout/mobile/MobileDailyUpdatesBanner'
import styles from '@/components/layout/ResponsiveDailyUpdatesBanner.module.css'

/**
 * Renders the daily-updates banner appropriate for the active breakpoint.
 *
 * Both variants are emitted to the DOM and toggled with `display:` rules so we
 * stay friendly to SSR/RSC (no `window` peeks). The desktop banner is the
 * original implementation, untouched.
 */
const ResponsiveDailyUpdatesBanner = () => {
  return (
    <>
      <div className={styles.desktopOnly}>
        <DailyUpdatesBanner />
      </div>
      <div className={styles.mobileOnly}>
        <MobileDailyUpdatesBanner />
      </div>
    </>
  )
}

export default ResponsiveDailyUpdatesBanner
