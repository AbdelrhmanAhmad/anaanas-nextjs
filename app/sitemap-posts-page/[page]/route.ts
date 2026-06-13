import {
  buildPostsSitemapUrlsForPage,
  buildTenantOrigin,
  buildUrlSetXml,
  resolveCountryIso2FromRequest,
  xmlResponse,
} from '@/lib/seo/sitemapBuilders'
import { resolveSeoOrigin } from '@/lib/seo/resolveSeoOrigin'

export const revalidate = 86400

type RouteContext = { params: Promise<{ page: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { page: pageRaw } = await context.params
  const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

  const origin = await resolveSeoOrigin()
  const countryIso2 = await resolveCountryIso2FromRequest()
  if (!countryIso2) {
    return xmlResponse(buildUrlSetXml([]))
  }

  const tenantOrigin = buildTenantOrigin(origin, countryIso2)
  const urls = await buildPostsSitemapUrlsForPage(tenantOrigin, countryIso2, page)
  return xmlResponse(buildUrlSetXml(urls))
}
