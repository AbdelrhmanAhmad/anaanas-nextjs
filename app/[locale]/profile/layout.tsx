'use client'
import GlightBox from '@/components/GlightBox'
import type { ChildrenType } from '@/types/component'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProfileImageEditor from './layout/components/ProfileImageEditor'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import clsx from 'clsx'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from 'react-bootstrap'
import {
  BsBookmark,
  BsBriefcase,
  BsCalendar2Plus,
  BsCalendarDate,
  BsEnvelope,
  BsFileEarmarkPdf,
  BsGear,
  BsHeart,
  BsLock,
  BsPatchCheckFill,
  BsPencilFill,
  BsThreeDots,
} from 'react-icons/bs'

import { PROFILE_MENU_ITEMS } from '@/assets/data/menu-items'

import avatar7 from '@/assets/images/avatar/07.jpg'
import background5 from '@/assets/images/bg/05.jpg'

const Photos = ({
  locale,
  images,
  loading,
}: {
  locale: SupportedLocale
  images: Array<{ image_full_url?: string; image?: string; post?: { title?: string } }>
  loading: boolean
}) => {
  return (
    <Card>
      <CardHeader className="d-sm-flex justify-content-between border-0">
        <CardTitle>{t('profile.photos', locale)}</CardTitle>
      </CardHeader>
      <CardBody className="position-relative pt-0">
        {loading ? (
          <div className="text-muted small">{t('profile.photosLoading', locale)}</div>
        ) : images.length === 0 ? (
          <div className="text-muted small">{t('profile.noImages', locale)}</div>
        ) : (
          <Row className="g-2">
            {images.slice(0, 6).map((img, idx) => {
              const src = resolveMediaUrl(img.image_full_url || img.image)
              if (!src) return null
              return (
                <Col xs={4} key={`${src}-${idx}`}>
                  <GlightBox href={src} data-gallery="profile-photos">
                    <Image className="rounded img-fluid" src={src} alt={img.post?.title || 'photo'} width={200} height={200} />
                  </GlightBox>
                </Col>
              )
            })}
          </Row>
        )}
      </CardBody>
    </Card>
  )
}

const ProfileLayout = ({ children }: ChildrenType) => {
  const pathName = usePathname()
  const { data: session } = useSession()
  const params = useParams<{ locale?: string }>()
  const localeParam = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
  const locale = (localeParam && isSupportedLocale(localeParam)) ? localeParam : DEFAULT_LOCALE
  const [userData, setUserData] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [myImages, setMyImages] = useState<any[]>([])
  const [myImagesLoading, setMyImagesLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/profile')
        const data = await res.json()
        if (data.success && data.data?.user) {
          setUserData(data.data.user)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    if (session) {
      fetchUserData()
    }
  }, [session, refreshKey])

  useEffect(() => {
    const fetchMyImages = async () => {
      try {
        setMyImagesLoading(true)
        const res = await fetch('/api/posts/my-images?page=1&per_page=6')
        const data = await res.json()
        if (res.ok && Array.isArray(data?.data)) {
          setMyImages(data.data)
        } else {
          setMyImages([])
        }
      } catch (error) {
        console.error('Error fetching my images:', error)
        setMyImages([])
      } finally {
        setMyImagesLoading(false)
      }
    }
    if (session) {
      fetchMyImages()
    }
  }, [session, refreshKey])

  const avatarUrl = userData?.avatar_url
    ? resolveMediaUrl(userData.avatar_url)
    : userData?.avatar
      ? resolveMediaUrl(userData.avatar)
      : avatar7.src
  const coverUrl = userData?.cover_image_url
    ? resolveMediaUrl(userData.cover_image_url)
    : userData?.cover_image
      ? resolveMediaUrl(userData.cover_image)
      : background5.src

  const formatDate = (value?: string) => {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    try {
      return d.toLocaleDateString(locale === 'ar' ? 'ar' : 'en')
    } catch {
      return d.toISOString().slice(0, 10)
    }
  }

  const aboutItems = [
    {
      key: 'born',
      icon: <BsCalendarDate size={18} className="fa-fw pe-1" />,
      value: userData?.date_of_birth ? formatDate(userData.date_of_birth) : '',
    },
    {
      key: 'email',
      icon: <BsEnvelope size={18} className="fa-fw pe-1" />,
      value: userData?.email || (session?.user as any)?.email || '',
    },
    {
      key: 'mobile',
      icon: <BsHeart size={18} className="fa-fw pe-1" />,
      value: userData?.mobile || '',
    },
    {
      key: 'username',
      icon: <BsBriefcase size={18} className="fa-fw pe-1" />,
      value: userData?.username || '',
    },
    {
      key: 'joined',
      icon: <BsCalendar2Plus size={18} className="fa-fw pe-1" />,
      value: userData?.created_at ? formatDate(userData.created_at) : '',
    },
  ].filter((item) => Boolean(item.value))

  const labelForItem = (key?: string, fallback?: string) => {
    switch (key) {
      case 'profile-feed':
        return t('profile.tabs.feed', locale)
      case 'profile-about':
        return t('profile.tabs.about', locale)
      case 'profile-statistics':
        return t('profile.tabs.statistics', locale)
      case 'profile-activity':
        return t('profile.tabs.activity', locale)
      default:
        return fallback || ''
    }
  }

  return (
    <>
      <main>
        <Container>
          <Row className="g-4">
            <Col lg={8} className="vstack gap-4">
              <Card>
                <div
                  className="h-200px rounded-top position-relative"
                  style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <ProfileImageEditor type="cover" onUpdate={() => setRefreshKey(k => k + 1)} />
                </div>
                <CardBody className="py-0">
                  <div className="d-sm-flex align-items-start text-center text-sm-start">
                    <div className="position-relative">
                      <div className="avatar avatar-xxl mt-n5 mb-3">
                        <Image 
                          className="avatar-img rounded-circle border border-white border-3" 
                          src={avatarUrl} 
                          alt="avatar"
                          width={120}
                          height={120}
                        />
                      </div>
                      <ProfileImageEditor type="avatar" onUpdate={() => setRefreshKey(k => k + 1)} />
                    </div>
                    <div className="ms-sm-4 mt-sm-3">
                      <h1 className="mb-0 h5">
                        {userData?.name || session?.user?.name || t('profile.user', locale)} <BsPatchCheckFill className="text-success small" />
                      </h1>
                      <p>{userData?.bio || t('profile.aboutEmpty', locale)}</p>
                    </div>
                    <div className="d-flex mt-3 justify-content-center ms-sm-auto">
                      <Button variant="danger-soft" className="me-2" type="button">
                        {' '}
                        <BsPencilFill size={19} className="pe-1" /> {t('profile.editProfile', locale)}{' '}
                      </Button>
                      <Dropdown>
                        <DropdownToggle
                          as="a"
                          className="icon-md btn btn-light content-none"
                          type="button"
                          id="profileAction2"
                          data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <span>
                            {' '}
                            <BsThreeDots />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end" aria-labelledby="profileAction2">
                          <li>
                            <DropdownItem href="#">
                              {' '}
                              <BsBookmark size={22} className="fa-fw pe-2" />
                              {t('profile.shareProfile', locale)}
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">
                              {' '}
                              <BsFileEarmarkPdf size={22} className="fa-fw pe-2" />
                              {t('profile.savePdf', locale)}
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">
                              {' '}
                              <BsLock size={22} className="fa-fw pe-2" />
                              {t('profile.lockProfile', locale)}
                            </DropdownItem>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <DropdownItem href="#">
                              {' '}
                              <BsGear size={22} className="fa-fw pe-2" />
                              {t('profile.settings', locale)}
                            </DropdownItem>
                          </li>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="card-footer mt-3 pt-2 pb-0">
                  <ul className="nav nav-bottom-line align-items-center justify-content-center justify-content-md-start mb-0 border-0">
                    {PROFILE_MENU_ITEMS.map((item, idx) => (
                      <li className="nav-item" key={idx}>
                        {' '}
                        <Link className={clsx('nav-link', { active: pathName === item.url })} href={item.url ?? ''}>
                          {' '}
                          {labelForItem(item.key, item.label)} {item.badge && <span className="badge bg-success bg-opacity-10 text-success small"> {item.badge.text}</span>}{' '}
                        </Link>{' '}
                      </li>
                    ))}
                  </ul>
                </CardFooter>
              </Card>
              {children}
            </Col>
            <Col lg={4}>
              <Row className="g-4">
                <Col md={6} lg={12}>
                  <Card>
                    <CardHeader className="border-0 pb-0">
                      <CardTitle>{t('profile.aboutTitle', locale)}</CardTitle>
                    </CardHeader>
                    <CardBody className="position-relative pt-0">
                      <p>{userData?.bio || t('profile.aboutEmpty', locale)}</p>
                      {aboutItems.length > 0 && (
                        <ul className="list-unstyled mt-3 mb-0">
                          {aboutItems.map((item) => (
                            <li className="mb-2" key={item.key}>
                              {' '}
                              {item.icon} {t(`profile.about.${item.key}` as any, locale)}: <strong> {item.value} </strong>{' '}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6} lg={12}>
                  <Photos locale={locale} images={myImages} loading={myImagesLoading} />
                </Col>
                {/* <Col md={6} lg={12}>
                  <Friends />
                </Col> */}
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default ProfileLayout
