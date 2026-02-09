'use client'

import styles from '../auction-posts.module.css'
import { t } from '@/lib/translations'
import { useMemo, useState } from 'react'

function MascotSvg({ size = 170 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="Ananas mascot">
      {/* soft bg */}
      <defs>
        <linearGradient id="gY" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFE6A6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>
        <radialGradient id="pine" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#FFD45A" />
          <stop offset="1" stopColor="#FF9A1F" />
        </radialGradient>
      </defs>

      {/* little confetti */}
      <g opacity="0.55">
        <circle cx="26" cy="78" r="4" fill="#FFC83D" />
        <circle cx="172" cy="76" r="4" fill="#86EFAC" />
        <rect x="34" y="140" width="8" height="8" rx="2" fill="#7DD3FC" transform="rotate(15 38 144)" />
        <rect x="160" y="132" width="8" height="8" rx="2" fill="#FFC83D" transform="rotate(-15 164 136)" />
      </g>

      {/* body */}
      <g transform="translate(28 26)">
        {/* shadow */}
        <ellipse cx="72" cy="146" rx="58" ry="10" fill="#0F172A" opacity="0.06" />

        {/* pineapple */}
        <path
          d="M72 22c28 0 50 22 50 50v34c0 28-22 50-50 50S22 134 22 106V72c0-28 22-50 50-50z"
          fill="url(#pine)"
        />

        {/* grid */}
        <g opacity="0.25" stroke="#0F172A" strokeWidth="2">
          {Array.from({ length: 6 }).map((_, r) => (
            <path key={r} d={`M${28 + r * 14} 50 L${116 + r * 6} 122`} />
          ))}
          {Array.from({ length: 6 }).map((_, r) => (
            <path key={`b-${r}`} d={`M${116 - r * 14} 50 L${28 - r * 6} 122`} />
          ))}
        </g>

        {/* hat */}
        <g transform="translate(52 0)">
          <rect x="16" y="0" width="44" height="46" rx="8" fill="#111827" />
          <rect x="6" y="42" width="64" height="10" rx="5" fill="#111827" />
          <rect x="16" y="28" width="44" height="6" rx="3" fill="#334155" opacity="0.65" />
        </g>

        {/* arms */}
        <path d="M18 82c-10 8-14 20-12 34" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
        <path d="M126 82c10 8 14 20 12 34" stroke="#111827" strokeWidth="8" strokeLinecap="round" />

        {/* hands */}
        <circle cx="4" cy="118" r="8" fill="#111827" />
        <circle cx="140" cy="118" r="8" fill="#111827" />

        {/* face */}
        <g>
          <path d="M54 86c6-8 14-8 20 0" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
          <path d="M70 86c6-8 14-8 20 0" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
          <path d="M64 112c10 10 22 10 32 0" stroke="#111827" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>

        {/* suit */}
        <path
          d="M34 110c8 12 22 22 38 22s30-10 38-22v20c0 14-22 26-38 26s-38-12-38-26v-20z"
          fill="#111827"
          opacity="0.92"
        />
        <path d="M72 122l-10 10 10 10 10-10-10-10z" fill="#FFFFFF" opacity="0.95" />
        <rect x="66" y="124" width="12" height="4" rx="2" fill="#111827" opacity="0.9" />
      </g>

      <rect x="12" y="12" width="176" height="176" rx="26" fill="url(#gY)" opacity="0.65" />
    </svg>
  )
}

export default function AuctionPostsExperience({ locale }: { locale: any }) {
  const [activeTrending, setActiveTrending] = useState(0)
  const [activeLive, setActiveLive] = useState(2)

  const palette = useMemo(
    () => [
      { label: '#FFC83D', color: '#FFC83D' },
      { label: 'EAF2 Blue', color: '#EAF2FF' },
      { label: 'DFFF Green', color: '#DFFFEA' },
      { label: '1FA Gray', color: '#1F2937' },
      { label: '#PS577RA', color: '#A7B1C2' },
    ],
    []
  )

  const trending = useMemo(
    () => [
      {
        variant: 'timer' as const,
        topPill: t('auctionPosts.trending.pill', locale),
        topBadge: t('auctionPosts.trending.badgeAd', locale),
        pill: '06:890',
        main: '03:00',
        progress: 0.62,
        price: '$899',
        rightMeta: '13.03',
        count: '9',
      },
      {
        variant: 'like' as const,
        topPill: t('auctionPosts.trending.pill', locale),
        topBadge: t('auctionPosts.trending.badgeAd', locale),
        centerPill: t('auctionPosts.trending.like', locale),
        line1: t('auctionPosts.trending.card2.line1', locale),
        line2: t('auctionPosts.trending.card2.line2', locale),
        progress: 0.58,
        price: '$2.80',
        rightMeta: '3.6',
        count: '9',
      },
      {
        variant: 'live' as const,
        topPill: t('auctionPosts.trending.pill', locale),
        topBadge: t('auctionPosts.trending.badgeAd', locale),
        centerPill: t('auctionPosts.trending.live', locale),
        line1: t('auctionPosts.trending.card3.line1', locale),
        line2: t('auctionPosts.trending.card3.line2', locale),
        progress: 0.66,
        price: '$8.90',
        rightMeta: '33.5',
        count: '9',
      },
    ],
    [locale]
  )

  const livePackage = useMemo(
    () => [
      {
        preview: 'upload' as const,
        pill: t('auctionPosts.live.pill.community', locale),
        title: t('auctionPosts.live.card1.title', locale),
        price: '$3.00',
        priceNote: t('auctionPosts.live.priceNote.bid', locale),
        cols: [
          { k: t('auctionPosts.live.col1.k', locale), v: t('auctionPosts.live.col1.v', locale) },
          { k: t('auctionPosts.live.col2.k', locale), v: t('auctionPosts.live.col2.v', locale) },
        ],
        footerPrice: '$2.80',
        footerUnit: t('auctionPosts.live.unit.rma', locale),
        cta: t('auctionPosts.cta.boostAd', locale),
        ctaTone: 'gold' as const,
        footerNote: t('auctionPosts.live.footerNote.a', locale),
      },
      {
        preview: 'boost' as const,
        pill: t('auctionPosts.live.pill.community', locale),
        title: t('auctionPosts.live.card2.title', locale),
        price: '$3.00',
        priceNote: t('auctionPosts.live.priceNote.shares', locale),
        cols: [
          { k: t('auctionPosts.live.col1.k', locale), v: t('auctionPosts.live.col1.v', locale) },
          { k: t('auctionPosts.live.col2.k', locale), v: t('auctionPosts.live.col2.v', locale) },
        ],
        footerPrice: '$5.69',
        footerUnit: t('auctionPosts.live.unit.rma', locale),
        cta: t('auctionPosts.small.captions', locale),
        ctaTone: 'green' as const,
        footerNote: t('auctionPosts.live.footerNote.b', locale),
      },
      {
        preview: 'timer' as const,
        pill: t('auctionPosts.live.pill.community', locale),
        title: t('auctionPosts.live.card3.title', locale),
        price: '$7.00',
        priceNote: t('auctionPosts.live.priceNote.bid', locale),
        cols: [
          { k: t('auctionPosts.live.col1.k', locale), v: t('auctionPosts.live.col1.v', locale) },
          { k: t('auctionPosts.live.col2.k', locale), v: t('auctionPosts.live.col2.v', locale) },
        ],
        footerPrice: '$2.00',
        footerUnit: t('auctionPosts.live.unit.rma', locale),
        cta: t('auctionPosts.cta.boostAd', locale),
        ctaTone: 'gold' as const,
        footerNote: t('auctionPosts.live.footerNote.c', locale),
      },
    ],
    [locale]
  )

  return (
    <div className={styles.outerCard}>
      {/* Header row like image */}
      <div className={styles.headerRow}>
        <div className={styles.brandLeft}>
          <span className={styles.brandName}>ANANAS</span>
          <span className={styles.brandPine} aria-hidden="true">
            🍍
          </span>
        </div>
        <div className={styles.brandRight}>{t('auctionPosts.brandGuide', locale)}</div>
      </div>

      {/* palette */}
      <div className={styles.paletteRow}>
        {palette.map((p, idx) => (
          <div key={idx} className={styles.paletteItem}>
            <span className={styles.paletteDot} style={{ background: p.color }} aria-hidden="true" />
            <span className={styles.paletteText}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* mascot hero square */}
      <div className={styles.heroWrap}>
        <div className={styles.heroSquare}>
          <MascotSvg />
        </div>
      </div>

      {/* Trending */}
      <div className={styles.section}>
        <h3 className={styles.sectionH}>{t('auctionPosts.trendingTitle', locale)}</h3>
        <div className={styles.cardsRow}>
          {trending.map((c, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.tCard} ${idx === activeTrending ? styles.cardActive : ''}`}
              onClick={() => setActiveTrending(idx)}
            >
              <div className={styles.tCardTop}>
                <span className={styles.topPill}>{c.topPill}</span>
                <span className={styles.topBadge}>{c.topBadge}</span>
              </div>

              {c.variant === 'timer' ? (
                <div className={`${styles.tPreview} ${styles.tPreviewGreen}`}>
                  <div className={styles.tTimePill}>{c.pill}</div>
                  <div className={styles.tMainTime}>{c.main}</div>
                  <div className={styles.tProgress} aria-hidden="true">
                    <div className={styles.tProgressFill} style={{ width: `${Math.round(c.progress * 100)}%` }} />
                    <div className={styles.tProgressMarks}>
                      <span>☆</span>
                      <span>☆</span>
                      <span>☆</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.tPreview} ${styles.tPreviewWhite}`}>
                  <div className={styles.tCenterPill}>{c.centerPill}</div>
                  <div className={styles.tPreviewText}>{c.line1}</div>
                  <div className={styles.tPreviewSub}>{c.line2}</div>
                  <div className={styles.tProgress} aria-hidden="true">
                    <div className={styles.tProgressFill} style={{ width: `${Math.round(c.progress * 100)}%` }} />
                    <div className={styles.tProgressMarks}>
                      <span>☆</span>
                      <span>☆</span>
                      <span>☆</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.tInfoRow}>
                <div className={styles.tPriceLine}>
                  <span className={styles.tPriceStrong}>{c.price}</span>
                  <span className={styles.tAdDot}>.</span>
                  <span className={styles.tAd}>{t('auctionPosts.trending.badgeAd', locale)}</span>
                </div>
                <div className={styles.tRightMeta}>{c.rightMeta}</div>
              </div>

              <div className={styles.tMetaRow}>
                <div className={styles.tMetaLeft}>
                  <span aria-hidden="true">👍</span>
                  <span aria-hidden="true">♡</span>
                  <span aria-hidden="true">💬</span>
                </div>
                <div className={styles.tMetaRight}>
                  <span className={styles.tMetaSquare} aria-hidden="true">
                    ▢
                  </span>
                  <span className={styles.tMetaCount}>{c.count}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Package */}
      <div className={styles.section}>
        <h3 className={styles.sectionH}>{t('auctionPosts.livePackageTitle', locale)}</h3>
        <div className={styles.cardsRow}>
          {livePackage.map((c: any, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.lpCard} ${idx === activeLive ? styles.cardActiveBlue : ''}`}
              onClick={() => setActiveLive(idx)}
            >
              {/* Top preview box (exact layout like screenshot) */}
              {c.preview === 'upload' ? (
                <div className={`${styles.lpPreview} ${styles.lpPreviewLight}`}>
                  <div className={styles.lpLiveBadge}>{t('auctionPosts.tag.live', locale)}</div>
                  <div className={styles.lpUploadIcon} aria-hidden="true">
                    <svg width="54" height="54" viewBox="0 0 24 24">
                      <path
                        d="M12 3l4 4h-3v6h-2V7H8l4-4z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.lpPreviewCaption}>
                    <span className={styles.lpCoin} aria-hidden="true">
                      🪙
                    </span>
                    <div>
                      <div className={styles.lpPrevTitle}>{t('auctionPosts.live.card1.topTitle', locale)}</div>
                      <div className={styles.lpPrevSub}>{t('auctionPosts.live.card1.topSub', locale)}</div>
                    </div>
                  </div>
                </div>
              ) : c.preview === 'boost' ? (
                <div className={`${styles.lpPreview} ${styles.lpPreviewMint}`}>
                  <div className={styles.lpBoostCenter}>
                    <div className={styles.lpBoostTop}>{t('auctionPosts.live.card2.topTitle', locale)}</div>
                    <div className={styles.lpBoostMid}>{t('auctionPosts.live.card2.topSub', locale)}</div>
                    <div className={styles.lpBoostTime}>33:00</div>
                    <div className={styles.lpBoostBottom}>
                      <span className={styles.lpPineTiny} aria-hidden="true">
                        🍍
                      </span>
                      <span className={styles.lpBoostBtn}>{t('auctionPosts.cta.boostAd', locale)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.lpPreview} ${styles.lpPreviewDark}`}>
                  <div className={styles.lpDarkTime}>09:00</div>
                  <div className={styles.lpDarkRow}>
                    <span className={styles.lpCoinDark} aria-hidden="true">
                      🪙
                    </span>
                    <span className={styles.lpDarkValue}>$891</span>
                    <span className={styles.lpDarkBio}>{t('auctionPosts.live.bio', locale)}</span>
                  </div>
                  <div className={styles.lpDarkBottom}>
                    <span className={styles.lpFlame} aria-hidden="true">
                      🔥
                    </span>
                    <span className={styles.lpBidBtn2}>{t('auctionPosts.cta.bid', locale)}</span>
                  </div>
                </div>
              )}

              {/* Body like screenshot */}
              <div className={styles.lpBody}>
                <span className={styles.lpPill}>{c.pill}</span>
                <div className={styles.lpTitle}>{c.title}</div>
                <div className={styles.lpPriceRow}>
                  <span className={styles.lpPrice}>{c.price}</span>
                  <span className={styles.lpPriceNote}>{c.priceNote}</span>
                </div>

                <div className={styles.lpCols}>
                  {c.cols.map((x: any, i: number) => (
                    <div key={i} className={styles.lpCol}>
                      <div className={styles.lpColK}>{x.k}</div>
                      <div className={styles.lpColV}>{x.v}</div>
                    </div>
                  ))}
                </div>

                <div className={styles.lpFooter}>
                  <div className={styles.lpFooterLeft}>
                    <div className={styles.lpFooterPrice}>
                      {c.footerPrice} <span className={styles.lpUnit}>{c.footerUnit}</span>
                    </div>
                    <div className={styles.lpFooterIcons}>
                      <span aria-hidden="true">♥</span>
                      <span className={styles.lpI}>0</span>
                      <span aria-hidden="true">👁</span>
                      <span className={styles.lpI}>10</span>
                    </div>
                  </div>

                  <div className={styles.lpFooterRight}>
                    <span className={`${styles.lpCta} ${c.ctaTone === 'green' ? styles.lpCtaGreen : styles.lpCtaGold}`}>
                      {c.cta}
                    </span>
                    <div className={styles.lpFooterNote}>{c.footerNote}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Post Ad */}
      <div className={styles.section}>
        <h3 className={styles.sectionH}>{t('auctionPosts.postAdTitle', locale)}</h3>
        <div className={styles.postRow} aria-label="Mascots">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.postMascot} style={{ animationDelay: `${i * 90}ms` }}>
              <span aria-hidden="true">🍍</span>
            </div>
          ))}
        </div>
        <p className={styles.postDesc}>{t('auctionPosts.postAdDesc', locale)}</p>
      </div>
    </div>
  )
}

