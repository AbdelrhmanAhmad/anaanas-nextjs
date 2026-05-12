# 08 — ترتيب `CreatePostCardLazyClient` على الموبايل

## الهدف

- **ديسكتوب**: تبقى البطاقة في موضعها بعد قسم الاكتشاف.
- **موبايل**: تظهر مباشرة بعد `HomeBanner` وقبل صف الاكتشاف
  (`d-md-none`).

## لماذا لا نكرر المكوّن؟

`CreatePostCard.tsx` بحجم ~2000 سطر، ويستخدم:
- `useSession()`
- `useRouter()`
- `useForm` + `yup`
- Modals (نجاح، تسجيل دخول)
- Lazy fetches للأقسام والحقول

تكراره يعني:
- مزدوج تشغيل `fetchSections/fetchFields`.
- حالة form منفصلة لكل نسخة.
- modals تظهر مرتين أو من النسخة الخاطئة.

## الحل البسيط

نقل الـ JSX إلى ما **قبل** الصف الذي يحمل `d-md-none`:

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
  ...
</Row>
```

### النتيجة على الديسكتوب

`Banner → CreatePost → (الصف مخفي) → Feeds` = نفس الترتيب السابق
بصريًا.

### النتيجة على الموبايل

`Banner → CreatePost → DiscoveryRow → Feeds` = الترتيب المطلوب.

## بدائل مرفوضة

| البديل                              | السبب                                                    |
| ----------------------------------- | -------------------------------------------------------- |
| نسختان بـ `d-md-none` و `d-none d-md-block` | تكرار حالة كاملة لـ CreatePostCard               |
| `display: flex; order: …` على Col   | يتطلب تحويل Col لـ flex container ويُعقّد BS Layout       |
| إعادة بناء Col بـ JS conditional    | حالة form ضائعة إذا تغيّر العرض                          |

## ملاحظات إضافية

- حدثت أيضًا تنظيفات لتعليقات `//` كانت داخل JSX (كانت تُرسم كنص حرفي):
  - `// mobile CreatePostCardLazyClient`
  - `// هنا سكشن أحدث الإعلانات...`

  استُبدلت بـ `{/* … */}`.
