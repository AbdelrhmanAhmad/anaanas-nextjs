'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button, Card, Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BsArrowLeft, BsBarChartLineFill } from 'react-icons/bs'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import wizardStyles from '@/components/cards/CreatePostCard.module.css'
import styles from './postStatistics.module.css'
import AnanasStatsMascot from './AnanasStatsMascot'

type StatsData = {
  post_id: number
  range: { from: string; to: string }
  totals: Record<string, number>
  daily: Array<{
    date: string
    impressions: number
    unique_impressions: number
    views: number
    calls: number
    shares: number
    chats: number
    likes: number
    unlikes: number
    comments: number
  }>
  breakdown: Array<{ event: string; count: number }>
  top?: { user_agents?: Array<{ user_agent: string; count: number }> }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function formatNum(n: number) {
  try {
    return new Intl.NumberFormat().format(n)
  } catch {
    return String(n)
  }
}

function eventLabel(ev: string, locale: SupportedLocale) {
  switch (ev) {
    case 'post_impression':
      return t('stats.event.impressions', locale)
    case 'post_view':
      return t('stats.event.views', locale)
    case 'post_share':
      return t('stats.event.shares', locale)
    case 'post_call':
      return t('stats.event.calls', locale)
    case 'post_chat_open':
      return t('stats.event.chats', locale)
    case 'post_like':
      return t('stats.event.likes', locale)
    case 'post_unlike':
      return t('stats.event.unlikes', locale)
    case 'post_comment':
      return t('stats.event.comments', locale)
    default:
      return ev
  }
}

const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, type: 'spring' as const, stiffness: 380, damping: 28 },
  }),
}

export default function PostStatisticsClient({
  locale = 'ar',
  postId,
  post,
  initial,
}: {
  locale?: SupportedLocale
  postId: string
  post: any
  initial: StatsData | null
}) {
  const [from, setFrom] = useState<string>(initial?.range?.from ?? daysAgoISO(29))
  const [to, setTo] = useState<string>(initial?.range?.to ?? todayISO())
  const [data, setData] = useState<StatsData | null>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const breakdownForChart = useMemo(() => {
    const src = Array.isArray(data?.breakdown) ? data!.breakdown : []
    return src
      .filter((x) => (x?.count ?? 0) > 0)
      .map((x) => ({ name: eventLabel(x.event, locale), value: Number(x.count ?? 0) }))
  }, [data, locale])

  const kpis = useMemo(() => {
    const totals = data?.totals ?? {}
    return [
      { key: 'impressions', label: t('stats.kpi.impressions', locale), value: Number(totals.impressions ?? 0), color: '#0d6efd' },
      { key: 'unique_impressions', label: t('stats.kpi.uniqueImpressions', locale), value: Number(totals.unique_impressions ?? 0), color: '#6610f2' },
      { key: 'views', label: t('stats.kpi.views', locale), value: Number(totals.views ?? 0), color: '#0b1f3a' },
      { key: 'interactions', label: t('stats.kpi.interactions', locale), value: Number((totals.calls ?? 0) + (totals.shares ?? 0) + (totals.chats ?? 0) + (totals.likes ?? 0) + (totals.comments ?? 0)), color: '#c9a227' },
      { key: 'calls', label: t('stats.kpi.calls', locale), value: Number(totals.calls ?? 0), color: '#dc3545' },
      { key: 'shares', label: t('stats.kpi.shares', locale), value: Number(totals.shares ?? 0), color: '#0dcaf0' },
      { key: 'chats', label: t('stats.kpi.chats', locale), value: Number(totals.chats ?? 0), color: '#ffc107' },
    ]
  }, [data, locale])

  const apply = async (nextFrom = from, nextTo = to) => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()
      if (nextFrom) qs.set('from', nextFrom)
      if (nextTo) qs.set('to', nextTo)
      const res = await fetch(`/api/posts/${encodeURIComponent(postId)}/statistics?${qs.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Failed to load statistics')
      setData(json.data as StatsData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const setPreset = (days: number) => {
    const nf = daysAgoISO(days - 1)
    const nt = todayISO()
    setFrom(nf)
    setTo(nt)
    void apply(nf, nt)
  }

  const daily = Array.isArray(data?.daily) ? data!.daily : []

  const pieColors = ['#0d6efd', '#6610f2', '#fecb01', '#0dcaf0', '#dc3545', '#198754', '#0b1f3a', '#6c757d']

  return (
    <div className={styles.pageRoot}>
      <Container className="py-4">
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnanasStatsMascot />
          <div className={styles.heroCopy}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2">
                <BsBarChartLineFill style={{ color: '#151515', fontSize: '1.35rem' }} />
                <h4 className="mb-0" style={{ color: '#151515', fontWeight: 900 }}>
                  {t('stats.title', locale)}
                </h4>
              </div>
              <Link className={`btn btn-outline-secondary btn-sm ${styles.backBtn}`} href={`/${locale}/post/${postId}`}>
                <BsArrowLeft className="me-1" />
                {t('stats.backToPost', locale)}
              </Link>
            </div>
            <div className="text-muted small mt-2" style={{ maxWidth: '42rem' }}>
              {t('stats.subtitle', locale)}: <span className="fw-semibold text-dark">{post?.title ?? `#${postId}`}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          <Card className={`border-0 shadow-none mb-3 ${wizardStyles.wizardCard} ${wizardStyles.smartCard} ${styles.toolbarCard}`}>
            <Card.Body>
              <Row className="g-2 align-items-end">
                <Col xs={12} md={4}>
                  <Form.Label className="small text-muted mb-1">{t('stats.from', locale)}</Form.Label>
                  <Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label className="small text-muted mb-1">{t('stats.to', locale)}</Form.Label>
                  <Form.Control type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </Col>
                <Col xs={12} md={4} className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="dark"
                    disabled={loading}
                    onClick={() => void apply()}
                    style={{
                      background: 'linear-gradient(180deg, #151515 0%, #2a2a2a 100%)',
                      borderColor: '#151515',
                      fontWeight: 800,
                      borderRadius: 12,
                    }}
                  >
                    {loading ? t('stats.loading', locale) : t('stats.apply', locale)}
                  </Button>
                  <Button variant="outline-secondary" disabled={loading} onClick={() => setPreset(7)} style={{ borderRadius: 12, fontWeight: 700 }}>
                    {t('stats.preset.7d', locale)}
                  </Button>
                  <Button variant="outline-secondary" disabled={loading} onClick={() => setPreset(30)} style={{ borderRadius: 12, fontWeight: 700 }}>
                    {t('stats.preset.30d', locale)}
                  </Button>
                  <Button variant="outline-secondary" disabled={loading} onClick={() => setPreset(90)} style={{ borderRadius: 12, fontWeight: 700 }}>
                    {t('stats.preset.90d', locale)}
                  </Button>
                </Col>
              </Row>

              {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
            </Card.Body>
          </Card>
        </motion.div>

        <Row className="g-3 mb-3">
          {kpis.map((k, idx) => (
            <Col key={k.key} xs={12} sm={6} lg={4} xl={2} className={styles.kpiCol}>
              <motion.div
                custom={idx}
                variants={listItem}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
                style={{ height: '100%' }}
              >
                <Card className={`border-0 shadow-none h-100 ${wizardStyles.wizardCard} ${wizardStyles.smartCard} ${styles.kpiCard}`}>
                  <Card.Body>
                    <div className="small text-muted">{k.label}</div>
                    <div className={`fs-4 fw-bold ${styles.kpiValue}`} style={{ color: k.color }}>
                      {formatNum(k.value)}
                    </div>
                    <div className={`text-muted ${styles.kpiRange}`}>
                      {from} → {to}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}>
          <Card className={`border-0 shadow-none ${wizardStyles.wizardCard} ${wizardStyles.smartCard} ${styles.chartsShell}`}>
            <Card.Body>
              <Tabs defaultActiveKey="overview" className="mb-3">
                <Tab eventKey="overview" title={t('stats.tabs.overview', locale)}>
                  <Row className="g-3">
                    <Col lg={8}>
                      <div className={styles.chartPanel}>
                        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                          <div className="fw-bold" style={{ color: '#151515' }}>
                            {t('stats.charts.viewsVsUnique', locale)}
                          </div>
                          <div className="small text-muted">{t('stats.hint.uniqueDefinition', locale)}</div>
                        </div>
                        <div style={{ width: '100%', height: 320 }}>
                          <ResponsiveContainer>
                            <LineChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,21,21,0.08)" />
                              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="impressions" name={t('stats.kpi.impressions', locale)} stroke="#0d6efd" strokeWidth={2} dot={false} />
                              <Line type="monotone" dataKey="unique_impressions" name={t('stats.kpi.uniqueImpressions', locale)} stroke="#6610f2" strokeWidth={2} dot={false} />
                              <Line type="monotone" dataKey="views" name={t('stats.kpi.views', locale)} stroke="#151515" strokeWidth={2} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className={`${styles.chartPanel} h-100`}>
                        <div className="fw-bold mb-2" style={{ color: '#151515' }}>
                          {t('stats.charts.breakdown', locale)}
                        </div>
                        <div style={{ width: '100%', height: 320 }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Tooltip />
                              <Pie data={breakdownForChart} dataKey="value" nameKey="name" outerRadius={110} label>
                                {breakdownForChart.map((_, i) => (
                                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="interactions" title={t('stats.tabs.interactions', locale)}>
                  <div className={styles.chartPanel}>
                    <div className="fw-bold mb-2" style={{ color: '#151515' }}>
                      {t('stats.charts.interactionsOverTime', locale)}
                    </div>
                    <div style={{ width: '100%', height: 360 }}>
                      <ResponsiveContainer>
                        <BarChart data={daily}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,21,21,0.08)" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="calls" name={t('stats.kpi.calls', locale)} fill="#dc3545" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="shares" name={t('stats.kpi.shares', locale)} fill="#0dcaf0" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="chats" name={t('stats.kpi.chats', locale)} fill="#fecb01" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="likes" name={t('stats.event.likes', locale)} fill="#198754" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="comments" name={t('stats.event.comments', locale)} fill="#151515" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="audience" title={t('stats.tabs.audience', locale)}>
                  <div className={styles.chartPanel}>
                    <div className="fw-bold mb-2" style={{ color: '#151515' }}>
                      {t('stats.top.userAgents', locale)}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm mb-0">
                        <thead>
                          <tr>
                            <th>{t('stats.ua', locale)}</th>
                            <th className="text-end">{t('stats.count', locale)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data?.top?.user_agents ?? []).map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-break">{row.user_agent}</td>
                              <td className="text-end fw-semibold">{formatNum(Number(row.count ?? 0))}</td>
                            </tr>
                          ))}
                          {(!data?.top?.user_agents || data.top.user_agents.length === 0) && (
                            <tr>
                              <td colSpan={2} className="text-muted">
                                {t('stats.noData', locale)}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}
