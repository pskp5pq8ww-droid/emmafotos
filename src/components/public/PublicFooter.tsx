import Image from "next/image";
import Link from "next/link";
import styles from "./Public.module.css";

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <span>Emmanuel Rojas Studio</span>
      <Link className={styles.footerCenter} href="/" aria-label="Inicio">
        <Image src="/assets/er-logo-black.png" alt="" width={64} height={64} />
      </Link>
      <span>Miami, FL · Worldwide</span>
    </footer>
  );
}
