# 06 — `MobileAIDashboard`

## الملفات

- `app/[locale]/(pages)/home/components/MobileAIDashboard.tsx`
- `app/[locale]/(pages)/home/components/MobileAIDashboard.module.css`

## الـ Props

```ts
type MobileAIDashboardProps = {
  locale: 'ar' | 'en'
  className?: string
}
```

## الهيكل

```tsx
<motion.section className={`${styles.root} ${className}`} dir={isAr ? 'rtl' : 'ltr'}>
  <div className={styles.mesh} aria-hidden />

  <div className={styles.inner}>
    <motion.header className={styles.head} variants={headerVariants}>
      <h2 className={styles.headline}>
        <span className={styles.kicker}>مركز القرار</span>
        <span className={styles.title}>لوحة الذكاء الاصطناعي</span>
      </h2>
      <div className={styles.liveBadge}>
        <span className={styles.liveDot} />
        <span>مباشر</span>
      </div>
    </motion.header>

    <motion.ul className={styles.grid} variants={listVariants}>
      {cards.map(item => (
        <motion.li variants={itemVariants}>
          <div className={styles.tileShell}>
            <article className={`${styles.tile} ${item.tone}`}>
              <span className={styles.tileShine} />
              <span className={styles.tileOrb} />
              <div className={styles.tileBody}>
                <div className={styles.iconRail}>
                  <span className={styles.iconRing} />
                  <span className={styles.iconFloat}>
                    <Icon className={styles.iconSvg} />
                  </span>
                </div>
                <div className={styles.copy}>
                  <h3 className={styles.tileTitle}>{item.title}</h3>
                  <p className={styles.tileSub}>{item.subtitle}</p>
                </div>
              </div>
            </article>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  </div>
</motion.section>
```

## البطاقات الست

| id        | الأيقونة (SVG)    | الـ tone     | العنوان (ar / en)                             |
| --------- | ----------------- | ------------ | --------------------------------------------- |
| forecast  | `IconForecast`    | `.toneBlue`  | توقعات الذكاء / AI forecast                   |
| boost     | `IconBoost`       | `.toneGold`  | تعزيز ذكي / Smart boost                       |
| live      | `IconLive`        | `.toneCoral` | مزاد مباشر / Live bidding                     |
| audience  | `IconAudience`    | `.toneGreen` | مطابقة الجمهور / Audience match               |
| optimize  | `IconOptimize`    | `.toneTeal`  | تحسين تلقائي / Auto optimization              |
| shield    | `IconShield`      | `.tonePurple`| درع موثوق / Verified shield                   |

كل أيقونة SVG **inline** بـ `currentColor` (24×24)، لا صور بكسلية، حجم
الباندل أصغر.

## الأنيميشن

### دخول القسم (Motion / Variants)

```ts
const headerVariants = {
  hidden:  { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0,
             transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
}

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.072, delayChildren: 0.06 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 18, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1,
             transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } },
}
```

عند `useReducedMotion()` تتحول كل variants إلى ثابتة `{ opacity: 1, y: 0 }`.

### الحركة الدائمة (CSS infinite)

| Keyframe       | الهدف                                                     |
| -------------- | --------------------------------------------------------- |
| `meshSpin`     | تدوير `conic-gradient` خفيف خلف اللوحة (28s linear)        |
| `titleFlow`    | تدرّج لوني في العنوان (10s)                                |
| `badgeGlow`    | توهج شارة Live                                            |
| `livePulse`    | حلقة نابضة من النقطة الخضراء                              |
| `tileFloat`    | طفو رأسي صغير ±2px (على wrapper `.tileShell` لتجنّب تعارض) |
| `auroraDrift`  | توهج قطبي ينزاح داخل البطاقة                              |
| `shineSweep`   | لمعة قطرية تمر عبر البطاقة                                |
| `orbPulse`     | كرة لون في الزاوية تنبض                                   |
| `ringPulse`    | حلقة حول الأيقونة تنبض                                    |
| `iconBob`      | هبوط/صعود خفيف للأيقونة (على wrapper `.iconFloat`)         |

### حلّ تعارض `transform`

كان أنيميشن `tileFloat` يستخدم `transform` على البطاقة، مما يلغي
`transform` عند الـ hover. الحل:

- نقل أنيميشن الطفو إلى **غلاف خارجي** `.tileShell`.
- نقل `iconBob` إلى **غلاف داخلي** `.iconFloat` يحوي الـ `<svg>`.

## الـ Hover

```css
.tile:hover,
.tile:focus-visible {
  transform: translateY(-5px) scale(1.035);
  border-color: rgba(255,255,255,.95);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.88),
    0 14px 28px rgba(30,24,18,.10),
    0 6px 16px color-mix(in srgb, var(--accent) 18%, transparent),
    0 0 0 1px color-mix(in srgb, var(--accent-mid) 28%, transparent);
  filter: saturate(1.06) brightness(1.02);
}
```

- ارتفاع `5px` فقط (مناسب للبطاقات الصغيرة على الموبايل).
- ظل ملوّن مشتق من `--accent` عبر `color-mix`.
- اللمعة تتسارع (`animation-duration` يصبح `2.6s`).

## Tones

كل tone يحدّد `--surface`, `--orb-glow`, `--accent`, `--accent-mid`:

```css
.toneBlue {
  --surface: linear-gradient(152deg, #f5fafd 0%, #e3f0fa 48%, #cfe5f6 100%);
  --orb-glow: rgba(23,125,193,.35);
  --accent: #115f94;
  --accent-mid: var(--an-info);
}
/* …toneGold / toneCoral / toneGreen / toneTeal / tonePurple */
```

## إتاحة الوصول

- العنصر الجذري `aria-label`.
- `<h2>` يحوي kicker + title (هرمية صحيحة).
- كل بطاقة `tabIndex={0}` + `focus-visible` بلون ذهبي العلامة.
- `prefers-reduced-motion`: إلغاء جميع الأنيميشن + hover transform.

## تجاوب

`@media (max-width: 360px)`:
- `gap` بين البطاقات → `6px`
- `min-height` للبطاقة → `96px`
- `padding` → `9px 7px`
- الأيقونة → `19×19`
- الخط → 10px للعنوان / 8px للوصف
