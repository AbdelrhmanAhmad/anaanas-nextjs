'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap'
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
import { BsBarChartLineFill } from 'react-icons/bs'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

type StatsData = {
  range: { from: string; to: string }
  totals: Record<string, number>
  daily: Array<{
    date: string
    impressions: number
    views: number
    shares: number
    calls: number
    chats: number
    likes: number
    comments: number
  }>
  breakdown: Array<{ event: string; count: number }>
  status_breakdown?: Array<{ status: string | null; count: number }>
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function formatNum(n: number, locale: SupportedLocale) {
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en').format(n)
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

export default function ProfileStatisticsClient({
  locale = 'ar',
  initial,
}: {
  locale?: SupportedLocale
  initial: StatsData | null
}) {
  const [from, setFrom] = useState<string>(initial?.range?.from ?? '')
  const [to, setTo] = useState<string>(initial?.range?.to ?? '')
  const [data, setData] = useState<StatsData | null>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metric, setMetric] = useState<'impressions' | 'views' | 'likes' | 'comments' | 'shares' | 'chats' | 'calls'>('impressions')
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const apply = async (nextFrom = from, nextTo = to) => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()
      if (nextFrom) qs.set('from', nextFrom)
      if (nextTo) qs.set('to', nextTo)
      const res = await fetch(`/api/posts/my-statistics?${qs.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.success) throw new Error(json?.message || t('profile.stats.loadError', locale))
      setData(json.data as StatsData)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('profile.stats.loadError', locale))
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

  useEffect(() => {
    if (initial?.range?.from && initial?.range?.to) return
    const nf = daysAgoISO(29)
    const nt = todayISO()
    setFrom(nf)
    setTo(nt)
  }, [initial?.range?.from, initial?.range?.to])

  const daily = Array.isArray(data?.daily) ? data!.daily : []
  const totals = data?.totals ?? {}
  const dailyInteractions = useMemo(
    () =>
      daily.map((d) => ({
        date: d.date,
        interactions: Number(d.likes ?? 0) + Number(d.comments ?? 0) + Number(d.shares ?? 0) + Number(d.chats ?? 0) + Number(d.calls ?? 0),
      })),
    [daily]
  )

  const kpis = useMemo(
    () => [
      { key: 'total_posts', label: t('profile.stats.totalPosts', locale), value: Number(totals.total_posts ?? 0), color: '#0d6efd' },
      { key: 'active_posts', label: t('profile.stats.activePosts', locale), value: Number(totals.active_posts ?? 0), color: '#198754' },
      { key: 'deleted_posts', label: t('profile.stats.deletedPosts', locale), value: Number(totals.deleted_posts ?? 0), color: '#dc3545' },
      { key: 'comments', label: t('profile.stats.comments', locale), value: Number(totals.comments ?? 0), color: '#0b1f3a' },
      { key: 'interactions', label: t('profile.stats.interactions', locale), value: Number(totals.interactions ?? 0), color: '#6610f2' },
    ],
    [totals, locale]
  )

  const breakdownForChart = useMemo(() => {
    const src = Array.isArray(data?.breakdown) ? data!.breakdown : []
    return src
      .filter((x) => (x?.count ?? 0) > 0)
      .map((x) => ({ name: eventLabel(x.event, locale), value: Number(x.count ?? 0) }))
  }, [data, locale])

  const pieColors = ['#0d6efd', '#6610f2', '#0dcaf0', '#ffc107', '#dc3545', '#198754', '#0b1f3a', '#6c757d']
  const metricOptions: Array<{ key: typeof metric; label: string; color: string }> = [
    { key: 'impressions', label: t('stats.kpi.impressions', locale), color: '#0d6efd' },
    { key: 'views', label: t('stats.kpi.views', locale), color: '#0b1f3a' },
    { key: 'likes', label: t('stats.event.likes', locale), color: '#dc3545' },
    { key: 'comments', label: t('stats.event.comments', locale), color: '#6610f2' },
    { key: 'shares', label: t('stats.event.shares', locale), color: '#0dcaf0' },
    { key: 'chats', label: t('stats.event.chats', locale), color: '#ffc107' },
    { key: 'calls', label: t('stats.event.calls', locale), color: '#198754' },
  ]
  const activeMetric = metricOptions.find((m) => m.key === metric) ?? metricOptions[0]

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <BsBarChartLineFill style={{ color: '#0b1f3a' }} />
            <h4 className="mb-0" style={{ color: '#0b1f3a' }}>
              {t('profile.stats.title', locale)}
            </h4>
          </div>
          <div className="text-muted small mt-1">{t('profile.stats.subtitle', locale)}</div>
        </div>
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

          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <div className="text-muted small">{t('profile.stats.metricTitle', locale)}:</div>
            <ButtonGroup size="sm">
              {metricOptions.map((m) => (
                <Button
                  key={m.key}
                  variant={metric === m.key ? 'primary' : 'outline-secondary'}
                  onClick={() => setMetric(m.key)}
                >
                  {m.label}
                </Button>
              ))}
            </ButtonGroup>
            <div className="ms-auto d-flex gap-2">
              <Button
                size="sm"
                variant={chartType === 'line' ? 'dark' : 'outline-secondary'}
                onClick={() => setChartType('line')}
              >
                {t('profile.stats.chartLine', locale)}
              </Button>
              <Button
                size="sm"
                variant={chartType === 'bar' ? 'dark' : 'outline-secondary'}
                onClick={() => setChartType('bar')}
              >
                {t('profile.stats.chartBar', locale)}
              </Button>
            </div>
          </div>

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
                  {formatNum(k.value, locale)}
                </div>
                <div className="small text-muted">
                  {from} → {to}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="fw-semibold mb-2">{t('profile.stats.dailyTitle', locale)}</div>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  {chartType === 'line' ? (
                    <LineChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={activeMetric.key} name={activeMetric.label} stroke={activeMetric.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  ) : (
                    <BarChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={activeMetric.key} name={activeMetric.label} fill={activeMetric.color} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="fw-semibold mb-2">{t('profile.stats.breakdownTitle', locale)}</div>
              {breakdownForChart.length === 0 ? (
                <div className="text-muted small">{t('profile.stats.emptyBreakdown', locale)}</div>
              ) : (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={breakdownForChart} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {breakdownForChart.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="fw-semibold mb-2">{t('profile.stats.interactionsDaily', locale)}</div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={dailyInteractions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="interactions" name={t('profile.stats.interactions', locale)} fill="#6610f2" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          {Array.isArray(data?.status_breakdown) && data!.status_breakdown!.length > 0 ? (
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="fw-semibold mb-2">{t('profile.stats.statusBreakdown', locale)}</div>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={data!.status_breakdown!.map((s) => ({ status: s.status || t('profile.stats.statusUnknown', locale), count: s.count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          ) : null}
        </Col>
      </Row>
    </Container>
  )
}
