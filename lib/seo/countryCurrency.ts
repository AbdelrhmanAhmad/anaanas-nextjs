/** ISO2 (lowercase) → ISO 4217 currency. Only map when confident. */
const COUNTRY_CURRENCY: Record<string, string> = {
  jo: 'JOD',
  eg: 'EGP',
  sa: 'SAR',
  ae: 'AED',
  kw: 'KWD',
  qa: 'QAR',
  bh: 'BHD',
  om: 'OMR',
  lb: 'LBP',
  iq: 'IQD',
  sy: 'SYP',
  ps: 'ILS',
  ye: 'YER',
  ly: 'LYD',
  tn: 'TND',
  dz: 'DZD',
  ma: 'MAD',
  sd: 'SDG',
}

export function resolveCurrencyForCountry(iso2: string | null | undefined): string | null {
  if (!iso2) return null
  const key = iso2.trim().toLowerCase()
  return COUNTRY_CURRENCY[key] ?? null
}
