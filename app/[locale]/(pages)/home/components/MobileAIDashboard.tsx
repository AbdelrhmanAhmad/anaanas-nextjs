import { Card, CardBody } from 'react-bootstrap'
import styles from './MobileAIDashboard.module.css'

type MobileAIDashboardProps = {
  locale: 'ar' | 'en'
}

const MobileAIDashboard = ({ locale }: MobileAIDashboardProps) => {
  const isAr = locale === 'ar'

  const cards = [
    {
      icon: '⬆️',
      title: isAr ? 'توقعات الذكاء' : 'AI Forecast',
      subtitle: isAr ? '+33% عائد مرتفع' : '+33% High ROI',
      tone: styles.toneBlue,
    },
    {
      icon: '🚀',
      title: isAr ? 'تعزيز ذكي' : 'Smart Boost',
      subtitle: isAr ? '14 حملة نشطة' : '14 Campaigns Active',
      tone: styles.toneGold,
    },
    {
      icon: '🤍',
      title: isAr ? 'مزاد مباشر' : 'Live Bidding',
      subtitle: isAr ? '82 عرضًا نشطًا' : '82 Active',
      tone: styles.toneCoral,
    },
    {
      icon: '🟢',
      title: isAr ? 'مطابقة الجمهور' : 'Audience Match',
      subtitle: isAr ? '91% تطابق ممتاز' : '91% Excellent',
      tone: styles.toneGreen,
    },
    {
      icon: '✨',
      title: isAr ? 'تحسين تلقائي' : 'Auto Optimization',
      subtitle: isAr ? 'قيد التشغيل' : 'Running',
      tone: styles.toneTeal,
    },
    {
      icon: '🛡️',
      title: isAr ? 'درع موثوق' : 'Verified Shield',
      subtitle: isAr ? 'موثق بالكامل' : 'Verified',
      tone: styles.tonePurple,
    },
  ]

  return (
    <Card className={styles.wrapper}>
      <CardBody className={styles.body}>
        <h6 className={styles.heading}>{isAr ? 'لوحة الذكاء الاصطناعي' : 'AI Dashboard'}</h6>
        <div className={styles.grid} dir={isAr ? 'rtl' : 'ltr'}>
          {cards.map((item) => (
            <article key={item.title} className={`${styles.tile} ${item.tone}`}>
              <p className={styles.title}>
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
                {item.title}
              </p>
              <p className={styles.subtitle}>{item.subtitle}</p>
            </article>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default MobileAIDashboard
