# 05 — شبكة الأقسام على الموبايل (`MobileSectionsSwiper`)

## الملف

- `app/[locale]/(pages)/home/components/MobileSectionsSwiper.tsx`
- `app/[locale]/(pages)/home/components/MobileSectionsSwiper.module.css`

## الفكرة

استبدال Swiper الطولي (الذي كان يجبر المستخدم على السحب الأفقي) بشبكة
مربعة **4×2** ثابتة + مودال "عرض الكل" للأقسام المتبقية.

## Props

```ts
type Props = {
  sections: Section[]   // تأتي من fetchSections
  locale: SupportedLocale
}
```

## الهيكل

```tsx
<section className={styles.root}>
  <div className={styles.grid}>
    {firstEight.map(sec => <SectionTile sec={sec} />)}
    <button onClick={openModal} className={styles.tileMore}>
      <span>عرض الكل</span>
      <BsChevronLeft />
    </button>
  </div>
  <Modal show={open} onHide={close}>
    {/* قائمة كل الأقسام */}
  </Modal>
</section>
```

## CSS أبرز خصائص

```css
.root {
  padding: 0 !important; /* يهزم padding: 6rem 0; من _reboot */
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.tile {
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  background: linear-gradient(160deg, #fffaf0 0%, #fff3dc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tileLabel {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
}
```

## التجاوب

- `<360px`: `gap` يتقلّص إلى 6px، حجم الخط 11px.
- `>=420px`: التصميم يحافظ على 4 أعمدة (لا نوسّع لأكثر من ذلك على الموبايل).

## إتاحة الوصول

- زر "عرض الكل" بـ `aria-haspopup="dialog"`.
- المودال يستخدم `aria-labelledby`.
- العناصر داخل المودال قابلة للوصول بالكيبورد (TAB يدور بينها).
