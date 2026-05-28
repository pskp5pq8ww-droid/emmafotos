import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { UploadProvider } from "@/components/admin/UploadProvider";
import { UploadPanel } from "@/components/admin/UploadPanel";
import { logoutAdmin } from "./actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Dashboard", icon: "Home" },
  { href: "/admin/clients", label: "Clients", icon: "Users" },
  { href: "/admin/galleries", label: "Galleries", icon: "Image" },
  { href: "/admin/reviews", label: "Reviews", icon: "Star" },
  { href: "/admin#new", label: "New gallery", icon: "Plus" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await hasAdminSession())) {
    redirect("/admin-login");
  }

  return (
    <UploadProvider>
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.sidebarLogo} href="/" aria-label="View public site">
          <Image src="/assets/er-logo-black.png" alt="" width={116} height={116} />
        </Link>
        <span className={styles.sidebarLabel}>Dashboard</span>
        <nav className={styles.navList} aria-label="Admin">
          {nav.map((item) => (
            <Link className={styles.navItem} href={item.href} key={item.href}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <Link className={styles.ghostButton} href="/" target="_blank">
            View site
          </Link>
          <form action={logoutAdmin}>
            <button className={styles.logoutButton} type="submit">
              Logout
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.main}>
        <header className={styles.topbar}>
          <p className={styles.breadcrumb}>Emmanuel Rojas Studio</p>
          <p className={styles.breadcrumb}>Local JSON + uploads</p>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
      <UploadPanel />
    </div>
    </UploadProvider>
  );
}
