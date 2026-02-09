 'use client'

import styles from '../auction.module.css'

const mascots = ['🍍', '😎', '🍍', '🧩', '🛠️', '🧑‍🔧']

export default function MascotsRow() {
  return (
    <div className={styles.mascots} aria-label="Mascots">
      {mascots.map((m, idx) => (
        <div
          key={idx}
          className={styles.mascot}
          aria-hidden="true"
          style={{ animationDelay: `${idx * 120}ms` }}
        >
          {m}
        </div>
      ))}
    </div>
  )
}

