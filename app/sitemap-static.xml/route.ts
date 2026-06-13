import {
  buildStaticSitemapUrls,
  buildTenantOrigin,
  buildUrlSetXml,
  resolveCountryIso2FromRequest,
  xmlResponse,
} from '@/lib/seo/sitemapBuilders'
import { resolveSeoOrigin } from '@/lib/seo/resolveSeoOrigin'

export const revalidate = 86400

export async function GET() {
  const origin = await resolveSeoOrigin()
  const countryIso2 = await resolveCountryIso2FromRequest()
  const tenantOrigin = buildTenantOrigin(origin, countryIso2)
  const urls = await buildStaticSitemapUrls(tenantOrigin)
  return xmlResponse(buildUrlSetXml(urls))
}
