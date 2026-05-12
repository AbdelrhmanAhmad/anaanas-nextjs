# 04 — بانر التحديثات اليومية للموبايل

## الملفات

- `components/layout/ResponsiveDailyUpdatesBanner.tsx`
- `components/layout/mobile/MobileDailyUpdatesBanner.tsx`
- `components/layout/mobile/MobileDailyUpdatesBanner.module.css`

## الفكرة

عرض تنبيهات مختصرة وعروض اليوم في شريط بصري دافئ، مع أزرار سريعة
(quick actions) لميزات مستقبلية (تظهر فقط لمستخدم المعاينة).

## التبديل

```tsx
// ResponsiveDailyUpdatesBanner.tsx
const { data: session } = useSession()
const showQuickActions = session?.user?.id === '28775'

return (
  <>
    <div className="d-none d-lg-block"><DailyUpdatesBanner /></div>
    <div className="d-block d-lg-none">
      <MobileDailyUpdatesBanner showQuickActions={showQuickActions} />
    </div>
  </>
)
```

## المكوّن

### Props

```ts
type Props = { showQuickActions?: boolean }
```

### المحتوى

- شريط أفقي بقاعدة كريمية + لمسات ذهبية/مرجانية.
- رسالة ترحيب + سطر تنبيه.
- **Quick actions** (مخفية افتراضيًا):
  - "أضف إعلان"
  - "افتح مزاد"
  - "حملة ذكية"

### CSS أبرز نقاط

- `padding: 0 !important;` يطبّق على الـ wrapper لتجاوز
  `section { padding: 6rem 0 }` من `_reboot.scss`.
- شرائح شفافة فوق التدرج لإيحاء العمق:
  ```css
  background:
    radial-gradient(380px 240px at 92% -12%, rgba(254,203,1,.16), transparent 58%),
    linear-gradient(165deg, #fffdf7 0%, #fff8eb 52%, #fff3dc 100%);
  ```
- زوايا `14px` وحدود خفيفة جداً.

## تجاوب

- على شاشات `< 360px` يطوي الأزرار السريعة في صف ثاني.
- النص يستخدم `clamp` لتفادي الفيض على ألسنة LCD صغيرة.
