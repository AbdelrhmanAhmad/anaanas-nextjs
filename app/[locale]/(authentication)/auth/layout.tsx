import type { ChildrenType } from '@/types/component'
import Link from 'next/link'
import { headers } from 'next/headers'
import { Col, Container, Row } from 'react-bootstrap'
import AuthLanguageSwitch from '@/components/auth/AuthLanguageSwitch'
import { FaFacebookSquare, FaTwitterSquare, FaYoutubeSquare } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa6'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const AuthLayout = async ({ children }: ChildrenType) => {
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-locale')
  const locale: SupportedLocale = (localeFromHeader && isSupportedLocale(localeFromHeader)) ? localeFromHeader : DEFAULT_LOCALE
  return (
    <>
      <main className="auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
              <AuthLanguageSwitch />
              <div className="auth-split">{children}</div>
            </Col>
          </Row>
        </Container>
      </main>

      <footer className="auth-footer">
        <Container>
          <Row className="justify-content-center">
            <Col sm={10} md={8} lg={6}>
              <div className="auth-footer-inner">
                <ul className="auth-footer-links">
                  <li><Link href="#">{t('auth.terms', locale)}</Link></li>
                  <li><Link href="#">{t('auth.privacy', locale)}</Link></li>
                  <li><Link href="#">{t('auth.cookies', locale)}</Link></li>
                </ul>
                <ul className="auth-footer-social">
                  <li><Link href="#"><FaFacebookSquare /></Link></li>
                  <li><Link href="#"><FaTwitterSquare /></Link></li>
                  <li><Link href="#"><FaLinkedin /></Link></li>
                  <li><Link href="#"><FaYoutubeSquare /></Link></li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}
export default AuthLayout
