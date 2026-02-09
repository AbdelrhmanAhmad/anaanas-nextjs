'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
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
      { key: 'interactions', label: t('stats.kpi.interactions', locale), value: Number((totals.calls ?? 0) + (totals.shares ?? 0) + (totals.chats ?? 0) + (totals.likes ?? 0) + (totals.comments ?? 0)), color: '#0b1f3a' },
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

  const pieColors = ['#0d6efd', '#6610f2', '#0dcaf0', '#ffc107', '#dc3545', '#198754', '#0b1f3a', '#6c757d']

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <BsBarChartLineFill style={{ color: '#0b1f3a' }} />
            <h4 className="mb-0" style={{ color: '#0b1f3a' }}>
              {t('stats.title', locale)}
            </h4>
          </div>
          <div className="text-muted small mt-1">
            {t('stats.subtitle', locale)}: <span className="fw-semibold">{post?.title ?? `#${postId}`}</span>
          </div>
        </div>
        <Link className="btn btn-outline-secondary btn-sm" href={`/${locale}/post/${postId}`}>
          <BsArrowLeft className="me-1" />
          {t('stats.backToPost', locale)}
        </Link>
      </div>

      <Card className="border-0 shadow-sm mb-3">
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
                variant="primary"
                disabled={loading}
                onClick={() => void apply()}
                style={{ backgroundColor: '#0b1f3a', borderColor: '#0b1f3a' }}
              >
                {loading ? t('stats.loading', locale) : t('stats.apply', locale)}
              </Button>
              <Button variant="outline-secondary" disabled={loading} onClick={() => setPreset(7)}>
                {t('stats.preset.7d', locale)}
              </Button>
              <Button variant="outline-secondary" disabled={loading} onClick={() => setPreset(30)}>
                {t('stats.preset.30d', locale)}
              </Button>
              <Button variant="outline-secondary" disabled={loading} onClick={() => setPreset(90)}>
                {t('stats.preset.90d', locale)}
              </Button>
            </Col>
          </Row>

          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        </Card.Body>
      </Card>

      <Row className="g-3 mb-3">
        {kpis.map((k) => (
          <Col key={k.key} xs={12} sm={6} lg={4} xl={2}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="small text-muted">{k.label}</div>
                <div className="fs-4 fw-bold" style={{ color: k.color }}>
                  {formatNum(k.value)}
                </div>
                <div className="small text-muted">
                  {from} → {to}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="overview" className="mb-3">
            <Tab eventKey="overview" title={t('stats.tabs.overview', locale)}>
              <Row className="g-3">
                <Col lg={8}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="fw-semibold">{t('stats.charts.viewsVsUnique', locale)}</div>
                        <div className="small text-muted">{t('stats.hint.uniqueDefinition', locale)}</div>
                      </div>
                      <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                          <LineChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                              <Line type="monotone" dataKey="impressions" name={t('stats.kpi.impressions', locale)} stroke="#0d6efd" strokeWidth={2} dot={false} />
                              <Line type="monotone" dataKey="unique_impressions" name={t('stats.kpi.uniqueImpressions', locale)} stroke="#6610f2" strokeWidth={2} dot={false} />
                              <Line type="monotone" dataKey="views" name={t('stats.kpi.views', locale)} stroke="#0b1f3a" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="border-0 bg-light h-100">
                    <Card.Body>
                      <div className="fw-semibold mb-2">{t('stats.charts.breakdown', locale)}</div>
                      <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Tooltip />
                            <Pie data={breakdownForChart} dataKey="value" nameKey="name" outerRadius={110} label>
                              {breakdownForChart.map((_, idx) => (
                                <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="interactions" title={t('stats.tabs.interactions', locale)}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <div className="fw-semibold mb-2">{t('stats.charts.interactionsOverTime', locale)}</div>
                  <div style={{ width: '100%', height: 360 }}>
                    <ResponsiveContainer>
                      <BarChart data={daily}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="calls" name={t('stats.kpi.calls', locale)} fill="#dc3545" />
                        <Bar dataKey="shares" name={t('stats.kpi.shares', locale)} fill="#0dcaf0" />
                        <Bar dataKey="chats" name={t('stats.kpi.chats', locale)} fill="#ffc107" />
                        <Bar dataKey="likes" name={t('stats.event.likes', locale)} fill="#198754" />
                        <Bar dataKey="comments" name={t('stats.event.comments', locale)} fill="#0b1f3a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="audience" title={t('stats.tabs.audience', locale)}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <div className="fw-semibold mb-2">{t('stats.top.userAgents', locale)}</div>
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
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  )
}

