import {
  buildCountriesSitemapIndex,
  buildTenantOrigin,
  buildTenantSitemapIndex,
  resolveCountryIso2FromRequest,
  xmlResponse,
} from '@/lib/seo/sitemapBuilders'
import { resolveSeoOrigin } from '@/lib/seo/resolveSeoOrigin'
import { parseHost } from '@/lib/domain'
import { headers } from 'next/headers'

export const revalidate = 86400

export async function GET() {
  const origin = await resolveSeoOrigin()
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host')
  const hostInfo = parseHost(host)

  if (!hostInfo.hasCountrySubdomain) {
    const body = await buildCountriesSitemapIndex(origin)
    return xmlResponse(body)
  }

  const countryIso2 = await resolveCountryIso2FromRequest()
  const tenantOrigin = buildTenantOrigin(origin, countryIso2)
  const body = await buildTenantSitemapIndex(tenantOrigin)
  return xmlResponse(body)
}
