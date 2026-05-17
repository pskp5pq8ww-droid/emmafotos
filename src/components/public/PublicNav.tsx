"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      const y = window.scrollY;
      // Switch to solid once user scrolls past ~55% of viewport on homepage,
      // or past 60px on any other page.
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

    // Evaluate on mount so SSR-hydration matches real scroll state
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  const navClass = [
    styles.nav,
    transparent ? styles.navTransparent : styles.navSolid,
    hidden ? styles.navHidden : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={navClass}>
      <Link className={styles.brand} href="/" aria-label="Emmanuel Rojas Studio">
        <Image
          src={transparent ? "/assets/er-logo-white.png" : "/assets/er-logo-black.png"}
          alt=""
          width={88}
          height={88}
          priority
        />
        <span>Emmanuel Rojas</span>
      </Link>
      <nav className={styles.navLinks} aria-label="Principal">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
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
    </header>
  );
}
