<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * حذف منشور
     * 
     * @param int|string $id
     * @return JsonResponse
     */
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
}

