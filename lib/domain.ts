export type HostContext = {
  hostname: string;
  port?: string;
  baseDomain: string;
  hasCountrySubdomain: boolean;
  countrySubdomain?: string;
};

const FALLBACK_HOSTNAME = "localhost";

export function parseHost(hostHeader: string | null): HostContext {
  const rawHost = (hostHeader ?? FALLBACK_HOSTNAME).trim();
  const [hostnamePart = FALLBACK_HOSTNAME, port] = rawHost.split(":");
  const hostname = hostnamePart.toLowerCase();
  const labels = hostname.split(".").filter(Boolean);

  const firstLabel = labels[0];
  
  // إذا كان هناك أكثر من label، نعتبر الأول subdomain للدولة
  // (مثال: jo.example.com -> jo هو subdomain الدولة)
  const hasCountrySubdomain = Boolean(firstLabel && labels.length > 1);

  const baseDomain = hasCountrySubdomain
    ? labels.slice(1).join(".") || FALLBACK_HOSTNAME
    : hostname || FALLBACK_HOSTNAME;

  return {
    hostname,
    port,
    baseDomain,
    hasCountrySubdomain,
    countrySubdomain: hasCountrySubdomain ? firstLabel : undefined,
  };
}

export function buildCountryHost(
  country: string,
  baseDomain: string,
  port?: string
): string {
  const host = `${country.toLowerCase()}.${baseDomain}`;
  return port ? `${host}:${port}` : host;
}

