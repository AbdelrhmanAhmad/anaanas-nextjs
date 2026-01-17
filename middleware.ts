import { NextRequest, NextResponse } from "next/server";
import { parseHost } from "./lib/domain";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./lib/localization";

// تجاهل الملفات الثابتة مثل الصور وملفات CSS وما إلى ذلك
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // 1) تخطي الملفات العامة وملفات Next الداخلية و API
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  const { hasCountrySubdomain, countrySubdomain } = parseHost(
    req.headers.get("host")
  );

  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  const localeIsPresent = SUPPORTED_LOCALES.includes(
    maybeLocale as (typeof SUPPORTED_LOCALES)[number]
  );

  // 2) إذا لم يكن هناك prefix للغة -> أضف اللغة الافتراضية
  if (!localeIsPresent) {
    const url = nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${
      pathname === "/" ? "" : pathname
    }`;
    return NextResponse.redirect(url);
  }

  const locale = maybeLocale as (typeof SUPPORTED_LOCALES)[number];

  // 3) إذا لم يوجد subdomain ISO للدولة -> توجيه المستخدم لإختيار الدولة
  if (!hasCountrySubdomain) {
    const isSelectCountry = segments[2] === "select-country";

    if (!isSelectCountry) {
      const url = nextUrl.clone();
      url.pathname = `/${locale}/select-country`;
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);

  if (countrySubdomain) {
    requestHeaders.set("x-country", countrySubdomain);
  } else {
    requestHeaders.delete("x-country");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// تشغيل الـ middleware على كل المسارات ما عدا ملفات Next الداخلية والملفات الثابتة
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};




// import { type NextRequest, NextResponse } from 'next/server'

// export function middleware(request: NextRequest) {
//   const response = NextResponse.next()

//   if (request.nextUrl.pathname === '/') {
//     return NextResponse.redirect(new URL('/feed/home', request.url))
//   }
//   return response
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/',
// }

// export { default } from 'next-auth/middleware'
