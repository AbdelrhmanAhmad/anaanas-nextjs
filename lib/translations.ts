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
  | 'home.marketPulse'
  | 'home.marketPulseEmpty'
  | 'home.marketPulseGrowth'
  | 'home.trendingEmpty'
  | 'home.trendingEngagementHint'
  | 'home.cars'
  | 'home.realEstate'
  | 'home.electronics'
  | 'home.jobs'
  | 'home.topPerformingAds'
  | 'home.ad.zamzam'
  | 'home.ad.movingHouse'
  | 'home.ad.othman'
  | 'home.ad.electronics'
  | 'home.ad.elite'
  | 'home.ad.tech'
  | 'home.smartOpportunity'
  | 'home.highRoi'
  | 'home.detectedInAmman'
  | 'home.activateOpportunity'
  | 'home.ananasVsOthers'
  | 'home.listings'
  | 'home.marketplace'
  | 'home.classifieds'
  | 'home.aiEngine'
  | 'home.futureRoadmap'
  | 'home.comingSoon'
  | 'home.roadmap.pro'
  | 'home.roadmap.gold'
  | 'home.roadmap.family'
  | 'home.aiInfra.title'
  | 'home.aiInfra.headerPill'
  | 'home.aiInfra.feature1.title'
  | 'home.aiInfra.feature1.desc'
  | 'home.aiInfra.feature2.title'
  | 'home.aiInfra.feature2.desc'
  | 'home.aiInfra.feature3.title'
  | 'home.aiInfra.feature3.desc'
  | 'home.aiInfra.feature4.title'
  | 'home.aiInfra.feature4.desc'
  | 'home.aiInfra.cars'
  | 'home.aiInfra.realEstate'
  | 'home.aiInfra.jobs'
  | 'home.aiInfra.electronics'
  | 'home.aiInfra.trending'
  | 'home.quickLinks'
  | 'home.quick.auction.title'
  | 'home.quick.auction.hint'
  | 'home.quick.auctionPosts.title'
  | 'home.quick.auctionPosts.hint'
  | 'home.elite.title'
  | 'home.elite.b1'
  | 'home.elite.b2'
  | 'home.elite.b3'
  | 'home.elite.cta'
  | 'home.elite.coming'
  | 'home.pro.title'
  | 'home.pro.b1'
  | 'home.pro.b2'
  | 'home.pro.b3'
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
  | 'auth.forgotPassTitle'
  | 'auth.forgotPassDesc'
  | 'auth.sendResetLink'
  | 'auth.sending'
  | 'auth.checkEmail'
  | 'auth.checkEmailDesc'
  | 'auth.backToSignIn'
  | 'auth.resetPassTitle'
  | 'auth.resetPassDesc'
  | 'auth.newPassword'
  | 'auth.enterNewPassword'
  | 'auth.resetPassword'
  | 'auth.resetting'
  | 'auth.resetSuccess'
  | 'auth.resetLinkExpired'
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
  | 'auth.passwordMinLength'
  | 'auth.confirmPasswordRequired'
  | 'auth.nameRequired'
  | 'auth.emailRequired'
  | 'auth.nameMaxLength'
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
  | 'post.detailsTitle'
  | 'post.similarTitle'
  | 'post.moreFromSection'
  | 'post.noSimilar'
  | 'post.noAttributes'
  | 'post.attribute'
  | 'post.value'
  | 'profile.user'
  | 'profile.editProfile'
  | 'profile.shareProfile'
  | 'profile.savePdf'
  | 'profile.lockProfile'
  | 'profile.settings'
  | 'profile.aboutTitle'
  | 'profile.aboutEmpty'
  | 'profile.about.born'
  | 'profile.about.email'
  | 'profile.about.mobile'
  | 'profile.about.username'
  | 'profile.about.joined'
  | 'profile.followsTitle'
  | 'profile.followsHint'
  | 'profile.tabs.feed'
  | 'profile.tabs.about'
  | 'profile.tabs.activity'
  | 'profile.tabs.statistics'
  | 'profile.noPosts'
  | 'profile.postsError'
  | 'profile.noImages'
  | 'profile.imagesError'
  | 'profile.photos'
  | 'profile.photosLoading'
  | 'profile.stats.title'
  | 'profile.stats.subtitle'
  | 'profile.stats.totalPosts'
  | 'profile.stats.activePosts'
  | 'profile.stats.deletedPosts'
  | 'profile.stats.comments'
  | 'profile.stats.interactions'
  | 'profile.stats.breakdownTitle'
  | 'profile.stats.emptyBreakdown'
  | 'profile.stats.dailyTitle'
  | 'profile.stats.metricTitle'
  | 'profile.stats.chartLine'
  | 'profile.stats.chartBar'
  | 'profile.stats.interactionsDaily'
  | 'profile.stats.loadError'
  | 'profile.stats.statusBreakdown'
  | 'profile.stats.statusUnknown'
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
  | 'filter.postImages'
  | 'filter.allPosts'
  | 'filter.withImages'
  | 'filter.withoutImages'
  | 'filter.sortBy'
  | 'filter.sortNewest'
  | 'filter.sortOldest'
  | 'filter.sortPriceLowToHigh'
  | 'filter.sortPriceHighToLow'
  | 'createPost.smartTitle'
  | 'createPost.launch'
  | 'createPost.placeholder'
  | 'createPost.chipDemand'
  | 'createPost.chipRoi'
  | 'createPost.chipTarget'
  | 'createPost.chipBudget'
  | 'createPost.wizard.step1'
  | 'createPost.wizard.step2'
  | 'createPost.wizard.step3'
  | 'createPost.wizard.step4'
  | 'createPost.wizard.step5'
  | 'createPost.wizard.step6'
  | 'createPost.wizard.dynamicFields'
  | 'createPost.wizard.lead'
  | 'createPost.wizard.navPrev'
  | 'createPost.wizard.navNext'
  | 'createPost.wizard.navSubmit'
  | 'createPost.wizard.navSubmitting'
  | 'createPost.photos.title'
  | 'createPost.photos.hint'
  | 'createPost.photos.savedTitle'
  | 'createPost.photos.savedHint'
  | 'createPost.photos.newTitle'
  | 'createPost.photos.badgeSuffix'
  | 'createPost.photos.dropHint'
  | 'createPost.photos.dropActive'
  | 'createPost.photos.addSlot'
  | 'createPost.photos.removeAria'
  | 'createPost.photos.deleteSaved'
  | 'createPost.photos.deleting'
  | 'createPost.photos.rules'
  | 'createPost.photos.confirmDelete'
  | 'createPost.photos.deleteFailed'
  | 'createPost.photos.errTooLarge'
  | 'createPost.photos.errBadType'
  | 'createPost.photos.errSlotsFull'
  | 'createPost.photos.errSomeSkipped'
  | 'createPost.success.celebrationTitle'
  | 'createPost.success.celebrationSubtitle'
  | 'createPost.success.viewPost'
  | 'createPost.success.viewFeed'
  | 'createPost.success.viewHomeFeed'
  | 'createPost.success.close'
  | 'createPost.success.updated'
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
    'home.marketPulse': 'نبض السوق',
    'home.marketPulseEmpty': 'لا توجد أقسام بزيادة واضحة (+1٪) خلال آخر 30 يوماً مقارنة بالـ 30 يوماً السابقة.',
    'home.marketPulseGrowth': 'نمو',
    'home.trendingEmpty': 'لا توجد إعلانات بارزة بالتفاعل حالياً في بلدك.',
    'home.trendingEngagementHint': 'تعليقات وتفاعلات',
    'home.cars': 'سيارات',
    'home.realEstate': 'عقارات',
    'home.electronics': 'إلكترونيات',
    'home.jobs': 'وظائف',
    'home.topPerformingAds': 'أفضل الإعلانات اليوم',
    'home.ad.zamzam': 'زمزم زمان',
    'home.ad.movingHouse': 'شركة نقل أثاث',
    'home.ad.othman': 'عثمان للعقارات',
    'home.ad.electronics': 'إيتنـزا للإلكترونيات',
    'home.ad.elite': 'إليت ريز إلكترونكس',
    'home.ad.tech': 'تقنيات ذكية',
    'home.smartOpportunity': 'تنبيهات فرص ذكية',
    'home.highRoi': '3 مجالات عالية العائد',
    'home.detectedInAmman': 'تم رصدها في عمّان',
    'home.activateOpportunity': 'فعّل الفرصة',
    'home.ananasVsOthers': 'أناناس مقابل الآخرين',
    'home.listings': 'قوائم',
    'home.marketplace': 'سوق',
    'home.classifieds': 'إعلانات مبوبة',
    'home.aiEngine': 'محرك إعلانات ذكي',
    'home.futureRoadmap': 'خارطة المستقبل',
    'home.comingSoon': 'قريباً',
    'home.roadmap.pro': 'Ananas Pro – أدوات ذكاء متقدمة',
    'home.roadmap.gold': 'Ananas Gold – ترويج VIP',
    'home.roadmap.family': 'Ananas Family – مزايا عائلية',
    'home.aiInfra.title': 'البنية التحتية للذكاء الاصطناعي',
    'home.aiInfra.headerPill': 'Tapiz: 2 gigs',
    'home.aiInfra.feature1.title': 'محرك التنبؤ',
    'home.aiInfra.feature1.desc': 'يتوقع طلب 7 أيام',
    'home.aiInfra.feature2.title': 'سمارت بوست 3.0',
    'home.aiInfra.feature2.desc': 'تعزيز الظهور تلقائياً',
    'home.aiInfra.feature3.title': 'محرك المزادات',
    'home.aiInfra.feature3.desc': 'مزايدة آنية',
    'home.aiInfra.feature4.title': 'DNA الجمهور',
    'home.aiInfra.feature4.desc': 'تجميع السلوك',
    'home.aiInfra.cars': 'سيارات',
    'home.aiInfra.realEstate': 'عقارات',
    'home.aiInfra.jobs': 'وظائف',
    'home.aiInfra.electronics': 'إلكترونيات',
    'home.aiInfra.trending': 'رائج',
    'home.quickLinks': 'روابط سريعة',
    'home.quick.auction.title': 'تجربة المزادات',
    'home.quick.auction.hint': 'واجهة تفاعلية بتصميم حديث',
    'home.quick.auctionPosts.title': 'تجربة إعلانات المزاد',
    'home.quick.auctionPosts.hint': 'عرض بطاقات وإضافات جميلة',
    'home.elite.title': 'Elite – وصول ذكي يتجاوز 1 مليون',
    'home.elite.b1': 'ترتيب محسّن بالذكاء',
    'home.elite.b2': 'أولوية للمزادات المبكرة',
    'home.elite.b3': 'حماية نزاهة المزاد',
    'home.elite.cta': 'الترقية إلى Elite',
    'home.elite.coming': 'قريباً',
    'home.pro.title': 'Ananas Pro',
    'home.pro.b1': 'أدوات ذكاء متقدمة',
    'home.pro.b2': 'تعزيز VIP للظهور',
    'home.pro.b3': 'إدارة حسابات متعددة',
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
    'auth.forgotPassTitle': 'استعادة كلمة المرور',
    'auth.forgotPassDesc': 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.',
    'auth.sendResetLink': 'إرسال رابط إعادة التعيين',
    'auth.sending': 'جاري الإرسال...',
    'auth.checkEmail': 'تحقق من بريدك الإلكتروني',
    'auth.checkEmailDesc': 'إذا كان هذا البريد مرتبطاً بحساب، فستتلقى رابط إعادة تعيين كلمة المرور.',
    'auth.backToSignIn': 'العودة لتسجيل الدخول',
    'auth.resetPassTitle': 'تعيين كلمة مرور جديدة',
    'auth.resetPassDesc': 'أدخل كلمة المرور الجديدة وتأكيدها.',
    'auth.newPassword': 'كلمة المرور الجديدة',
    'auth.enterNewPassword': 'أدخل كلمة المرور الجديدة',
    'auth.resetPassword': 'تعيين كلمة المرور',
    'auth.resetting': 'جاري التعيين...',
    'auth.resetSuccess': 'تم تعيين كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.',
    'auth.resetLinkExpired': 'انتهت صلاحية الرابط. يرجى طلب رابط جديد.',
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
    'auth.passwordMinLength': 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
    'auth.nameRequired': 'الاسم مطلوب',
    'auth.emailRequired': 'البريد الإلكتروني مطلوب',
    'auth.nameMaxLength': 'الاسم يجب ألا يتجاوز 255 حرفاً',
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
    'post.detailsTitle': 'تفاصيل الإعلان',
    'post.similarTitle': 'إعلانات مشابهة',
    'post.moreFromSection': 'المزيد من القسم',
    'post.noSimilar': 'لا توجد إعلانات مشابهة حالياً.',
    'post.noAttributes': 'لا توجد خصائص متاحة لهذا الإعلان.',
    'post.attribute': 'الخاصية',
    'post.value': 'القيمة',
    'profile.user': 'مستخدم',
    'profile.editProfile': 'تعديل الملف الشخصي',
    'profile.shareProfile': 'مشاركة الملف الشخصي في رسالة',
    'profile.savePdf': 'حفظ الملف الشخصي بصيغة PDF',
    'profile.lockProfile': 'قفل الملف الشخصي',
    'profile.settings': 'إعدادات الملف الشخصي',
    'profile.aboutTitle': 'نبذة',
    'profile.aboutEmpty': 'أضف نبذة عنك ليراه الآخرون.',
    'profile.about.born': 'تاريخ الميلاد',
    'profile.about.email': 'البريد الإلكتروني',
    'profile.about.mobile': 'رقم الهاتف',
    'profile.about.username': 'اسم المستخدم',
    'profile.about.joined': 'تاريخ الانضمام',
    'profile.followsTitle': 'متابعاتك',
    'profile.followsHint': 'الأقسام والفئات والأشخاص الذين تتابعهم سيظهرون هنا قريباً.',
    'profile.tabs.feed': 'المنشورات',
    'profile.tabs.about': 'نبذة',
    'profile.tabs.activity': 'النشاط',
    'profile.tabs.statistics': 'الإحصائيات',
    'profile.noPosts': 'لا توجد منشورات بعد',
    'profile.postsError': 'فشل في تحميل منشوراتك',
    'profile.noImages': 'لا توجد صور بعد',
    'profile.imagesError': 'فشل في تحميل الصور',
    'profile.photos': 'الصور',
    'profile.photosLoading': 'جاري تحميل الصور...',
    'profile.stats.title': 'إحصائيات الملف الشخصي',
    'profile.stats.subtitle': 'ملخص شامل لأداء منشوراتك وتفاعلاتك',
    'profile.stats.totalPosts': 'إجمالي المنشورات',
    'profile.stats.activePosts': 'المنشورات النشطة',
    'profile.stats.deletedPosts': 'المنشورات المحذوفة',
    'profile.stats.comments': 'تعليقات على منشوراتي',
    'profile.stats.interactions': 'إجمالي التفاعلات',
    'profile.stats.breakdownTitle': 'تصنيف التفاعلات',
    'profile.stats.emptyBreakdown': 'لا توجد تفاعلات في هذه الفترة.',
    'profile.stats.dailyTitle': 'الأداء اليومي',
    'profile.stats.metricTitle': 'المؤشر',
    'profile.stats.chartLine': 'خطّي',
    'profile.stats.chartBar': 'أعمدة',
    'profile.stats.interactionsDaily': 'التفاعلات اليومية',
    'profile.stats.loadError': 'فشل في تحميل الإحصائيات',
    'profile.stats.statusBreakdown': 'تصنيف الحالات',
    'profile.stats.statusUnknown': 'غير محدد',
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
    'filter.postImages': 'صور المنشور',
    'filter.allPosts': 'كل المنشورات',
    'filter.withImages': 'منشورات بصور',
    'filter.withoutImages': 'منشورات بدون صور',
    'filter.sortBy': 'ترتيب النتائج',
    'filter.sortNewest': 'الأحدث',
    'filter.sortOldest': 'الأقدم',
    'filter.sortPriceLowToHigh': 'السعر من الأقل إلى الأعلى',
    'filter.sortPriceHighToLow': 'السعر من الأعلى إلى الأقل',
    'createPost.smartTitle': 'أنشئ إعلانك الذكي',
    'createPost.launch': 'انطلق بإعلانك الذكي',
    'createPost.placeholder': 'ماذا تريد أن تبيع اليوم؟',
    'createPost.chipDemand': '🔥 طلب مرتفع في عمّان',
    'createPost.chipRoi': '📊 توقع عائد 82%',
    'createPost.chipTarget': '🎯 الفئة العمرية 25–34',
    'createPost.chipBudget': '💰 الميزانية المقترحة: $45',
    'createPost.wizard.step1': 'النص',
    'createPost.wizard.step2': 'الصور',
    'createPost.wizard.step3': 'القسم',
    'createPost.wizard.step4': 'الفئة',
    'createPost.wizard.step5': 'التفاصيل',
    'createPost.wizard.step6': 'النشر',
    'createPost.wizard.dynamicFields': 'حقول الإعلان',
    'createPost.wizard.lead':
      'ابدأ بعنوان واضح يصف ما تبيعه، ثم أضِف وصفاً يجيب عن الأسئلة الشائعة للمشترين.',
    'createPost.wizard.navPrev': 'رجوع',
    'createPost.wizard.navNext': 'متابعة',
    'createPost.wizard.navSubmit': 'نشر الإعلان',
    'createPost.wizard.navSubmitting': 'جاري النشر…',
    'createPost.photos.title': 'صور الإعلان',
    'createPost.photos.hint':
      'أضف حتى 5 صور واضحة (JPG أو PNG أو WebP). الحد الأقصى 5 ميجابايت لكل صورة. الصور تُرفق عند نشر أو تحديث الإعلان.',
    'createPost.photos.savedTitle': 'صور محفوظة على السيرفر',
    'createPost.photos.savedHint': 'تظهر في إعلانك الحالي. يمكنك حذف أي منها قبل الحفظ.',
    'createPost.photos.newTitle': 'صور جديدة للإرسال',
    'createPost.photos.badgeSuffix': 'صورة للإرسال',
    'createPost.photos.dropHint': 'اسحب الصور هنا أو استخدم «إضافة صور».',
    'createPost.photos.dropActive': 'أفلت لإضافة الصور…',
    'createPost.photos.addSlot': 'إضافة صور',
    'createPost.photos.removeAria': 'إزالة من القائمة',
    'createPost.photos.deleteSaved': 'حذف من الإعلان',
    'createPost.photos.deleting': 'جارٍ الحذف…',
    'createPost.photos.rules': 'JPG · PNG · WebP — حتى 5 ميجابايت لكل ملف — 5 صور كحد أقصى.',
    'createPost.photos.confirmDelete': 'هل تريد حذف هذه الصورة من الإعلان؟',
    'createPost.photos.deleteFailed': 'تعذّر حذف الصورة',
    'createPost.photos.errTooLarge': 'ملف أكبر من 5 ميجابايت تم تجاهله.',
    'createPost.photos.errBadType': 'يُقبل فقط JPG أو PNG أو WebP.',
    'createPost.photos.errSlotsFull': 'وصلتَ إلى الحد الأقصى (5 صور). احذف صورة لإضافة أخرى.',
    'createPost.photos.errSomeSkipped': 'بعض الملفات لم تُضف لأن العدد بلغ الحد الأقصى.',
    'createPost.success.celebrationTitle': '🎉 نشر ناجح!',
    'createPost.success.celebrationSubtitle': 'أصبح إعلانك متاحاً. يمكنك مشاهدته أو العثور عليه في قائمة إعلاناتك.',
    'createPost.success.viewPost': 'مشاهدة الإعلان',
    'createPost.success.viewFeed': 'الانتقال لقائمة إعلاناتي',
    'createPost.success.viewHomeFeed': 'الانتقال لتغذية الرئيسية',
    'createPost.success.close': 'متابعة التصفح',
    'createPost.success.updated': 'تم تحديث الإعلان بنجاح',
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
    'home.marketPulse': 'Market Pulse',
    'home.marketPulseEmpty': 'No sections with at least +1% growth in the last 30 days vs the previous 30 days.',
    'home.marketPulseGrowth': 'Growth',
    'home.trendingEmpty': 'No standout posts by engagement in your country right now.',
    'home.trendingEngagementHint': 'Comments & reactions',
    'home.cars': 'Cars',
    'home.realEstate': 'Real Estate',
    'home.electronics': 'Electronics',
    'home.jobs': 'Jobs',
    'home.topPerformingAds': 'Top Performing Ads Today',
    'home.ad.zamzam': 'Zamzam Zaman',
    'home.ad.movingHouse': 'Moving House Company',
    'home.ad.othman': 'Othman Real Estate',
    'home.ad.electronics': 'Eitenzaz Electronics',
    'home.ad.elite': 'EliteRez Electronics',
    'home.ad.tech': 'Tech Vibes',
    'home.smartOpportunity': 'Smart Opportunity Alerts',
    'home.highRoi': '3 High ROI Niches',
    'home.detectedInAmman': 'Detected in Amman',
    'home.activateOpportunity': 'Activate Opportunity',
    'home.ananasVsOthers': 'ANANAS vs. Others',
    'home.listings': 'Listings',
    'home.marketplace': 'Marketplace',
    'home.classifieds': 'Classifieds',
    'home.aiEngine': 'AI Advertising Engine',
    'home.futureRoadmap': 'Future Roadmap',
    'home.comingSoon': 'Coming soon',
    'home.roadmap.pro': 'Ananas Pro – Advanced AI Tools',
    'home.roadmap.gold': 'Ananas Gold – VIP Exposure Engine',
    'home.roadmap.family': 'Ananas Family – Family Rewards',
    'home.aiInfra.title': 'AI Infrastructure',
    'home.aiInfra.headerPill': 'Tapiz: 2 gigs',
    'home.aiInfra.feature1.title': 'AI Forecast Engine',
    'home.aiInfra.feature1.desc': 'Predicts 7-day demand',
    'home.aiInfra.feature2.title': 'Smart Boost 3.0',
    'home.aiInfra.feature2.desc': 'Auto visibility scaling',
    'home.aiInfra.feature3.title': 'Live Auction Engine',
    'home.aiInfra.feature3.desc': 'Real-time bid placement',
    'home.aiInfra.feature4.title': 'Audience DNA',
    'home.aiInfra.feature4.desc': 'Behavior clustering',
    'home.aiInfra.cars': 'Cars',
    'home.aiInfra.realEstate': 'Real Estate',
    'home.aiInfra.jobs': 'Jobs',
    'home.aiInfra.electronics': 'Electronics',
    'home.aiInfra.trending': 'Trending',
    'home.quickLinks': 'Quick links',
    'home.quick.auction.title': 'Auction experience',
    'home.quick.auction.hint': 'Interactive, modern UI',
    'home.quick.auctionPosts.title': 'Auction posts experience',
    'home.quick.auctionPosts.hint': 'Cards, badges & highlights',
    'home.elite.title': 'Elite – Reach 1M+ Smart',
    'home.elite.b1': 'Enhanced ranking',
    'home.elite.b2': 'Early auction access',
    'home.elite.b3': 'Auction integrity',
    'home.elite.cta': 'Upgrade to Elite',
    'home.elite.coming': 'COMING SOON',
    'home.pro.title': 'Ananas Pro',
    'home.pro.b1': 'Advanced AI Tools',
    'home.pro.b2': 'VIP Exposure Engine',
    'home.pro.b3': 'Multi Account Business',
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
    'auth.forgotPassTitle': 'Reset Password',
    'auth.forgotPassDesc': 'Enter your email and we\'ll send you a reset link.',
    'auth.sendResetLink': 'Send reset link',
    'auth.sending': 'Sending...',
    'auth.checkEmail': 'Check your email',
    'auth.checkEmailDesc': 'If an account exists for this email, you will receive a password reset link.',
    'auth.backToSignIn': 'Back to sign in',
    'auth.resetPassTitle': 'Set new password',
    'auth.resetPassDesc': 'Enter your new password and confirmation.',
    'auth.newPassword': 'New password',
    'auth.enterNewPassword': 'Enter new password',
    'auth.resetPassword': 'Reset password',
    'auth.resetting': 'Resetting...',
    'auth.resetSuccess': 'Password has been reset. You can sign in now.',
    'auth.resetLinkExpired': 'Reset link has expired. Please request a new one.',
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
    'auth.passwordMinLength': 'Password must be at least 8 characters',
    'auth.nameRequired': 'Name is required',
    'auth.emailRequired': 'Email is required',
    'auth.nameMaxLength': 'Name must not exceed 255 characters',
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
    'post.detailsTitle': 'Ad Details',
    'post.similarTitle': 'Similar listings',
    'post.moreFromSection': 'More from this section',
    'post.noSimilar': 'No similar listings right now.',
    'post.noAttributes': 'No attributes are available for this ad.',
    'post.attribute': 'Attribute',
    'post.value': 'Value',
    'profile.user': 'User',
    'profile.editProfile': 'Edit profile',
    'profile.shareProfile': 'Share profile in a message',
    'profile.savePdf': 'Save your profile to PDF',
    'profile.lockProfile': 'Lock profile',
    'profile.settings': 'Profile settings',
    'profile.aboutTitle': 'About',
    'profile.aboutEmpty': 'Add a short bio so others can learn about you.',
    'profile.about.born': 'Date of birth',
    'profile.about.email': 'Email',
    'profile.about.mobile': 'Phone number',
    'profile.about.username': 'Username',
    'profile.about.joined': 'Joined on',
    'profile.followsTitle': 'Your follows',
    'profile.followsHint': 'Sections, categories, and people you follow will appear here soon.',
    'profile.tabs.feed': 'Feed',
    'profile.tabs.about': 'About',
    'profile.tabs.activity': 'Activity',
    'profile.tabs.statistics': 'Statistics',
    'profile.noPosts': 'No posts yet',
    'profile.postsError': 'Failed to load your posts',
    'profile.noImages': 'No images yet',
    'profile.imagesError': 'Failed to load images',
    'profile.photos': 'Photos',
    'profile.photosLoading': 'Loading photos...',
    'profile.stats.title': 'Profile Statistics',
    'profile.stats.subtitle': 'A complete overview of your posts and interactions',
    'profile.stats.totalPosts': 'Total posts',
    'profile.stats.activePosts': 'Active posts',
    'profile.stats.deletedPosts': 'Deleted posts',
    'profile.stats.comments': 'Comments on my posts',
    'profile.stats.interactions': 'Total interactions',
    'profile.stats.breakdownTitle': 'Interactions breakdown',
    'profile.stats.emptyBreakdown': 'No interactions in this period.',
    'profile.stats.dailyTitle': 'Daily performance',
    'profile.stats.metricTitle': 'Metric',
    'profile.stats.chartLine': 'Line',
    'profile.stats.chartBar': 'Bar',
    'profile.stats.interactionsDaily': 'Daily interactions',
    'profile.stats.loadError': 'Failed to load statistics',
    'profile.stats.statusBreakdown': 'Status breakdown',
    'profile.stats.statusUnknown': 'Unknown',
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
    'filter.postImages': 'Post Images',
    'filter.allPosts': 'All Posts',
    'filter.withImages': 'Posts with images',
    'filter.withoutImages': 'Posts without images',
    'filter.sortBy': 'Sort by',
    'filter.sortNewest': 'Newest first',
    'filter.sortOldest': 'Oldest first',
    'filter.sortPriceLowToHigh': 'Price: low to high',
    'filter.sortPriceHighToLow': 'Price: high to low',
    'createPost.smartTitle': 'Create Your Smart Ad',
    'createPost.launch': 'Launch Smart Ad',
    'createPost.placeholder': 'What are you selling today?',
    'createPost.chipDemand': '🔥 High Demand in Amman',
    'createPost.chipRoi': '📊 82% ROI Forecast',
    'createPost.chipTarget': '🎯 Target Age 25–34',
    'createPost.chipBudget': '💰 Suggested Budget: $45',
    'createPost.wizard.step1': 'Text',
    'createPost.wizard.step2': 'Photos',
    'createPost.wizard.step3': 'Section',
    'createPost.wizard.step4': 'Category',
    'createPost.wizard.step5': 'Details',
    'createPost.wizard.step6': 'Publish',
    'createPost.wizard.dynamicFields': 'Ad fields',
    'createPost.wizard.lead':
      'Start with a clear title, then add a short description buyers will understand at a glance.',
    'createPost.wizard.navPrev': 'Back',
    'createPost.wizard.navNext': 'Continue',
    'createPost.wizard.navSubmit': 'Publish ad',
    'createPost.wizard.navSubmitting': 'Publishing…',
    'createPost.photos.title': 'Ad photos',
    'createPost.photos.hint':
      'Add up to 5 clear photos (JPG, PNG, or WebP). Max 5 MB per file. Photos are sent when you publish or update the ad.',
    'createPost.photos.savedTitle': 'Saved on the server',
    'createPost.photos.savedHint': 'These are on your current ad. You can remove any before saving.',
    'createPost.photos.newTitle': 'New photos to upload',
    'createPost.photos.badgeSuffix': 'to upload',
    'createPost.photos.dropHint': 'Drop images here or use “Add photos”.',
    'createPost.photos.dropActive': 'Drop to add photos…',
    'createPost.photos.addSlot': 'Add photos',
    'createPost.photos.removeAria': 'Remove from list',
    'createPost.photos.deleteSaved': 'Remove from ad',
    'createPost.photos.deleting': 'Removing…',
    'createPost.photos.rules': 'JPG · PNG · WebP — up to 5 MB each — 5 photos max.',
    'createPost.photos.confirmDelete': 'Remove this photo from the ad?',
    'createPost.photos.deleteFailed': 'Could not delete the photo',
    'createPost.photos.errTooLarge': 'A file over 5 MB was skipped.',
    'createPost.photos.errBadType': 'Only JPG, PNG, or WebP are accepted.',
    'createPost.photos.errSlotsFull': 'Maximum reached (5 photos). Remove one to add more.',
    'createPost.photos.errSomeSkipped': 'Some files were not added because the limit was reached.',
    'createPost.success.celebrationTitle': '🎉 Published successfully!',
    'createPost.success.celebrationSubtitle': 'Your ad is live. Open it or find it in your ads list.',
    'createPost.success.viewPost': 'View ad',
    'createPost.success.viewFeed': 'Go to my ads',
    'createPost.success.viewHomeFeed': 'Go to home feed',
    'createPost.success.close': 'Keep browsing',
    'createPost.success.updated': 'Ad updated successfully',
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
