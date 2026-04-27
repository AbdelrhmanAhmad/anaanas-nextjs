import fs from "fs";
import path from "path";

const REL_FLAG_DIR = ["public", "assets", "flags", "128x128"] as const;

/**
 * Static flag asset: `/assets/flags/128x128/{iso2}.png` when the file exists under `public/`.
 */
export function localCountryFlagPath(iso2Lower: string): string {
  return `/assets/flags/128x128/${iso2Lower.toLowerCase()}.png`;
}

export function localCountryFlagFileExists(iso2Lower: string): boolean {
  if (!/^[a-z]{2}$/i.test(iso2Lower)) return false;
  const file = path.join(
    process.cwd(),
    ...REL_FLAG_DIR,
    `${iso2Lower.toLowerCase()}.png`,
  );
  try {
    return fs.existsSync(file);
  } catch {
    return false;
  }
}

/**
 * Prefer API `flag_full_path` when present; otherwise use bundled 128×128 PNG if it exists.
 */
export function resolveCountryFlagUrl(
  iso2Lower: string,
  apiFlagFullPath: string | null | undefined,
): string | null {
  const fromApi = apiFlagFullPath?.trim();
  if (fromApi) return fromApi;
  const iso = iso2Lower.toLowerCase();
  if (localCountryFlagFileExists(iso)) return localCountryFlagPath(iso);
  return null;
}
