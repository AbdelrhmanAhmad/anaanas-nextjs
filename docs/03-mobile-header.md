# 03 — رأس الموبايل (`MobileTopHeader`)

## الملفات

- `components/layout/TopHeader/ResponsiveTopHeader.tsx`
- `components/layout/TopHeader/mobile/MobileTopHeader.tsx`
- `components/layout/TopHeader/mobile/MobileTopHeader.module.css`
- `components/layout/TopHeader/mobile/MobileNotificationsButton.tsx`
- `components/layout/TopHeader/mobile/MobileMessagesButton.tsx`
- `components/layout/TopHeader/mobile/MobileHeaderSearchBar.tsx`

## الفكرة

يفصل هيدر الديسكتوب الكلاسيكي عن هيدر مخصص للموبايل، ويختار بينهما
عبر utility classes:

```tsx
// ResponsiveTopHeader
<div className="d-none d-lg-flex"><TopHeader /></div>
<div className="d-flex d-lg-none"><MobileTopHeader /></div>
```

## مكوّنات الموبايل

### MobileTopHeader

- **شعار** بحجم `80×34px` (تعديل في `MobileTopHeader.module.css`):
  ```css
  .logo {
    width: 80px;
    height: 34px;
  }
  ```
- **شريط بحث مدمج**:
  - صورة المستخدم على اليسار
  - حقل بحث في المنتصف
  - أيقونة ميكروفون + زر مسح حسب الحالة
- **أزرار سريعة**:
  - `MobileNotificationsButton` — يكرر منطق `NotificationsBell` (عدّاد
    غير المقروء + قائمة منسدلة).
  - `MobileMessagesButton` — يقرأ عدد الرسائل غير المقروءة من
    `ChatContext`.

### MobileHeaderSearchBar

- أفاتار المستخدم (صورة Next.js مع fallback).
- زر ميكروفون يعرض حواراً للوصول إلى الصوت لو `MediaRecorder` متاح.
- زر مسح يظهر فقط حين يحتوي الحقل قيمة.

## الاستيراد في الـ layout

```tsx
// app/[locale]/layout.tsx
import ResponsiveTopHeader from '@/components/layout/TopHeader/ResponsiveTopHeader'
...
<ResponsiveTopHeader />
```

## ملاحظات أداء

- المكوّنات داخل `mobile/` كلها client-only (تستخدم hooks).
- الأيقونات `react-icons/bs` فقط؛ لا أيقونات SVG inline ضخمة.
- صورة الشعار من `next/image` بمسار ثابت، فلا re-layout عند التحميل.

## تجاوب وإتاحة وصول

- `aria-label` على كل زر (إشعارات/رسائل/ميكروفون).
- `tabIndex` افتراضي للأزرار، مع `focus-visible` بلون
  `outline: 2px solid #feca01`.
- إخفاء الأرقام عند صفر داخل العدادات.
