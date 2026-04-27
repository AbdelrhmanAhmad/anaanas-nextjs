import { NextRequest, NextResponse } from "next/server";
import {
  parseHost,
  getBaseDomainFromEnv,
  buildCountryHost,
  getBaseDomainForCountryLinks,
} from "./lib/domain";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./lib/localization";
import { detectVisitorCountryIso2 } from "./lib/geo/detectVisitorCountry";
import { fetchSupportedCountryIso2Set } from "./lib/geo/supportedIsoCodes";
import { shouldSkipCountryGeoRouting } from "./lib/geo/shouldSkipGeoRouting";

const PUBLIC_FILE = /\.(.*)$/;

function requestProto(req: NextRequest): string {
  const p = req.headers.get("x-forwarded-proto");
  if (p) return p.split(",")[0]?.trim() || "https";
  return "https";
}

function tenantRedirect(
  req: NextRequest,
  iso: string,
  pathname: string,
  search: string,
) {
  const hostCtx = parseHost(req.headers.get("host"));
  const base = getBaseDomainForCountryLinks(hostCtx);
  const proto = requestProto(req);
  const host = buildCountryHost(iso, base, hostCtx.port);
  const next = new URL(`${proto}://${host}${pathname}${search}`);
  return NextResponse.redirect(next);
}

/** Mismatch tenant vs geo: send to apex picker (avoids wrong-country subdomain). */
function apexSelectCountryRedirect(req: NextRequest, locale: string) {
  const hostCtx = parseHost(req.headers.get("host"));
  const base = getBaseDomainFromEnv() ?? hostCtx.baseDomain;
  const proto = requestProto(req);
  const host = hostCtx.port ? `${base}:${hostCtx.port}` : base;
  const next = new URL(`${proto}://${host}/${locale}/select-country`);
  return NextResponse.redirect(next);
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, search } = nextUrl;

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
    req.headers.get("host"),
  );

  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  const localeIsPresent = SUPPORTED_LOCALES.includes(
    maybeLocale as (typeof SUPPORTED_LOCALES)[number],
  );

  if (!localeIsPresent) {
    const url = nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${
      pathname === "/" ? "" : pathname
    }`;
    return NextResponse.redirect(url);
  }

  const locale = maybeLocale as (typeof SUPPORTED_LOCALES)[number];
  const isSelectCountry = segments[2] === "select-country";
  const skipGeo = shouldSkipCountryGeoRouting(req);

  if (!skipGeo && hasCountrySubdomain && countrySubdomain) {
    const [{ code: detected }, supported] = await Promise.all([
      detectVisitorCountryIso2(req),
      fetchSupportedCountryIso2Set(),
    ]);

    if (
      detected &&
      supported.size > 0 &&
      supported.has(detected) &&
      supported.has(countrySubdomain.toLowerCase()) &&
      detected !== countrySubdomain.toLowerCase()
    ) {
      return apexSelectCountryRedirect(req, locale);
    }
  }

  if (!hasCountrySubdomain) {
    if (!skipGeo) {
      const [{ code: detected }, supported] = await Promise.all([
        detectVisitorCountryIso2(req),
        fetchSupportedCountryIso2Set(),
      ]);

      if (detected && supported.has(detected)) {
        if (!isSelectCountry) {
          return tenantRedirect(req, detected, pathname, search);
        }
        return tenantRedirect(req, detected, `/${locale}`, search);
      }
    }

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

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
