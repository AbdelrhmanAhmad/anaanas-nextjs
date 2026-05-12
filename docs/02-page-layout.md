# 02 — ترتيب الصفحة الرئيسية

ملف: `app/[locale]/(pages)/page.tsx`

## الفكرة

نريد ترتيبًا مختلفًا بين الديسكتوب والموبايل بدون تكرار للمكوّنات:

- **ديسكتوب**: `Banner → CreatePost → Feeds`
- **موبايل**: `Banner → CreatePost → DiscoveryRow → MobileLatestAds → Feeds`

## الحل

نضع `CreatePostCardLazyClient` **قبل** صف الاكتشاف الذي يحمل
`d-md-none`. الصف يختفي تلقائيًا على `md+` فيبقى الترتيب على الديسكتوب
كما هو، ويظهر على الموبايل في موقعه المرغوب.

```tsx
<HomeBanner locale={uiLocale} />

{/*
 * CreatePostCardLazyClient — moved before the mobile discovery row.
 * The row is hidden on md+ (d-md-none) so visual order stays:
 *   desktop: Banner → CreatePost → Feeds
 *   mobile : Banner → CreatePost → DiscoveryRow → Feeds
 */}
<CreatePostCardLazyClient />

<Row className={`g-3 ${homeDiscoveryStyles.discoveryRow} d-md-none`}>
  {showMobileAiDashboard ? (
    <Col md={12} lg={5} className={homeDiscoveryStyles.discoveryAi}>
      <MobileAIDashboard locale={uiLocale === 'en' ? 'en' : 'ar'} className="h-100" />
    </Col>
  ) : null}
  <Col md={12} lg={showMobileAiDashboard ? 7 : 12} className={homeDiscoveryStyles.discoverySections}>
    <MobileSectionsSwiper sections={sections} locale={uiLocale} />
    {showMobileAiDashboard ? <MobileAiPromoGrid locale={uiLocale} /> : null}
  </Col>
</Row>

<MobileLatestAdsSection locale={uiLocale} />

<div className="vstack mt-3 gap-4">
  <Feeds filters={{ page, basePath: `/${locale}` }} />
</div>
```

## مزايا الحل

- **نسخة واحدة فقط** من `CreatePostCard` (مكوّن ثقيل ~2000 سطر مع
  form state، modals، fetches) — لا نخاطر بحالة مكررة.
- لا حاجة لـ `display: flex; order: …` مخصصة.
- يعتمد فقط على Utility class الموجودة في Bootstrap (`d-md-none`).

## ملاحظات أخرى تم تعديلها

1. تعليقات JS بصيغة `//` كانت داخل JSX، وكانت تُرسم كنص:
   ```tsx
   <HomeBanner />
   // mobile CreatePostCardLazyClient
   <Row>...</Row>
   ```
   استُبدلت بـ `{/* … */}` لتعليق JSX صحيح.

2. تأكيد أن `MOBILE_AI_PREVIEW_USER_ID` يبقى مرّكزًا في مكان واحد:
   ```ts
   const MOBILE_AI_PREVIEW_USER_ID = '28775'
   const showMobileAiDashboard =
     true /* أو session?.user?.id === MOBILE_AI_PREVIEW_USER_ID */
   ```

## ملفات ذات صلة

- `app/[locale]/(pages)/homeDiscovery.module.css` يحدّد:
  - `.discoveryRow` (هوامش)
  - `.discoveryAi section { padding: 0 !important }` لمنع padding عام من
    `_reboot.scss`
  - `.discoverySections { min-width: 0 }` لتجنّب الفيض الأفقي
