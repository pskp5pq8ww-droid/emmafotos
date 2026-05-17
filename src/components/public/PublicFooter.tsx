import Image from "next/image";
import Link from "next/link";
import styles from "./Public.module.css";
import { studio } from "@/lib/public-content";

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <p style={{ margin: 0 }}>Emmanuel Rojas Photographer</p>
        <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>Brisbane, Australia · Worldwide</p>
      </div>
      <Link className={styles.footerCenter} href="/" aria-label="Home">
        <Image src="/assets/er-logo-black.png" alt="" width={64} height={64} />
      </Link>
      <div className={styles.footerLinks}>
        <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">
          WhatsApp · {studio.phone}
        </a>
        <a href={studio.instagram} target="_blank" rel="noopener noreferrer">
          Instagram · {studio.instagramHandle}
        </a>
        <a href={`mailto:${studio.email}`}>{studio.email}</a>
      </div>
    </footer>
  );
}
