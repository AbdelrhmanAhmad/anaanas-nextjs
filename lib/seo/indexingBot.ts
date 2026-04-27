/**
 * Detect crawlers / SEO tools so we can skip splash, top loader, and optional third-party scripts.
 * Keep list conservative: match known bots, avoid false positives on mobile browsers.
 */

const INDEXING_BOT_REGEXES: RegExp[] = [
  /googlebot\b/i,
  /google-inspectiontool/i,
  /adsbot-google/i,
  /mediapartners-google/i,
  /bingbot\b/i,
  /msnbot\b/i,
  /slurp\b/i,
  /duckduckbot\b/i,
  /baiduspider\b/i,
  /yandexbot\b/i,
  /facebookexternalhit/i,
  /facebot\b/i,
  /linkedinbot\b/i,
  /twitterbot\b/i,
  /applebot\b/i,
  /ia_archiver\b/i,
  /ahrefsbot\b/i,
  /semrushbot\b/i,
  /mj12bot\b/i,
  /petalbot\b/i,
  /bytespider\b/i,
  /amazonbot\b/i,
  /gptbot\b/i,
  /claudebot\b/i,
  /anthropic-ai/i,
  /perplexitybot\b/i,
]

export function isIndexingBotUserAgent(userAgent: string | null | undefined): boolean {
  if (userAgent == null || userAgent.length < 12) return false
  return INDEXING_BOT_REGEXES.some((re) => re.test(userAgent))
}
