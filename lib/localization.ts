export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "ar";

export const isSupportedLocale = (
  locale: string | null | undefined
): locale is SupportedLocale =>
  Boolean(
    locale &&
      SUPPORTED_LOCALES.includes(locale as SupportedLocale)
  );

export const SUPPORTED_COUNTRIES = ["jo", "eg", "sa", "ae" ,"demo"] as const;
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

