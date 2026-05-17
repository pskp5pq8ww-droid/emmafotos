"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Public.module.css";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function PublicNav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
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

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${hidden ? styles.navHidden : ""}`}>
      <Link className={styles.brand} href="/" aria-label="Emmanuel Rojas Studio">
        <Image
          src="/assets/er-logo-black.png"
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
        <Link className={styles.portalLink} href="/admin-login">
          Admin
        </Link>
      </div>
    </header>
  );
}
