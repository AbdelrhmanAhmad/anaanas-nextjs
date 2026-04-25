import styles from '../messaging.module.css'

export default function TypingIndicator() {
  return (
    <div className={styles.typingRow} role="status" aria-live="polite">
      <span className={styles.typingDot} />
      <span className={styles.typingDot} />
      <span className={styles.typingDot} />
    </div>
  )
}
