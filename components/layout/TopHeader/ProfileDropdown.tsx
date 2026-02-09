"use client";
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Image from "next/image";
import {
  BsCardText,
  BsCircleHalf,
  BsGear,
  BsLifePreserver,
  BsMoonStars,
  BsPower,
  BsSun,
} from "react-icons/bs";
import type { IconType } from "react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ThemeType } from "@/types/context";

import avatar7 from "@/assets/images/avatar/07.jpg";
import { toSentenceCase } from "@/utils/change-casing";
import { useLayoutContext } from "@/context/useLayoutContext";
import clsx from "clsx";
import { developedByLink } from "@/context/constants";
import Link from "next/link";
import type { SupportedLocale } from "@/lib/localization";

type ThemeModeType = {
  theme: ThemeType;
  icon: IconType;
};

const ProfileDropdown = ({ locale = 'ar' }: { locale?: SupportedLocale }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const translations = {
    ar: {
      login: 'تسجيل الدخول',
      user: 'مستخدم',
      mode: 'الوضع:',
      signingOut: 'جاري تسجيل الخروج...',
      signOut: 'تسجيل الخروج',
      viewProfile: 'عرض الملف الشخصي',
      settings: 'الإعدادات والخصوصية',
      support: 'الدعم',
      documentation: 'التوثيق',
    },
    en: {
      login: 'Login',
      user: 'User',
      mode: 'Mode:',
      signingOut: 'Signing out...',
      signOut: 'Sign Out',
      viewProfile: 'View profile',
      settings: 'Settings & Privacy',
      support: 'Support',
      documentation: 'Documentation',
    },
  };
  
  const t = translations[locale] || translations.ar;

  const themeModes: ThemeModeType[] = [
    {
      icon: BsSun,
      theme: "light",
    },
    {
      icon: BsMoonStars,
      theme: "dark",
    },
    {
      icon: BsCircleHalf,
      theme: "auto",
    },
  ];

  const { theme: themeMode, updateTheme } = useLayoutContext();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Sign out from NextAuth on client side
      const { signOut: nextAuthSignOut } = await import('next-auth/react');
      await nextAuthSignOut({ redirect: false });
      router.push(`/${locale}/auth/sign-in`);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Show login button if not authenticated
  if (status === 'unauthenticated') {
    return (
      <li className="nav-item ms-2">
        <Link className="nav-link btn btn-primary btn-sm" href={`/${locale}/auth/sign-in`}>
          {t.login}
        </Link>
      </li>
    );
  }

  if (status === 'loading') {
    return null;
  }

  return (
    <Dropdown as="li" className="nav-item ms-2" drop="down" align="end">
      <DropdownToggle
        className="nav-link btn icon-md p-0 content-none"
        role="button"
        data-bs-auto-close="outside"
        data-bs-display="static"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Image className="avatar-img rounded-2" src={avatar7} alt="avatar" />
      </DropdownToggle>
      <DropdownMenu
        className="dropdown-animation dropdown-menu-end pt-3 small me-md-n3"
        aria-labelledby="profileDropdown"
      >
        <div className="d-flex align-items-center gap-2 position-relative px-3 blackText">
          <div className="avatar me-3">
            <Image
              className="avatar-img rounded-circle"
              src={avatar7}
              alt="avatar"
            />
          </div>
          <div className="text-start ">
            <Link className="h6 stretched-link" href={`/${locale}/profile/feed`}>
          
              {session?.user?.name || session?.user?.email || t.user}
            </Link>
            <p className="small m-0">{session?.user?.email || session?.user?.mobile || ''}</p>
          </div>
        </div>





        {/* <DropdownItem
          className="btn btn-primary-soft btn-sm my-2 text-center"
          href="/profile/feed"
        >
          View profile
        </DropdownItem>
        <DropdownItem href="/settings/account">
          <BsGear className="fa-fw me-2" />
          Settings &amp; Privacy
        </DropdownItem>
        <DropdownItem href={developedByLink} rel="noreferrer" target="_blank">
          <BsLifePreserver className="fa-fw me-2" />
          Support
        </DropdownItem>
        <DropdownItem href="#" target="_blank" rel="noreferrer">
          <BsCardText className="fa-fw me-2" />
          Documentation
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          className="bg-danger-soft-hover"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <BsPower className="fa-fw me-2" />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </DropdownItem>{" "} */}
        <DropdownDivider />
        <div className="modeswitch-item theme-icon-active d-flex justify-content-center gap-3 align-items-center p-2 pb-0">
          <span>{t.mode}</span>

          {themeModes.map(({ icon: Icon, theme }, idx) => {
            const themeLabels = {
              ar: { light: 'فاتح', dark: 'داكن', auto: 'تلقائي' },
              en: { light: 'Light', dark: 'Dark', auto: 'Auto' },
            };
            const themeLabel = themeLabels[locale]?.[theme] || toSentenceCase(theme);
            
            return (
              <OverlayTrigger
                key={theme + idx}
                overlay={<Tooltip>{themeLabel}</Tooltip>}
              >
                <button
                  type="button"
                  className={clsx(
                    "btn btn-modeswitch nav-link text-primary-hover mb-0",
                    { active: theme === themeMode }
                  )}
                  onClick={() => updateTheme(theme)}
                >
                  <Icon />
                </button>
              </OverlayTrigger>
            );
          })}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
