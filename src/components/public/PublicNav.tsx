import Image from "next/image";
import Link from "next/link";
import styles from "./Public.module.css";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function PublicNav() {
  return (
    <header className={styles.nav}>
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
          Acceso Admin
        </Link>
      </div>
    </header>
  );
}
