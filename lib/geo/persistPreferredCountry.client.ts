"use client";

import { getBaseDomainFromEnv } from "@/lib/domain";
import {
  PREFERRED_COUNTRY_COOKIE,
  PREFERRED_COUNTRY_MAX_AGE,
  normalizePreferredCountryIso2,
} from "@/lib/geo/preferredCountryCookie";

const LS_KEY = "ananas_country_pref";

/**
 * Persist the user's chosen tenant country for middleware (cookie on parent domain)
 * and a localStorage mirror for client-only reads.
 */
export function persistPreferredCountryIso2(iso2: string): void {
  if (typeof window === "undefined") return;
  const code = normalizePreferredCountryIso2(iso2);
  if (!code) return;

  const envBase = getBaseDomainFromEnv();
  const segments = window.location.hostname.split(".");
  const apexFromHost =
    segments.length >= 2
      ? segments.slice(-2).join(".").toLowerCase()
      : window.location.hostname.toLowerCase();
  const base = (envBase || apexFromHost).split(":")[0]?.toLowerCase() ?? "";

  let cookie = `${PREFERRED_COUNTRY_COOKIE}=${encodeURIComponent(code)}; Path=/; Max-Age=${PREFERRED_COUNTRY_MAX_AGE}; SameSite=Lax`;
  if (window.location.protocol === "https:") {
    cookie += "; Secure";
    if (base && !base.includes("localhost")) {
      cookie += `; Domain=${base}`;
    }
  }
  document.cookie = cookie;

  try {
    localStorage.setItem(LS_KEY, code);
  } catch {
    /* ignore quota / private mode */
  }
}
