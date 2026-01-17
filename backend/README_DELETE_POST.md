# إضافة خاصية حذف المنشور في Laravel Backend

## الخطوات المطلوبة:

### 1. إضافة Method في PostController

أضف method `destroy` في `app/Http/Controllers/PostController.php`:

```php
public function destroy($id): JsonResponse
{
    try {
        $post = Post::findOrFail($id);
        
        // التحقق من أن المستخدم مسجل دخول
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        // التحقق من أن المستخدم هو صاحب المنشور
        if (Auth::id() != $post->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بحذف هذا المنشور'
            ], 403);
        }

        // حذف المنشور
        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المنشور بنجاح'
        ], 200);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'success' => false,
            'message' => 'المنشور غير موجود'
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء حذف المنشور: ' . $e->getMessage()
        ], 500);
    }
}
```

### 2. إضافة Route في routes/api.php

أضف route للحذف في `routes/api.php`:

```php
Route::middleware('auth:sanctum')->group(function () {
    // حذف منشور
    Route::delete('/posts/{id}', [PostController::class, 'destroy'])
        ->where('id', '[0-9]+')
        ->name('posts.destroy');
});
```

### 3. التأكد من الاستيرادات

تأكد من وجود الاستيرادات التالية في أعلى `PostController.php`:

```php
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
```

### 4. اختبار الـ Endpoint

يمكنك اختبار الـ endpoint باستخدام:

```bash
curl -X DELETE http://localhost:8000/api/posts/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

## ملاحظات:

1. **المصادقة**: الـ route محمي بـ `auth:sanctum` middleware
2. **الصلاحيات**: يتم التحقق من أن المستخدم هو صاحب المنشور
3. **Soft Delete**: إذا كنت تستخدم Soft Delete في Model، استخدم `$post->delete()` مباشرة
4. **Hard Delete**: إذا كنت تريد حذف نهائي، استخدم `$post->forceDelete()`

## إذا كنت تستخدم Soft Delete:

في `Post` Model، تأكد من وجود:

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
    
    protected $dates = ['deleted_at'];
}
```

