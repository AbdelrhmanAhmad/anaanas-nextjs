'use client'

import dynamic from 'next/dynamic'

const AnnouncementModal = dynamic(() => import('@/components/layout/AnnouncementModal'), {
  ssr: false,
})

const AnnouncementModalLazy = () => <AnnouncementModal />

export default AnnouncementModalLazy
