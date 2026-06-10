"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Public.module.css";
import { studio } from "@/lib/public-content";

export function PublicFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className={`${styles.footer} ${isHome ? styles.footerDark : ""}`}>
      <div>
        <p className={styles.footerName}>Emmanuel Rojas Photographer</p>
        <p className={styles.footerSub}>Brisbane, Australia · Worldwide</p>
      </div>
      <Link className={styles.footerCenter} href="/" aria-label="Home">
        <Image
          src={isHome ? "/assets/er-logo-white.png" : "/assets/er-logo-black.png"}
          alt=""
          width={64}
          height={64}
        />
      </Link>
      <div className={styles.footerLinks}>
        <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">
          WhatsApp · {studio.phone}
        </a>
        <a href={studio.instagram} target="_blank" rel="noopener noreferrer">
          Instagram · {studio.instagramHandle}
        </a>
        <span>Email · soon</span>
      </div>
    </footer>
  );
}
