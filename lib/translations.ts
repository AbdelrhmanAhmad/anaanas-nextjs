export type SupportedLocale = 'ar' | 'en'

type TranslationKey =
  | 'home.noSections'
  | 'home.viewProfile'
  | 'home.aboutUs'
  | 'home.settings'
  | 'home.support'
  | 'home.feedback'
  | 'home.help'
  | 'home.privacyTerms'
  | 'home.todaysNews'
  | 'home.viewAllLatestNews'
  | 'sidebar.noSections'
  | 'sidebar.viewProfile'
  | 'sidebar.aboutUs'
  | 'sidebar.settings'
  | 'sidebar.support'
  | 'sidebar.feedback'
  | 'sidebar.help'
  | 'sidebar.privacyTerms'
  | 'auth.welcome'
  | 'auth.signIn'
  | 'auth.signUp'
  | 'auth.createAccount'
  | 'auth.noAccount'
  | 'auth.hasAccount'
  | 'auth.clickToSignUp'
  | 'auth.clickToSignIn'
  | 'auth.emailOrPhone'
  | 'auth.enterEmailOrPhone'
  | 'auth.password'
  | 'auth.enterPassword'
  | 'auth.confirmPassword'
  | 'auth.enterConfirmPassword'
  | 'auth.rememberMe'
  | 'auth.forgotPassword'
  | 'auth.submit'
  | 'auth.signingIn'
  | 'auth.creating'
  | 'auth.name'
  | 'auth.enterName'
  | 'auth.mobile'
  | 'auth.enterMobile'
  | 'auth.email'
  | 'auth.enterEmail'
  | 'auth.nameOptional'
  | 'auth.mobileOptional'
  | 'auth.emailOptional'
  | 'auth.allRightsReserved'
  | 'auth.terms'
  | 'auth.privacy'
  | 'auth.cookies'
  | 'auth.passwordMismatch'
  | 'auth.passwordRequired'
  | 'auth.confirmPasswordRequired'
  | 'auth.invalidEmail'
  | 'post.editPost'
  | 'post.deletePost'
  | 'post.confirmDelete'
  | 'post.user'
  | 'post.you'
  | 'post.readMore'
  | 'post.addComment'
  | 'post.loginToComment'
  | 'post.loginRequired'
  | 'post.cannotCommentWithoutLogin'
  | 'post.loadMoreComments'
  | 'post.viewMoreComments'
  | 'post.contact'
  | 'post.sendEmail'
  | 'post.noContactData'
  | 'post.watchOnAnanas'
  | 'post.failedToOpenChat'
  | 'post.pleaseTryAgain'
  | 'post.errorDeletingPost'
  | 'post.viewAll'
  | 'post.liked'
  | 'post.like'
  | 'post.comment'
  | 'post.share'
  | 'post.chat'
  | 'post.openChat'
  | 'post.loginToChat'
  | 'post.commentAction'
  | 'post.reply'
  | 'post.viewReplies'
  | 'post.writeReply'
  | 'post.send'
  | 'post.loadingReplies'
  | 'post.loadMoreReplies'
  | 'post.unlike'
  | 'post.likeComment'
  | 'dialog.loginRequired.title'
  | 'dialog.loginRequired.message'
  | 'dialog.loginRequired.loginButton'
  | 'dialog.loginRequired.cancelButton'
  | 'filter.filterResults'
  | 'filter.filterDescription'
  | 'filter.close'
  | 'filter.reset'
  | 'filter.city'
  | 'filter.allCities'
  | 'filter.priceRange'
  | 'filter.from'
  | 'filter.to'
  | 'filter.postAttributes'
  | 'filter.apply'
  | 'filter.noAttributesAvailable'
  | 'filter.selectField'

const translations: Record<SupportedLocale, Record<TranslationKey, string>> = {
  ar: {
    'home.noSections': 'لا توجد أقسام متاحة حاليًا',
    'home.viewProfile': 'عرض الملف الشخصي',
    'home.aboutUs': 'من نحن',
    'home.settings': 'الاعدادات',
    'home.support': 'الدعم الفني',
    'home.feedback': 'الملاحظات',
    'home.help': 'المساعدة',
    'home.privacyTerms': 'الخصوصية والشروط',
    'home.todaysNews': 'أخبار اليوم',
    'home.viewAllLatestNews': 'عرض جميع الأخبار',
    'sidebar.noSections': 'لا توجد أقسام متاحة حاليًا',
    'sidebar.viewProfile': 'عرض الملف الشخصي',
    'sidebar.aboutUs': 'من نحن',
    'sidebar.settings': 'الاعدادات',
    'sidebar.support': 'الدعم الفني',
    'sidebar.feedback': 'الملاحظات',
    'sidebar.help': 'المساعدة',
    'sidebar.privacyTerms': 'الخصوصية والشروط',
    'auth.welcome': 'اهلا بك في منصه اناناس الاعلانيه',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'انشئ حساب جديد الآن',
    'auth.createAccount': 'انشئ حساب جديد',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'هل تملك حساب بالفعل؟',
    'auth.clickToSignUp': 'انقر هنا للتسجيل',
    'auth.clickToSignIn': 'تسجيل الدخول هنا',
    'auth.emailOrPhone': 'البريد الإلكتروني (أو رقم الهاتف)',
    'auth.enterEmailOrPhone': 'أدخل البريد الإلكتروني (أو رقم الهاتف)',
    'auth.password': 'كلمة المرور',
    'auth.enterPassword': 'أدخل كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.enterConfirmPassword': 'أدخل تأكيد كلمة المرور',
    'auth.rememberMe': 'تذكرني؟',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.submit': 'تسجيل الدخول',
    'auth.signingIn': 'جاري تسجيل الدخول...',
    'auth.creating': 'جاري الإنشاء...',
    'auth.name': 'الاسم',
    'auth.enterName': 'ادخل اسمك',
    'auth.mobile': 'رقم الهاتف',
    'auth.enterMobile': 'ادخل رقم الهاتف',
    'auth.email': 'البريد الإلكتروني',
    'auth.enterEmail': 'ادخل بريدك الالكتروني',
    'auth.nameOptional': 'الاسم (اختياري)',
    'auth.mobileOptional': 'رقم الهاتف (اختياري)',
    'auth.emailOptional': 'بريدك الالكتروني (اختياري)',
    'auth.allRightsReserved': 'جميع الحقوق محفوظة',
    'auth.terms': 'الشروط',
    'auth.privacy': 'الخصوصية',
    'auth.cookies': 'ملفات تعريف الارتباط',
    'auth.passwordMismatch': 'كلمة المرور غير متطابقه',
    'auth.passwordRequired': 'ادخل كلمة المرور',
    'auth.confirmPasswordRequired': 'ادخل تأكيد كلمة المرور',
    'auth.invalidEmail': 'ادخل بريدك الالكتروني الصحيح',
    'post.editPost': 'تعديل المنشور',
    'post.deletePost': 'حذف المنشور',
    'post.confirmDelete': 'هل أنت متأكد من حذف هذا المنشور؟',
    'post.user': 'مستخدم',
    'post.you': 'أنت',
    'post.readMore': 'عرض المزيد',
    'post.addComment': 'أضف تعليق...',
    'post.loginToComment': 'سجّل الدخول لإضافة تعليق',
    'post.loginRequired': 'تسجيل الدخول مطلوب',
    'post.cannotCommentWithoutLogin': 'لا يمكنك التعليق إلا بعد تسجيل الدخول',
    'post.loadMoreComments': 'تحميل المزيد من التعليقات',
    'post.viewMoreComments': 'عرض المزيد من التعليقات',
    'post.contact': 'اتصال',
    'post.sendEmail': 'إرسال بريد',
    'post.noContactData': 'لا يوجد بيانات اتصال',
    'post.watchOnAnanas': 'شاهد على منصه اناناس',
    'post.failedToOpenChat': 'فشل في فتح الدردشة',
    'post.pleaseTryAgain': 'يرجى المحاولة مرة أخرى.',
    'post.errorDeletingPost': 'حدث خطأ أثناء حذف المنشور',
    'post.viewAll': 'عرض الكل',
    'post.liked': 'أعجبني',
    'post.like': 'إعجاب',
    'post.comment': 'تعليق',
    'post.share': 'مشاركة',
    'post.chat': 'دردشة',
    'post.openChat': 'فتح الدردشة',
    'post.loginToChat': 'سجّل الدخول للدردشة',
    'post.commentAction': 'تعليق',
    'post.reply': 'رد',
    'post.viewReplies': 'عرض الردود',
    'post.writeReply': 'اكتب رد...',
    'post.send': 'إرسال',
    'post.loadingReplies': 'جاري تحميل الردود...',
    'post.loadMoreReplies': 'تحميل المزيد من الردود',
    'post.unlike': 'إلغاء الإعجاب',
    'post.likeComment': 'إعجاب',
    'dialog.loginRequired.title': 'تسجيل الدخول مطلوب',
    'dialog.loginRequired.message': 'يجب عليك تسجيل الدخول أولاً للوصول إلى هذه الميزة',
    'dialog.loginRequired.loginButton': 'تسجيل الدخول',
    'dialog.loginRequired.cancelButton': 'إلغاء',
    'filter.filterResults': 'فلترة النتائج',
    'filter.filterDescription': 'المدينة، السعر، وخصائص الإعلان',
    'filter.close': 'إغلاق',
    'filter.reset': 'إعادة تعيين',
    'filter.city': 'المدينة',
    'filter.allCities': 'كل المدن',
    'filter.priceRange': 'نطاق السعر',
    'filter.from': 'من',
    'filter.to': 'إلى',
    'filter.postAttributes': 'خصائص الإعلان',
    'filter.apply': 'تطبيق',
    'filter.noAttributesAvailable': 'لا توجد خصائص متاحة لهذه الفئة.',
    'filter.selectField': 'اختر',
  },
  en: {
    'home.noSections': 'No sections available at the moment',
    'home.viewProfile': 'View Profile',
    'home.aboutUs': 'About Us',
    'home.settings': 'Settings',
    'home.support': 'Support',
    'home.feedback': 'Feedback',
    'home.help': 'Help',
    'home.privacyTerms': 'Privacy & Terms',
    'home.todaysNews': "Today's News",
    'home.viewAllLatestNews': 'View all latest news',
    'sidebar.noSections': 'No sections available at the moment',
    'sidebar.viewProfile': 'View Profile',
    'sidebar.aboutUs': 'About Us',
    'sidebar.settings': 'Settings',
    'sidebar.support': 'Support',
    'sidebar.feedback': 'Feedback',
    'sidebar.help': 'Help',
    'sidebar.privacyTerms': 'Privacy & Terms',
    'auth.welcome': 'Welcome to Ananas Advertising Platform',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Create a new account now',
    'auth.createAccount': 'Create Account',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.clickToSignUp': 'Click here to sign up',
    'auth.clickToSignIn': 'Sign in here',
    'auth.emailOrPhone': 'Email (or Phone Number)',
    'auth.enterEmailOrPhone': 'Enter your email (or phone number)',
    'auth.password': 'Password',
    'auth.enterPassword': 'Enter your password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.enterConfirmPassword': 'Enter password confirmation',
    'auth.rememberMe': 'Remember me?',
    'auth.forgotPassword': 'Forgot password?',
    'auth.submit': 'Sign In',
    'auth.signingIn': 'Signing in...',
    'auth.creating': 'Creating...',
    'auth.name': 'Name',
    'auth.enterName': 'Enter your name',
    'auth.mobile': 'Phone Number',
    'auth.enterMobile': 'Enter your phone number',
    'auth.email': 'Email',
    'auth.enterEmail': 'Enter your email',
    'auth.nameOptional': 'Name (Optional)',
    'auth.mobileOptional': 'Phone Number (Optional)',
    'auth.emailOptional': 'Email (Optional)',
    'auth.allRightsReserved': 'All rights reserved',
    'auth.terms': 'Terms',
    'auth.privacy': 'Privacy',
    'auth.cookies': 'Cookies',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.passwordRequired': 'Enter password',
    'auth.confirmPasswordRequired': 'Enter password confirmation',
    'auth.invalidEmail': 'Enter a valid email address',
    'post.editPost': 'Edit Post',
    'post.deletePost': 'Delete Post',
    'post.confirmDelete': 'Are you sure you want to delete this post?',
    'post.user': 'User',
    'post.you': 'You',
    'post.readMore': 'Read more',
    'post.addComment': 'Add a comment...',
    'post.loginToComment': 'Sign in to add a comment',
    'post.loginRequired': 'Login Required',
    'post.cannotCommentWithoutLogin': 'You cannot comment without signing in',
    'post.loadMoreComments': 'Load more comments',
    'post.viewMoreComments': 'View more comments',
    'post.contact': 'Contact',
    'post.sendEmail': 'Send Email',
    'post.noContactData': 'No contact data',
    'post.watchOnAnanas': 'Watch on Ananas Platform',
    'post.failedToOpenChat': 'Failed to open chat',
    'post.pleaseTryAgain': 'Please try again.',
    'post.errorDeletingPost': 'An error occurred while deleting the post',
    'post.viewAll': 'View all',
    'post.liked': 'Liked',
    'post.like': 'Like',
    'post.comment': 'Comment',
    'post.share': 'Share',
    'post.chat': 'Chat',
    'post.openChat': 'Open Chat',
    'post.loginToChat': 'Sign in to chat',
    'post.commentAction': 'Comment',
    'post.reply': 'Reply',
    'post.viewReplies': 'View replies',
    'post.writeReply': 'Write a reply...',
    'post.send': 'Send',
    'post.loadingReplies': 'Loading replies...',
    'post.loadMoreReplies': 'Load more replies',
    'post.unlike': 'Unlike',
    'post.likeComment': 'Like',
    'dialog.loginRequired.title': 'Login Required',
    'dialog.loginRequired.message': 'You must sign in first to access this feature',
    'dialog.loginRequired.loginButton': 'Sign In',
    'dialog.loginRequired.cancelButton': 'Cancel',
    'filter.filterResults': 'Filter Results',
    'filter.filterDescription': 'City, Price, and Post Attributes',
    'filter.close': 'Close',
    'filter.reset': 'Reset',
    'filter.city': 'City',
    'filter.allCities': 'All Cities',
    'filter.priceRange': 'Price Range',
    'filter.from': 'From',
    'filter.to': 'To',
    'filter.postAttributes': 'Post Attributes',
    'filter.apply': 'Apply',
    'filter.noAttributesAvailable': 'No attributes available for this category.',
    'filter.selectField': 'Select',
  },
}

export function t(key: TranslationKey, locale: SupportedLocale = 'ar'): string {
  return translations[locale]?.[key] ?? translations.ar[key] ?? key
}
