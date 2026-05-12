# واجهة معالج إنشاء الإعلان (`CreatePostCard`)

هذا المستند يلخّص سلوك الواجهة والأنماط المتعلقة بالمعالج (wizard)، بطاقات اختيار القسم/الفئة، والبطل، والملاحق الصوتية.

## الملفات الرئيسية

| الملف | الدور |
|--------|--------|
| `components/cards/CreatePostCard.tsx` | منطق الخطوات، التحقق، البطل، الشبكة، الأزرار |
| `components/cards/CreatePostCard.module.css` | أنماط البطل، الشبكة الزجاجية، أزرار التنقل |
| `lib/ui/wizardStepChime.ts` | نغمة تفاعل قصيرة داخل المعالج |

## البطل (`CreatePostHeroShell`)

- يظهر في **وضع الإنشاء** فقط (`!isEdit`) وفي **الخطوة 1** فقط (`step === 1`).
- حقل العنوان داخل كبسولة (`composerHeroInlineShell`) مع لاحقة داخلية **`composerHeroInlineAffix`** (ليست `<button>`): نفس منحى ألوان غلاف البطل الكريمي، تركيز الحقل أو فتح حوار تسجيل الدخول للضيف.

## التحقق من العنوان

- حقل **`title`** مفعّل في **جميع الخطوات** عبر `yup` (مع `trim()`).
- عند تغيير `step` يتم `trigger('title')` بعد `clearErrors()` لإبقاء التحقق متسقاً.

## أزرار التنقل (التالي / الرجوع / الإرسال)

- تصميم حديث: أساسي داكن بتدرّج slate مع لمسة ذهبية على الحدود؛ ثانوي أبيض/رمادي مع لمسة زرقاء عند الهوفر.
- على الموبايل (حتى `767.98px`): الصف أفقي، الزرّان بنفس العرض (`flex: 1 1 0`).
- أيقونات اتجاه: أسهم `BsArrowLeft` / `BsArrowRight` حسب اتجاه المعالج (RTL/LTR).

## اختيار القسم والفئة (الخطوتان 3 و 4)

### الشبكة

- الصنف **`wizardPickGridShowcase`**:
  - سطح المكتب: `repeat(auto-fill, minmax(148px, 1fr))`.
  - الموبايل (`max-width: 767.98px`): **3 أعمدة** `repeat(3, minmax(0, 1fr))` مع فراغ ضيق.

### البطاقات الزجاجية

- **`wizardPickCardGlass`**: زجاج (`backdrop-filter`)، حدود بيضاء شفافة، وهج داخلي (`::before` / `::after`).
- **`wizardGlassTint0` … `wizardGlassTint7`**: تدرجات ملوّنة خفيفة (بنفسجي، سماوي، زمردي، كهرماني، وردي، بنفسجي غامق، سيان، برتقالي).
- اختيار اللون **حسب معرف** القسم/الفئة (`pickWizardGlassTintClass(id)`) لضمان ثبات العرض بين الخادم والعميل.
- **`wizardPickCardActive`**: إطار وظل ذهبي دون إخفاء تدرج اللُطَف.
- **`wizardPickThumb`**: حجم الأيقونة أصغر على الموبايل، أكبر من `768px`.

### الحركة

- كل بطاقة ملفوفة في **`motion.div`**: دخول متدرّج، `whileHover` / `whileTap` (مع احترام `prefers-reduced-motion`).

## الصوت

- **`playWizardStepChime()`**: نغمة قصيرة (Web Audio API) عند ضغط أزرار التنقل وبطاقات القسم/الفئة.
- **لا يُشغَّل** إذا كان `prefers-reduced-motion: reduce`.
- سياق صوتي مشترك (`AudioContext`) في `wizardStepChime.ts` لتقليل إنشاء سياقات متكررة.

## ملاحظات للمطورين

- عند إضافة خطوة جديدة ببطاقات شبيهة: أعد استخدام `wizardPickGridShowcase` + `wizardPickCardGlass` + `pickWizardGlassTintClass(id)`.
- إذا تغيّر ترتيب ألوان اللُطَف، حدّث `WIZARD_GLASS_TINT_CLASSES` وعدد كلاسات CSS `wizardGlassTint*` معاً.
