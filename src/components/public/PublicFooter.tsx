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
      <span className={styles.footerLinks}>
        <a href="https://wa.me/61412763107" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="https://www.instagram.com/emmanuel_r0jas_/" target="_blank" rel="noopener noreferrer">@emmanuel_r0jas_</a>
        <a href="mailto:emmanuelrojas-23@hotmail.com">Email</a>
      </span>
    </footer>
  );
}
