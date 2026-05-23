"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./LogoMark";
import { TransitionLink } from "./TransitionLink";
import styles from "./Public.module.css";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function PublicNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const threshold = isHome ? window.innerHeight * 0.55 : 60;
      setScrolled(y > threshold);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        update();
        if (y < 80) {
          setHidden(false);
        } else if (y > lastY.current + 8) {
          setHidden(true);
        } else if (y < lastY.current - 8) {
          setHidden(false);
        }
        lastY.current = y;
        ticking = false;
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // While the mobile menu is open we keep the nav solid (it covers the hero
  // image with the open panel so the transparent treatment looks wrong).
  const transparent = isHome && !scrolled && !menuOpen;

  const navClass = [
    styles.nav,
    transparent ? styles.navTransparent : styles.navSolid,
    hidden && !menuOpen ? styles.navHidden : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={navClass}>
        <TransitionLink className={styles.brand} href="/" aria-label="Emmanuel Rojas Studio">
          <LogoMark size={44} aria-hidden className={styles.navLogo} />
          <span>Emmanuel Rojas</span>
        </TransitionLink>
        <nav className={styles.navLinks} aria-label="Principal">
          {links.map((link) => (
            <TransitionLink href={link.href} key={link.href}>
              {link.label}
            </TransitionLink>
          ))}
        </nav>
        <div className={styles.navActions}>
          <Link
            className={transparent ? styles.portalLinkGhost : styles.portalLink}
            href="/admin-login"
          >
            Admin
          </Link>
        </div>

        {/* Mobile hamburger — only visible below 900px via CSS */}
        <button
          type="button"
          className={`${styles.navBurger} ${menuOpen ? styles.navBurgerOpen : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile slide-down panel */}
      <div
        id="mobile-nav-panel"
        className={`${styles.navMobilePanel} ${menuOpen ? styles.navMobilePanelOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          {links.map((link) => (
            <TransitionLink
              href={link.href}
              key={link.href}
              className={styles.navMobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </TransitionLink>
          ))}
          <Link
            href="/admin-login"
            className={styles.navMobileAdmin}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </nav>
      </div>
    </>
  );
}
