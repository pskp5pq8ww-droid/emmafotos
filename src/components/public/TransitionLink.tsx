"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useTransitionNav } from "./PageTransition";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Pick<LinkProps, "href" | "prefetch" | "replace" | "scroll"> & {
    children: ReactNode;
  };

/**
 * Drop-in replacement for next/link that plays the cinematic
 * PageTransition before navigating. External links / new-tab / modified
 * clicks fall back to normal Link behaviour.
 */
export function TransitionLink({
  href,
  children,
  onClick,
  prefetch,
  replace,
  scroll,
  ...rest
}: Props) {
  const { navigate } = useTransitionNav();
  const pathname = usePathname();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let modifier-clicks (cmd/ctrl/shift/middle), external links and same-page links fall through
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      (rest as { target?: string }).target === "_blank" ||
      hrefStr.startsWith("http") ||
      hrefStr.startsWith("mailto:") ||
      hrefStr.startsWith("tel:") ||
      hrefStr === pathname ||
      hrefStr === ""
    ) {
      return;
    }
    e.preventDefault();
    navigate(hrefStr);
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
}
