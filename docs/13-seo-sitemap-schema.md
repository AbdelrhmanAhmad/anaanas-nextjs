# SEO: Schema, Sitemaps, robots.txt

**التاريخ:** 2026-06-13  
**النطاق:** Frontend + Backend

---

## سياسة الفهرسة للمنشورات

المنشور يبقى **عاماً وقابلاً للأرشفة** طالما:

- `status = active` (معتمد/منشور)
- غير مخفي من الإدارة
- غير معطّل من المستخدم/الإدارة
- غير soft-deleted
- غير `rejected` أو `pending_review`
- غير spam

**لا يوجد انتهاء صلاحية تلقائي للإعلانات.** المنشورات القديمة تبقى مفهرسة.

---

## 1. Structured Data (JSON-LD)

**الملف:** `lib/seo/buildPostStructuredData.ts`

| نوع الإعلان | Schema |
|-------------|--------|
| إعلان عادي (صورة + سعر + عملة) | `Product` + `Offer` + `areaServed` |
| وظيفة (section/category يحتوي jobs/وظائف) | `JobPosting` (بدون `validThrough`) |
| غير مكتمل | `WebPage` + `BreadcrumbList` |

**قواعد:**
- لا بيانات وهمية
- العملة من `country.iso2` فقط عند التطابق
- لا `validThrough` للوظائف — لا يوجد حقل deadline في DB

---

## 2. Sitemaps (لكل دولة فرعية)

### على `jo.anaanas.com`

| URL | المحتوى |
|-----|---------|
| `/sitemap.xml` | فهرس → 4 sitemaps فرعية |
| `/sitemap-static.xml` | الرئيسية، select-country، contact |
| `/sitemap-sections.xml` | أقسام + فئات |
| `/sitemap-cities.xml` | `?city_id=` لأقسام بها منشورات |
| `/sitemap-posts.xml` | منشورات `active` فقط |

### على apex

`/sitemap.xml` → فهرس يشير إلى `https://{iso}.anaanas.com/sitemap.xml`

### Backend API

```
GET /api/sitemap/countries
GET /api/sitemap/sections?country_iso2=jo
GET /api/sitemap/cities?country_iso2=jo
GET /api/sitemap/posts?country_iso2=jo&page=1
```

### Job يومي

```bash
php artisan sitemap:generate
```

الملفات تُكتب إلى: `storage/app/sitemap-cache/{iso2}/`  
(وليس `storage/app/` مباشرة)

مجدول يومياً **02:30**.

### اختبار الـ sitemaps

**يجب فتح sitemaps على نطاق الدولة:**
```
https://jo.anaanas.com/sitemap.xml
https://jo.anaanas.com/sitemap-posts.xml
```

وليس على apex فقط — `sitemap-posts.xml` على apex بدون subdomain يكون فارغاً عمداً.

**متغيرات بيئة الفرونت (إنتاج):**
```
NEXT_PUBLIC_API_BASE_URL=https://api.anaanas.com
NEXT_PUBLIC_BASE_DOMAIN=anaanas.com
NEXT_PUBLIC_SITE_URL=https://anaanas.com
```

---

## 3. robots.txt

**الملف:** `app/robots.txt/route.ts`

- `Sitemap` و `Host` ديناميكيان حسب subdomain
- يمنع: `/api`, `/auth`, `/dashboard`, `/profile`, `/search`, query filters

---

## 4. noindex — صفحات رفيعة فقط

| الصفحة | القاعدة |
|--------|---------|
| `/search` | دائماً noindex |
| sections مع فلاتر (سعر، q، sort…) | noindex |
| sections مع `city_id` فقط صفحة 1 | index (لـ sitemap-cities) |
| pending / rejected / غير active | noindex |
| **منشور قديم active** | **index** ✅ |

---

## 5. Open Graph / Twitter / Canonical

- منشورات: OG/Twitter + canonical من host الفعلي (subdomain-aware)
- hreflang على الرئيسية والمنشورات

---

## 6. التحقق

```bash
php artisan sitemap:generate
npm run build

curl -s https://jo.anaanas.com/sitemap.xml
curl -s https://jo.anaanas.com/robots.txt
```

---

## ملاحظات

- لا عمود `currency` في DB — العملة من خريطة ISO2
- slug قسم الوظائف من API — عدّل `lib/seo/isJobListing.ts` عند الحاجة
