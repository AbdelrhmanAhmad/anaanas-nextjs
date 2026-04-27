import styles from './SectionsResultsSkeleton.module.css'

type Props = {
  /** Number of placeholder cards */
  count?: number
}

export default function SectionsResultsSkeleton({ count = 4 }: Props) {
  return (
    <div
      className={styles.stack}
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading listings"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.line} ${styles.lineShort}`} />
          <div className={`${styles.line} ${styles.lineMedium}`} />
          <div className={styles.media} />
          <div className={`${styles.line} ${styles.lineLong}`} />
          <div className={styles.actions}>
            <span className={styles.pill} />
            <span className={styles.pill} />
            <span className={styles.pill} />
          </div>
        </div>
      ))}
    </div>
  )
}
