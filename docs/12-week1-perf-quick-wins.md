# Week 1 — تحسينات أداء سريعة (قابلة للتراجع)

**التاريخ:** 2026-06-13  
**الحالة:** مُطبَّق محلياً — لم يُرفع بعد  
**الهدف:** خفض CLS وتحسين LCP دون المساس بإصلاحات SSR/SEO السابقة.

---

## المشكلة قبل التغيير

| المقياس | القيمة | السبب الرئيسي |
|---------|--------|----------------|
| LCP | ~3.0s | شعار Splash بـ `fetchPriority="high"` يتنافس مع المحتوى |
| CLS | ~0.279 | `AnnouncementModal` يفتح بعد 1.2s ويضيف `body.modal-open` |
| Speed Index | ~3.4s | Splash + Modal + CSS blocking |

---

## ما تم تغييره

### 1. ثوابت قابلة للضبط — `lib/perf/week1HomePerf.ts` (جديد)

| الثابت | القيمة | الغرض |
|--------|--------|--------|
| `ANNOUNCEMENT_SHOW_DELAY_MS` | 8000 | تأخير فتح المودال بعد `window.load` |
| `SPLASH_ENABLE_DELAY_MS` | 400 | تأخير إظهار Splash ليُرسم المحتوى أولاً |
| `SPLASH_MAX_VISIBLE_MS` | 2500 | إخفاء Splash قسراً إن تأخرت الـ hydration |

**التراجع:** احذف الملف وأعد القيم القديمة في الملفات أدناه.

---

### 2. AnnouncementModal — `components/layout/AnnouncementModal.tsx`

**قبل:** `SHOW_DELAY_MS = 1200` — يفتح بعد 1.2s من mount.  
**بعد:** ينتظر `window.load` ثم 8 ثوانٍ إضافية قبل الفتح.

**التأثير المتوقع:** CLS أقل في قياس Lighthouse الأولي؛ المودال ما زال يظهر للمستخدم لاحقاً.

**التراجع:**
```ts
const SHOW_DELAY_MS = 1200
// والمنطق القديم: setTimeout(() => setShow(true), SHOW_DELAY_MS)
```

---

### 3. Splash / LCP — `app/layout.tsx`

| التغيير | قبل | بعد |
|---------|-----|-----|
| تفعيل Splash | فوري (`js-splash` في `<head>`) | بعد `SPLASH_ENABLE_DELAY_MS` (400ms) |
| `fetchPriority` على الشعار | `high` | `low` |
| `alt` على شعار Splash | `ANANAS` | `""` (تزييني فقط — `aria-hidden` على الحاوية) |

**التراجع:**
```js
document.documentElement.classList.add("js-splash")
// fetchPriority="high" و alt="ANANAS"
```

---

### 4. إخفاء Splash — `components/wrappers/AppProvidersWrapper.tsx`

**إضافة:** مؤقت `SPLASH_MAX_VISIBLE_MS` (2.5s) يضيف class `remove` حتى لو لم تكتمل الـ hydration.

**التراجع:** أزل `maxVisibleTimer` وأعد `splashScreen.classList.add('remove')` فقط عبر MutationObserver.

---

### 5. CLS من scrollbar — `assets/scss/style.scss`

**إضافة:**
```scss
html {
  scrollbar-gutter: stable;
}
```

يقلل القفزة عند `body.modal-open` (Bootstrap يضيف padding للـ scrollbar).

**التراجع:** احذف كتلة `html { scrollbar-gutter: stable; }`.

---

### 6. تأجيل تحميل Modal — `components/layout/AnnouncementModalLazy.tsx` (جديد) + `app/[locale]/layout.tsx`

**قبل:** استيراد مباشر لـ `AnnouncementModal` في Server Layout.  
**بعد:** غلاف client `AnnouncementModalLazy` يستخدم `dynamic(..., { ssr: false })`.

**التراجع:** احذف `AnnouncementModalLazy.tsx` وأعد الاستيراد المباشر في `app/[locale]/layout.tsx`.

---

### 7. hreflang للرئيسية — `lib/seo/buildHomeMetadata.ts`

**إضافة:**
```ts
alternates: {
  canonical,
  languages: {
    ar: `${origin}/ar`,
    en: `${origin}/en`,
    'x-default': `${origin}/ar`,
  },
},
```

**التحقق:** `curl -s URL | grep alternate` يجب أن يُظهر روابط `ar` و`en`.

**التراجع:** `alternates: { canonical }` فقط.

---

### 8. Cache لملفات اللغة — `next.config.ts`

**إضافة:** `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` لـ `/styles/:path*`.

**ملاحظة:** صور CloudFront ما زالت تحتاج ضبط TTL من DevOps (خارج نطاق هذا الـ PR).

**التراجع:** احذف كتلة `source: '/styles/:path*'`.

---

## ما لم يُلمَس (عمداً)

- `dynamic()` في `app/layout.tsx` — يبقى استيراد مباشر لـ SSR.
- `HomeBanner` كـ Server Component — أسبوع 2.
- Bootstrap / `style.scss` bundle كامل — أسبوع 2–3.
- CloudFront TTL للصور — توصية DevOps فقط.

---

## كيفية التراجع الكامل

إذا قلت **«تراجع»**، نفّذ أحد الخيارين:

### أ) Git (إن لم يُكمَت بعد)
```bash
git checkout -- app/layout.tsx app/[locale]/layout.tsx
git checkout -- components/layout/AnnouncementModal.tsx
git checkout -- components/wrappers/AppProvidersWrapper.tsx
git checkout -- lib/seo/buildHomeMetadata.ts
git checkout -- assets/scss/style.scss
git checkout -- next.config.ts
rm lib/perf/week1HomePerf.ts components/layout/AnnouncementModalLazy.tsx
```

### ب) يدوياً
عدّل الثلاثة ثوابت في `lib/perf/week1HomePerf.ts`:
- `ANNOUNCEMENT_SHOW_DELAY_MS` → `1200`
- `SPLASH_ENABLE_DELAY_MS` → `0`
- `SPLASH_MAX_VISIBLE_MS` → احذف المؤقت من `AppProvidersWrapper`

---

## خطة التحقق

1. **Lighthouse** (Mobile, Slow 4G) على الرئيسية قبل/بعد.
2. **CLS:** تأكد أن `body.modal-open` لا يظهر في أول 5 ثوانٍ.
3. **LCP:** يجب أن يكون عنصر المحتوى (بانر/بطاقة) وليس `.splash-logo`.
4. **SEO:** `view-source` → `<link rel="alternate" hreflang="ar">` موجود.
5. **تجربة المستخدم:** Splash يظهر ~400ms ثم يختفي؛ المودال بعد ~8s من اكتمال التحميل.

---

## الخطوة التالية (أسبوع 2 — عند الموافقة)

1. `HomeBanner` → Server Component + `preload` لأول slide.
2. أبعاد ثابتة لصور `PostCard`.
3. تقسيم CSS (Bootstrap utilities فقط في المسار الحرج).
