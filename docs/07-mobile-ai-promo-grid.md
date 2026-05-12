# 07 — `MobileAiPromoGrid`

## الملفات

- `app/[locale]/(pages)/home/components/MobileAiPromoGrid.tsx`
- `app/[locale]/(pages)/home/components/MobileAiPromoGrid.module.css`

## الـ Props

```ts
type Props = {
  locale: SupportedLocale
  className?: string
}
```

## الهيكل النهائي

```
topRow (3 بطاقات معلوماتية مدمجة)
└── 🔥 الأكثر تفاعلاً اليوم
└── 🎯 فرص مخصصة لك
└── ⚡ إعلانات ذكية مضافة

bottomStack
├── bottomPair (عمودان)
│   ├── 🎁 Hot deals — تايمر يعد تنازليًا (HH:MM:SS)
│   └── 🔨 Auctions  — زر "استكشف المزادات"
└── fSmartWide (شريط عريض)
    └── 🤖 Smart ads + أيقونة SmartAdsAiIcon (SVG inline)
```

## قرارات التصميم

### الصف العلوي

- `align-items: start` على `.topRow` يمنع تمدّد ارتفاع الصف لطول أعلى بطاقة.
- `padding` صغير (`6×7px`).
- عنوان `11px / 600`, وصف `9px / 500`.
- لمعة `pillShine` بطيئة (`9s`) وشفافية أقل لتقليل الضوضاء البصرية.

### الصف الثاني

```css
.bottomPair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.bottomPair .fCard:first-child { animation-delay: 0s }
.bottomPair .fCard:last-child  { animation-delay: -2s }
.fSmartWide                    { animation-delay: -4s }
```

### شريط Smart ads العريض

- **بدون صورة بكسلية**: حُذف `next/image` وملف الأناناس.
- أيقونة SVG inline داخل المكوّن:
  ```tsx
  function SmartAdsAiIcon({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
        {/* نجوم + بطاقة ذات خطوط نصية */}
      </svg>
    )
  }
  ```
- حاوية `smartIconWrap` مربعة `48×48` بحواف `12px`:
  ```css
  .smartIconWrap {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    color: #059669;
    background: rgba(255,255,255,.55);
    border: 1px solid rgba(5,150,105,.22);
    box-shadow: 0 2px 8px rgba(16,185,129,.12);
    animation: smartIconBob 4s ease-in-out infinite;
  }
  ```

## الأنيميشن CSS (كلها infinite + احترام reduced motion)

| Keyframe          | الموقع / الغرض                                  |
| ----------------- | ----------------------------------------------- |
| `cardFloat`       | طفو خفيف للبطاقة                                |
| `cardAurora`      | هالة لون داخل البطاقة                           |
| `pillShine`       | لمعة قطرية على بطاقات الصف العلوي                |
| `ctaShine`        | لمعة على زر "استكشف المزادات"                   |
| `ctaPulse`        | نبض ظل الزر                                     |
| `emojiFire`       | تكبير وتوهّج لإيموجي 🔥                          |
| `emojiTarget`     | دوران خفيف للإيموجي 🎯                          |
| `emojiBolt`       | فلاش للإيموجي ⚡                                 |
| `emojiWobble`     | اهتزاز عام للإيموجي                             |
| `hammerHeadTap`   | نقرة مطرقة في رأس بطاقة المزادات                 |
| `hammerSwing`     | تأرجح المطرقة الكبيرة                          |
| `giftBounce`      | نطّ خفيف لـ 🎁                                  |
| `timerPulse`      | خانات العداد تنبض                              |
| `blink`           | وميض النقطتين بين الخانات                       |
| `smartIconBob`    | هبوط/صعود لأيقونة Smart ads                     |
| `sparkleDrift`    | شرارة ✨ تنزاح فوق البطاقة الخضراء              |

## دخول المكوّن (Motion)

```tsx
<motion.section
  initial={{ opacity: 0, y: 4 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
>
```

> الستاجر لداخل البطاقات يأتي من تأخيرات CSS بدل Motion variants
> (لأن البطاقات هنا متجانسة وليست مكرّرة من قائمة).

## التجاوب

`@media (max-width: 380px)`:

```css
.topRow, .bottomStack { gap: 6px; }
.bottomPair           { gap: 6px; }
.topCard              { padding: 9px 8px; }
.topTitle             { font-size: 11px; }
.topSub               { font-size: 9px; }
.fCard                { padding: 10px; min-height: 136px; }
.bottomPair .fCard    { min-height: 132px; }
.fSmartWide .smartIconWrap { width: 44px; height: 44px; }
.fSmartWide .smartSvg      { width: 26px; height: 26px; }
```

## إتاحة وصول

- كل بلاطة عبارة عن `<Link>` Next.js إلى مسار محدد.
- `aria-live="polite"` على العدّاد التنازلي.
- إيموجي بـ `aria-hidden`.
- العنصر الجذري بـ `aria-label`.

## ملاحظات تنظيف

- جميع المراجع إلى الـ class القديم `.bottomRow` استُبدلت بـ
  `.bottomStack` و `.bottomPair` بما فيها داخل media queries.
- خاصية `.fSmartWide::after` لا تستخدم `transform: translateY` حتى لا
  تتعارض مع `sparkleDrift`.
