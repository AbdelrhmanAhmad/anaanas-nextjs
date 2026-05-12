"use client";

import type { ReactNode } from "react";
import { persistPreferredCountryIso2 } from "@/lib/geo/persistPreferredCountry.client";

type Props = {
  href: string;
  iso2: string;
  className?: string;
  hrefLang?: string;
  children: ReactNode;
};

/** Sets preference cookie / localStorage before following the tenant subdomain link. */
export function SelectCountryLink({
  href,
  iso2,
  className,
  hrefLang,
  children,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      hrefLang={hrefLang}
      onMouseDown={() => persistPreferredCountryIso2(iso2)}
    >
      {children}
    </a>
  );
}
