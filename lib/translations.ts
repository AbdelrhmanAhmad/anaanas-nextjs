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
  | 'post.statistics'
  | 'stats.title'
  | 'stats.subtitle'
  | 'stats.backToPost'
  | 'stats.from'
  | 'stats.to'
  | 'stats.apply'
  | 'stats.loading'
  | 'stats.preset.7d'
  | 'stats.preset.30d'
  | 'stats.preset.90d'
  | 'stats.kpi.impressions'
  | 'stats.kpi.uniqueImpressions'
  | 'stats.kpi.views'
  | 'stats.kpi.interactions'
  | 'stats.kpi.calls'
  | 'stats.kpi.shares'
  | 'stats.kpi.chats'
  | 'stats.tabs.overview'
  | 'stats.tabs.interactions'
  | 'stats.tabs.audience'
  | 'stats.charts.viewsVsUnique'
  | 'stats.charts.breakdown'
  | 'stats.charts.interactionsOverTime'
  | 'stats.hint.uniqueDefinition'
  | 'stats.top.userAgents'
  | 'stats.ua'
  | 'stats.count'
  | 'stats.noData'
  | 'stats.event.impressions'
  | 'stats.event.views'
  | 'stats.event.calls'
  | 'stats.event.shares'
  | 'stats.event.chats'
  | 'stats.event.likes'
  | 'stats.event.unlikes'
  | 'stats.event.comments'
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
  | 'auction.searchPlaceholder'
  | 'auction.postAd'
  | 'auction.boost'
  | 'auction.chip.updates'
  | 'auction.chip.lives'
  | 'auction.chip.hotDeals'
  | 'auction.chip.auctions'
  | 'auction.tab.realEstate'
  | 'auction.tab.furniture'
  | 'auction.tab.electronics'
  | 'auction.tab.auctions'
  | 'auction.trending.title'
  | 'auction.trending.hint'
  | 'auction.trending.cars'
  | 'auction.trending.villa'
  | 'auction.trending.brand'
  | 'auction.trending.boost'
  | 'auction.trending.metaNew'
  | 'auction.trending.metaHot'
  | 'auction.trending.metaNow'
  | 'auction.trending.metaPromo'
  | 'auction.live.title'
  | 'auction.live.hint'
  | 'auction.live.endsIn'
  | 'auction.live.bids'
  | 'auction.live.currentPrice'
  | 'auction.live.secure'
  | 'auction.live.bidNow'
  | 'auction.live.showcase'
  | 'auction.live.tires'
  | 'auction.live.shoes'
  | 'auction.live.tools'
  | 'auction.panel.title'
  | 'auction.panel.hint'
  | 'auction.panel.chooseCategory'
  | 'auction.panel.typeCategory'
  | 'auction.panel.go'
  | 'auction.panel.uploadMedia'
  | 'auction.panel.dragDrop'
  | 'auction.panel.upload'
  | 'auction.step.start'
  | 'auction.step.next'
  | 'auction.step.done'
  | 'auction.step1.title'
  | 'auction.step1.desc'
  | 'auction.step2.title'
  | 'auction.step2.desc'
  | 'auction.step3.title'
  | 'auction.step3.desc'
  | 'auction.step4.title'
  | 'auction.step4.desc'
  | 'auction.publish'
  | 'auctionPosts.brandGuide'
  | 'auctionPosts.heroTitle'
  | 'auctionPosts.heroSubtitle'
  | 'auctionPosts.trendingTitle'
  | 'auctionPosts.livePackageTitle'
  | 'auctionPosts.postAdTitle'
  | 'auctionPosts.postAdDesc'
  | 'auctionPosts.tag.popular'
  | 'auctionPosts.tag.live'
  | 'auctionPosts.tag.brand'
  | 'auctionPosts.cta.bid'
  | 'auctionPosts.cta.boostAd'
  | 'auctionPosts.live.card1.title'
  | 'auctionPosts.live.card2.title'
  | 'auctionPosts.live.card1.topTitle'
  | 'auctionPosts.live.card1.topSub'
  | 'auctionPosts.live.card1.desc'
  | 'auctionPosts.live.card2.topTitle'
  | 'auctionPosts.live.card2.topSub'
  | 'auctionPosts.live.card2.desc'
  | 'auctionPosts.live.card3.title'
  | 'auctionPosts.live.card3.desc'
  | 'auctionPosts.small.new'
  | 'auctionPosts.small.likes'
  | 'auctionPosts.small.boost'
  | 'auctionPosts.small.view'
  | 'auctionPosts.small.recommended'
  | 'auctionPosts.small.sponsored'
  | 'auctionPosts.small.live'
  | 'auctionPosts.small.captions'
  | 'auctionPosts.trending.pill'
  | 'auctionPosts.trending.badgeAd'
  | 'auctionPosts.trending.like'
  | 'auctionPosts.trending.live'
  | 'auctionPosts.trending.card2.line1'
  | 'auctionPosts.trending.card2.line2'
  | 'auctionPosts.trending.card3.line1'
  | 'auctionPosts.trending.card3.line2'
  | 'auctionPosts.live.pill.community'
  | 'auctionPosts.live.priceNote.bid'
  | 'auctionPosts.live.priceNote.shares'
  | 'auctionPosts.live.unit.rma'
  | 'auctionPosts.live.footerNote.a'
  | 'auctionPosts.live.footerNote.b'
  | 'auctionPosts.live.footerNote.c'
  | 'auctionPosts.live.bio'
  | 'auctionPosts.live.col1.k'
  | 'auctionPosts.live.col1.v'
  | 'auctionPosts.live.col2.k'
  | 'auctionPosts.live.col2.v'

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
    'post.statistics': 'إحصائيات الإعلان',
    'stats.title': 'إحصائيات الإعلان',
    'stats.subtitle': 'تحليل أداء الإعلان',
    'stats.backToPost': 'العودة للإعلان',
    'stats.from': 'من',
    'stats.to': 'إلى',
    'stats.apply': 'تطبيق',
    'stats.loading': 'جاري التحميل...',
    'stats.preset.7d': 'آخر 7 أيام',
    'stats.preset.30d': 'آخر 30 يوم',
    'stats.preset.90d': 'آخر 90 يوم',
    'stats.kpi.impressions': 'الظهور',
    'stats.kpi.uniqueImpressions': 'الظهور الفريد',
    'stats.kpi.views': 'مشاهدات التفاصيل',
    'stats.kpi.interactions': 'التفاعلات',
    'stats.kpi.calls': 'اتصالات',
    'stats.kpi.shares': 'مشاركات',
    'stats.kpi.chats': 'دردشات',
    'stats.tabs.overview': 'نظرة عامة',
    'stats.tabs.interactions': 'التفاعلات',
    'stats.tabs.audience': 'الجمهور',
    'stats.charts.viewsVsUnique': 'الظهور مقابل الظهور الفريد',
    'stats.charts.breakdown': 'توزيع الأحداث',
    'stats.charts.interactionsOverTime': 'التفاعلات عبر الزمن',
    'stats.hint.uniqueDefinition': 'الفريد = مستخدم/‏IP مختلف',
    'stats.top.userAgents': 'أكثر الأجهزة/المتصفحات',
    'stats.ua': 'User-Agent',
    'stats.count': 'العدد',
    'stats.noData': 'لا توجد بيانات',
    'stats.event.impressions': 'الظهور',
    'stats.event.views': 'مشاهدات التفاصيل',
    'stats.event.calls': 'اتصالات',
    'stats.event.shares': 'مشاركات',
    'stats.event.chats': 'دردشات',
    'stats.event.likes': 'إعجابات',
    'stats.event.unlikes': 'إلغاء إعجاب',
    'stats.event.comments': 'تعليقات',
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
    'auction.searchPlaceholder': 'ابحث عن أي شيء...',
    'auction.postAd': 'أضف إعلان',
    'auction.boost': 'تعزيز',
    'auction.chip.updates': 'تحديثات',
    'auction.chip.lives': 'مباشر',
    'auction.chip.hotDeals': 'عروض ساخنة',
    'auction.chip.auctions': 'مزادات',
    'auction.tab.realEstate': 'عقارات',
    'auction.tab.furniture': 'أثاث',
    'auction.tab.electronics': 'إلكترونيات',
    'auction.tab.auctions': 'مزادات',
    'auction.trending.title': 'إعلانات رائجة',
    'auction.trending.hint': 'الأكثر مشاهدة اليوم',
    'auction.trending.cars': 'سيارات',
    'auction.trending.villa': 'فيلا مفروشة',
    'auction.trending.brand': 'ماركات',
    'auction.trending.boost': 'إعلان مميز',
    'auction.trending.metaNew': 'جديد • 03',
    'auction.trending.metaHot': 'ساخن • 00',
    'auction.trending.metaNow': 'الآن • 18',
    'auction.trending.metaPromo': 'ترويج',
    'auction.live.title': 'مزادات مباشرة',
    'auction.live.hint': 'زايد الآن ونافس الآخرين',
    'auction.live.endsIn': 'ينتهي خلال',
    'auction.live.bids': 'مزايدات',
    'auction.live.currentPrice': 'السعر الحالي',
    'auction.live.secure': 'دفع آمن',
    'auction.live.bidNow': 'زايد الآن',
    'auction.live.showcase': 'عرض شامل',
    'auction.live.tires': 'إطارات',
    'auction.live.shoes': 'أحذية',
    'auction.live.tools': 'أدوات',
    'auction.panel.title': 'لوحة سريعة',
    'auction.panel.hint': 'أنشئ إعلانك في خطوات بسيطة',
    'auction.panel.chooseCategory': 'اختر القسم',
    'auction.panel.typeCategory': 'اكتب اسم القسم...',
    'auction.panel.go': 'ابدأ',
    'auction.panel.uploadMedia': 'رفع الصور',
    'auction.panel.dragDrop': 'اسحب وأفلت أو اضغط للرفع',
    'auction.panel.upload': 'رفع',
    'auction.step.start': 'ابدأ',
    'auction.step.next': 'التالي',
    'auction.step.done': 'تم',
    'auction.step1.title': 'اختيار القسم',
    'auction.step1.desc': 'اختر القسم المناسب لظهور أفضل',
    'auction.step2.title': 'السعر والموقع',
    'auction.step2.desc': 'حدد السعر والمدينة بسهولة',
    'auction.step3.title': 'باقة مميزة',
    'auction.step3.desc': 'تعزيز الظهور وزيادة التفاعل',
    'auction.step4.title': 'نشر الإعلان',
    'auction.step4.desc': 'راجع التفاصيل وانشر خلال ثوانٍ',
    'auction.publish': 'نشر الإعلان',
    'auctionPosts.brandGuide': 'دليل هوية العلامة',
    'auctionPosts.heroTitle': 'ANANAS',
    'auctionPosts.heroSubtitle': 'Brand Style Guide',
    'auctionPosts.trendingTitle': 'إعلانات رائجة',
    'auctionPosts.trending.pill': 'أناناس',
    'auctionPosts.trending.badgeAd': 'إعلان',
    'auctionPosts.trending.like': 'إعجاب',
    'auctionPosts.trending.live': 'مباشر',
    'auctionPosts.trending.card2.line1': 'Rirkuit',
    'auctionPosts.trending.card2.line2': 'DNQic9 9od',
    'auctionPosts.trending.card3.line1': 'Dw9aor',
    'auctionPosts.trending.card3.line2': 'DNQN09 9od',
    'auctionPosts.livePackageTitle': 'حزمة مزادات مباشرة',
    'auctionPosts.postAdTitle': 'أضف إعلان',
    'auctionPosts.postAdDesc': 'مرح لكن احترافي. شخصيات ودودة بطابع تقني عصري. مناسب للشرق الأوسط، جاهز للتميّز.',
    'auctionPosts.tag.popular': 'شائع',
    'auctionPosts.tag.live': 'مباشر',
    'auctionPosts.tag.brand': 'برانـد',
    'auctionPosts.cta.bid': 'زايد',
    'auctionPosts.cta.boostAd': 'تعزيز الإعلان',
    'auctionPosts.live.card1.title': 'Vies Title',
    'auctionPosts.live.card1.topTitle': 'Upload',
    'auctionPosts.live.card1.topSub': '5 rotate',
    'auctionPosts.live.card1.desc': 'محتوى مناسب للبداية',
    'auctionPosts.live.card2.title': 'Tiree Title',
    'auctionPosts.live.card2.topTitle': 'Boost Ad',
    'auctionPosts.live.card2.topSub': '33:00',
    'auctionPosts.live.card2.desc': 'محتوى متنوع وإعلان مميز',
    'auctionPosts.live.card3.title': 'Live a Title',
    'auctionPosts.live.card3.desc': 'محتوى مباشر لمزيد من التفاعل',
    'auctionPosts.small.new': 'جديد',
    'auctionPosts.small.likes': 'الإعجابات',
    'auctionPosts.small.boost': 'Boost Ad',
    'auctionPosts.small.view': 'عرض',
    'auctionPosts.small.recommended': 'موصى به',
    'auctionPosts.small.sponsored': 'ممول',
    'auctionPosts.small.live': 'مباشر',
    'auctionPosts.small.captions': 'عناوين',
    'auctionPosts.live.pill.community': 'مجتمع',
    'auctionPosts.live.priceNote.bid': 'مزايدة',
    'auctionPosts.live.priceNote.shares': 'مشاهدات / مشاركات',
    'auctionPosts.live.unit.rma': 'rma',
    'auctionPosts.live.footerNote.a': '$40  $40',
    'auctionPosts.live.footerNote.b': '$40  $40',
    'auctionPosts.live.footerNote.c': '$40  $40',
    'auctionPosts.live.bio': 'نبذة',
    'auctionPosts.live.col1.k': 'feictuh',
    'auctionPosts.live.col1.v': '$0.35',
    'auctionPosts.live.col2.k': 'rotordemse',
    'auctionPosts.live.col2.v': 'sflove',
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
    'post.statistics': 'Ad Statistics',
    'stats.title': 'Ad Statistics',
    'stats.subtitle': 'Analyze ad performance',
    'stats.backToPost': 'Back to ad',
    'stats.from': 'From',
    'stats.to': 'To',
    'stats.apply': 'Apply',
    'stats.loading': 'Loading...',
    'stats.preset.7d': 'Last 7 days',
    'stats.preset.30d': 'Last 30 days',
    'stats.preset.90d': 'Last 90 days',
    'stats.kpi.impressions': 'Impressions',
    'stats.kpi.uniqueImpressions': 'Unique impressions',
    'stats.kpi.views': 'Detail views',
    'stats.kpi.interactions': 'Interactions',
    'stats.kpi.calls': 'Calls',
    'stats.kpi.shares': 'Shares',
    'stats.kpi.chats': 'Chats',
    'stats.tabs.overview': 'Overview',
    'stats.tabs.interactions': 'Interactions',
    'stats.tabs.audience': 'Audience',
    'stats.charts.viewsVsUnique': 'Impressions vs Unique',
    'stats.charts.breakdown': 'Events breakdown',
    'stats.charts.interactionsOverTime': 'Interactions over time',
    'stats.hint.uniqueDefinition': 'Unique = distinct user / IP',
    'stats.top.userAgents': 'Top devices/browsers',
    'stats.ua': 'User-Agent',
    'stats.count': 'Count',
    'stats.noData': 'No data',
    'stats.event.impressions': 'Impressions',
    'stats.event.views': 'Detail views',
    'stats.event.calls': 'Calls',
    'stats.event.shares': 'Shares',
    'stats.event.chats': 'Chats',
    'stats.event.likes': 'Likes',
    'stats.event.unlikes': 'Unlikes',
    'stats.event.comments': 'Comments',
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
    'auction.searchPlaceholder': 'Search for anything...',
    'auction.postAd': 'Post Ad',
    'auction.boost': 'Boost',
    'auction.chip.updates': 'Updates',
    'auction.chip.lives': 'Lives',
    'auction.chip.hotDeals': 'Hot Deals',
    'auction.chip.auctions': 'Auctions',
    'auction.tab.realEstate': 'Real Estate',
    'auction.tab.furniture': 'Furniture',
    'auction.tab.electronics': 'Electronics',
    'auction.tab.auctions': 'Auctions',
    'auction.trending.title': 'Trending Ads',
    'auction.trending.hint': 'Top picks today',
    'auction.trending.cars': 'Cars',
    'auction.trending.villa': 'Fitted Villa',
    'auction.trending.brand': 'Brands',
    'auction.trending.boost': 'Boost Ad',
    'auction.trending.metaNew': 'New • 03',
    'auction.trending.metaHot': 'Hot • 00',
    'auction.trending.metaNow': 'Now • 18',
    'auction.trending.metaPromo': 'Promo',
    'auction.live.title': 'Live Auctions',
    'auction.live.hint': 'Bid in real time',
    'auction.live.endsIn': 'Ends in',
    'auction.live.bids': 'bids',
    'auction.live.currentPrice': 'Current price',
    'auction.live.secure': 'Secure payments',
    'auction.live.bidNow': 'Bid Now',
    'auction.live.showcase': 'All Showcase',
    'auction.live.tires': 'Tires',
    'auction.live.shoes': 'Shoes',
    'auction.live.tools': 'DIY Tools',
    'auction.panel.title': 'Quick Panel',
    'auction.panel.hint': 'Create your ad in a few steps',
    'auction.panel.chooseCategory': 'Choose Category',
    'auction.panel.typeCategory': 'Type a category...',
    'auction.panel.go': 'Go',
    'auction.panel.uploadMedia': 'Upload Media',
    'auction.panel.dragDrop': 'Drag & drop or click to upload',
    'auction.panel.upload': 'Upload',
    'auction.step.start': 'Start',
    'auction.step.next': 'Next',
    'auction.step.done': 'Done',
    'auction.step1.title': 'Choose Category',
    'auction.step1.desc': 'Pick the right category for better reach',
    'auction.step2.title': 'Set Price & Location',
    'auction.step2.desc': 'Price range & your city',
    'auction.step3.title': 'Premium Subscription',
    'auction.step3.desc': 'Boost visibility and get more bids',
    'auction.step4.title': 'Publish Ad',
    'auction.step4.desc': 'Review and publish in seconds',
    'auction.publish': 'Publish Ad',
    'auctionPosts.brandGuide': 'BRAND STYLE GUIDE',
    'auctionPosts.heroTitle': 'ANANAS',
    'auctionPosts.heroSubtitle': 'Brand Style Guide',
    'auctionPosts.trendingTitle': 'Trending Ads',
    'auctionPosts.trending.pill': 'ANANAS',
    'auctionPosts.trending.badgeAd': 'Ad',
    'auctionPosts.trending.like': 'LIKE',
    'auctionPosts.trending.live': 'LIVE',
    'auctionPosts.trending.card2.line1': 'Rirkuit',
    'auctionPosts.trending.card2.line2': 'DNQic9 9od',
    'auctionPosts.trending.card3.line1': 'Dw9aor',
    'auctionPosts.trending.card3.line2': 'DNQN09 9od',
    'auctionPosts.livePackageTitle': 'Live Package',
    'auctionPosts.postAdTitle': 'Post Ad',
    'auctionPosts.postAdDesc': 'Fun but professional. Friendly mascots with a startup-tech vibe. Middle East friendly, unique, unicorn-ready.',
    'auctionPosts.tag.popular': 'Popular',
    'auctionPosts.tag.live': 'Live',
    'auctionPosts.tag.brand': 'Brand',
    'auctionPosts.cta.bid': 'Bid',
    'auctionPosts.cta.boostAd': 'Boost Ad',
    'auctionPosts.live.card1.title': 'Vies Title',
    'auctionPosts.live.card1.topTitle': 'Upload',
    'auctionPosts.live.card1.topSub': '5 rotate',
    'auctionPosts.live.card1.desc': 'Fast starter content',
    'auctionPosts.live.card2.title': 'Tiree Title',
    'auctionPosts.live.card2.topTitle': 'Boost Ad',
    'auctionPosts.live.card2.topSub': '33:00',
    'auctionPosts.live.card2.desc': 'Premium placement boost',
    'auctionPosts.live.card3.title': 'Live a Title',
    'auctionPosts.live.card3.desc': 'Real-time bidding feed',
    'auctionPosts.small.new': 'New',
    'auctionPosts.small.likes': 'Likes',
    'auctionPosts.small.boost': 'Boost Ad',
    'auctionPosts.small.view': 'View',
    'auctionPosts.small.recommended': 'Recommended',
    'auctionPosts.small.sponsored': 'Sponsored',
    'auctionPosts.small.live': 'Live',
    'auctionPosts.small.captions': 'Captions',
    'auctionPosts.live.pill.community': 'COMMUNITY',
    'auctionPosts.live.priceNote.bid': 'Money Bid',
    'auctionPosts.live.priceNote.shares': 'Mnow / Shs',
    'auctionPosts.live.unit.rma': 'rma',
    'auctionPosts.live.footerNote.a': '$40  $40',
    'auctionPosts.live.footerNote.b': '$40  $40',
    'auctionPosts.live.footerNote.c': '$40  $40',
    'auctionPosts.live.bio': 'Bio',
    'auctionPosts.live.col1.k': 'feictuh',
    'auctionPosts.live.col1.v': '$0.35',
    'auctionPosts.live.col2.k': 'rotordemse',
    'auctionPosts.live.col2.v': 'sflove',
  },
}

export function t(key: TranslationKey, locale: SupportedLocale = 'ar'): string {
  return translations[locale]?.[key] ?? translations.ar[key] ?? key
}
