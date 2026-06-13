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
import {
  PREFERRED_COUNTRY_COOKIE,
  PREFERRED_COUNTRY_MAX_AGE,
  normalizePreferredCountryIso2,
  readPreferredCountryIsoFromRequest,
} from "./lib/geo/preferredCountryCookie";

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

function applyPreferredCountryCookie(
  res: NextResponse,
  req: NextRequest,
  iso: string,
) {
  const code = normalizePreferredCountryIso2(iso);
  if (!code) return res;

  const baseRaw = getBaseDomainFromEnv() ?? "";
  const base = baseRaw.split(":")[0]?.toLowerCase() ?? "";
  const secure = requestProto(req) === "https";

  res.cookies.set({
    name: PREFERRED_COUNTRY_COOKIE,
    value: code,
    path: "/",
    maxAge: PREFERRED_COUNTRY_MAX_AGE,
    sameSite: "lax",
    secure,
    ...(base && !base.includes("localhost") ? { domain: base } : {}),
  });
  return res;
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
    const hostCtx = parseHost(req.headers.get("host"));
    if (hostCtx.hasCountrySubdomain && hostCtx.countrySubdomain) {
      const res = NextResponse.next();
      res.headers.set("x-country", hostCtx.countrySubdomain);
      return res;
    }
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
  const preferredIso = readPreferredCountryIsoFromRequest(req);

  let supported = new Set<string>();
  let detected: string | null = null;

  if (!skipGeo) {
    const [{ code }, s] = await Promise.all([
      detectVisitorCountryIso2(req),
      fetchSupportedCountryIso2Set(),
    ]);
    supported = s;
    detected = code;
  }

  const subNorm = countrySubdomain?.toLowerCase() ?? "";

  // Tenant host lists a plausible ISO label, but API has no such country → picker on apex.
  if (
    !skipGeo &&
    hasCountrySubdomain &&
    subNorm &&
    supported.size > 0 &&
    !supported.has(subNorm)
  ) {
    return apexSelectCountryRedirect(req, locale);
  }

  // Mismatch geo vs subdomain: allow browsing if user explicitly chose this tenant (cookie).
  if (!skipGeo && hasCountrySubdomain && subNorm) {
    if (
      detected &&
      supported.size > 0 &&
      supported.has(detected) &&
      supported.has(subNorm) &&
      detected !== subNorm
    ) {
      if (preferredIso !== subNorm) {
        return apexSelectCountryRedirect(req, locale);
      }
    }
  }

  if (!hasCountrySubdomain) {
    if (!skipGeo) {
      if (detected && supported.has(detected)) {
        if (!isSelectCountry) {
          return tenantRedirect(req, detected, pathname, search);
        }
        return tenantRedirect(req, detected, `/${locale}`, search);
      }
      if (preferredIso && supported.has(preferredIso)) {
        if (!isSelectCountry) {
          return tenantRedirect(req, preferredIso, pathname, search);
        }
        return tenantRedirect(req, preferredIso, `/${locale}`, search);
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

  let res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Align preference with the active tenant (apex can read it if geo detection fails later).
  const syncSubCookie =
    Boolean(subNorm) &&
    normalizePreferredCountryIso2(subNorm) === subNorm &&
    (supported.size === 0 || supported.has(subNorm));
  if (syncSubCookie) {
    res = applyPreferredCountryCookie(res, req, subNorm);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
