import sideStyles from '../../homeSideCards.module.css'

/** Lightweight placeholder while Market Pulse / Trending stream in (Suspense). */
export default function HomeInsightsSkeleton() {
  return (
    <div className={`${sideStyles.sideCard} placeholder-glow`} aria-hidden="true">
      <div className="placeholder col-12 rounded mb-2" style={{ height: 22 }} />
      <div className="placeholder col-10 rounded mb-2" style={{ height: 12 }} />
      <div className="placeholder col-11 rounded mb-2" style={{ height: 12 }} />
      <div className="placeholder col-9 rounded" style={{ height: 12 }} />
    </div>
  )
}
