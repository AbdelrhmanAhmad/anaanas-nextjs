'use client'

import dynamic from 'next/dynamic'

const CreatePostCardLazy = dynamic(() => import('@/components/cards/CreatePostCard'), {
  ssr: false,
  loading: () => (
    <div className="card border-0 shadow-sm mb-4 placeholder-glow" aria-hidden="true">
      <div className="card-body py-4">
        <span className="placeholder col-7 col-md-5 rounded" style={{ height: 20 }} />
        <span className="placeholder col-12 rounded mt-3" style={{ height: 48 }} />
      </div>
    </div>
  ),
})

export default function CreatePostCardLazyClient() {
  return <CreatePostCardLazy />
}
