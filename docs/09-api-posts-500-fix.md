# 09 — إصلاح خطأ `/api/posts` 500

## الأعراض

في الواجهة:

```
error-boundary-callbacks.js:83 Uncaught Error:
Failed to fetch posts: 500 Internal Server Error
  at fetchPosts (posts.ts:338)
  at async Feeds (Feeds.tsx:602)
```

في `storage/logs/laravel.log`:

```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'post_type' in 'where clause'
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'publish_date'
```

## السبب

في `anaanasBackend/app/Http/Controllers/Api/v1/SectionController.php`:

```php
$postsQuery = Post::query()
    ->with([...])
    ->where(function ($q) {
        $q->whereNull('post_type')->orWhere('post_type', 'listing');
    });
...
$newestOrderExpr = "COALESCE(publish_date, created_at)";
```

كانت تُطبّق دائمًا، رغم أن جدول `posts` في بعض البيئات لا يحتوي
الأعمدة `post_type` و / أو `publish_date` (الترحيلات لم تُنفّذ بعد).

## الإصلاح

```php
$postsQuery = Post::query()->with([
    "user", "category", "section", "city", "postImages",
]);

if (Schema::hasColumn('posts', 'post_type')) {
    $postsQuery->where(function ($q) {
        $q->whereNull('post_type')->orWhere('post_type', 'listing');
    });
}

$newestOrderExpr = Schema::hasColumn('posts', 'publish_date')
    ? 'COALESCE(publish_date, created_at)'
    : 'created_at';
```

> الكنترولر يستخدم بالفعل `Schema::hasColumn` لأعمدة اختيارية أخرى
> (`country_id`, `city_id`, `price`, …) — هذا الإصلاح يوحّد الأسلوب.

## خطوة موصى بها على قاعدة البيانات

لتشغيل ميزات المزادات وترتيب الإعادة بالنشر:

```bash
cd anaanasBackend
php artisan migrate
```

الترحيلات الموجودة:

- `2026_04_01_100000_add_post_type_to_posts_table.php`
- `2026_04_26_010000_add_publish_date_to_posts_table.php`

## ملاحظة جانبية: MongoDB

في نفس السجل ظهرت رسائل:

```
laravel.ERROR: No suitable servers found ... 127.0.0.1:27017
```

أي أن MongoDB غير متاح محليًا. هذا يؤثر فقط على ميزات تعتمد على
`PostReaction` (تجمعات MongoDB). الكنترولر يلتقط الاستثناء كـ
`fail-safe` ويعيد قائمة فارغة من الـ matched IDs، لذا الصفحة لا تتعطل
كليًا — لكن يُفضّل تشغيل خدمة Mongo أو تعطيل الفلاتر المعتمدة عليها.

## التحقق

1. شغّل `php artisan serve`.
2. افتح `/ar` على الواجهة.
3. أعد تحميل الصفحة — يجب أن تختفي رسالة 500 ويظهر الـ Feed.
4. راقب `storage/logs/laravel.log`: لا يجب أن يظهر خطأ
   `Unknown column 'post_type'` أو `'publish_date'`.
