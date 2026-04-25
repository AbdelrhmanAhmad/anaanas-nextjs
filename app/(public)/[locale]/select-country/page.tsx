import { headers } from "next/headers";
import { getBaseDomainForCountryLinks, parseHost } from "@/lib/domain";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/localization";
import { fetchCountries, type Country } from "@/lib/api/countries";

// دالة لبناء subdomain للدولة باستخدام ISO code
function buildCountryHost(
  isoCode: string,
  baseDomain: string,
  port?: string
): string {
  const host = `${isoCode.toLowerCase()}.${baseDomain}`;
  return port ? `${host}:${port}` : host;
}

export default async function SelectCountryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  // جلب الدول من API (SSR)
  let countries: Country[] = [];
  try {
    countries = await fetchCountries();
  } catch (error) {
    console.error("Error fetching countries:", error);
  }

  // تصفية الدول التي لديها iso2 أو iso_code فقط (جميع الدول من API مدعومة)
  const availableCountries = countries.filter(
    (country) => country.iso2 || country.iso_code
  );

  // معلومات الـ host لبناء الروابط (SSR)
  const headersList = await headers();
  const hostInfo = parseHost(headersList.get("host"));
  /** Prefer `NEXT_PUBLIC_BASE_DOMAIN` so apex hosts (e.g. anaanas.com) do not build `iso` + wrong TLD. */
  const linkBaseDomain = getBaseDomainForCountryLinks(hostInfo);
  const proto = headersList.get("x-forwarded-proto") ?? "http";

  const initialLocale = SUPPORTED_LOCALES.includes(
    resolvedParams.locale as SupportedLocale
  )
    ? (resolvedParams.locale as SupportedLocale)
    : DEFAULT_LOCALE;

  const isArabic = initialLocale === "ar";

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
      <main className="container py-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2">
            {isArabic ? "اختر دولتك" : "Choose your country"}
          </h1>
          <p className="text-muted mb-0">
            {isArabic
              ? "اختر الدولة التي تريد تصفح الموقع منها"
              : "Select the country you want to browse from"}
          </p>
        </div>

        <div className="row g-4">
          {availableCountries.length > 0 ? (
            availableCountries.map((country) => {
              const isoCode = (country.iso2 || country.iso_code || "").toLowerCase();
              const countryHost = buildCountryHost(
                isoCode,
                linkBaseDomain,
                hostInfo.port
              );
              const countryUrl = `${proto}://${countryHost}/${initialLocale}`;

              return (
                <div className="col-12 col-sm-6 col-lg-4" key={country.id}>
                  <a
                    href={countryUrl}
                    className="text-decoration-none"
                    style={{ transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  >
                    <div className="card h-100 shadow-sm border-0 country-card">
                      <div
                        className="position-relative overflow-hidden"
                        style={{ height: 160, backgroundColor: "#f7f7f7" }}
                      >
                        {country.flag_full_path ? (
                          <img
                            src={country.flag_full_path}
                            alt={country.name}
                            className="w-100 h-100"
                            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                          />
                        ) : (
                          <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                            {isArabic ? "لا يوجد علم" : "No flag"}
                          </div>
                        )}
                        <span
                          className="badge bg-primary position-absolute top-0 end-0 m-3"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          {isoCode.toUpperCase()}
                        </span>
                      </div>

                      <div className="card-body">
                        <h5 className="card-title mb-1 text-dark">
                          {country.name}
                        </h5>
                        <p className="card-text text-muted mb-0">
                          {isArabic
                            ? "اضغط للانتقال إلى النسخة الخاصة بالدولة"
                            : "Tap to browse the country experience"}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="alert alert-warning text-center mb-0">
                {isArabic
                  ? "لا توجد دول متاحة حالياً"
                  : "No countries available at the moment"}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

