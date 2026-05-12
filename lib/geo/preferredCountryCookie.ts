import type { NextRequest } from "next/server";

/** Shared across middleware + client: last explicit country choice (ISO2, lowercase). */
export const PREFERRED_COUNTRY_COOKIE = "ananas_country_pref";

/** ~13 months — long-lived preference when geo detection fails. */
export const PREFERRED_COUNTRY_MAX_AGE = 60 * 60 * 24 * 400;

const ISO2 = /^[a-z]{2}$/;

export function normalizePreferredCountryIso2(
  raw: string | null | undefined,
): string | null {
  const v = (raw ?? "").trim().toLowerCase();
  return ISO2.test(v) ? v : null;
}

export function readPreferredCountryIsoFromRequest(
  req: NextRequest,
): string | null {
  return normalizePreferredCountryIso2(
    req.cookies.get(PREFERRED_COUNTRY_COOKIE)?.value,
  );
}
