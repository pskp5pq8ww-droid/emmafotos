import Image from "next/image";
import { LoginForm } from "./login-form";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className={styles.loginShell}>
      <section className={styles.loginPanel}>
        <Image
          src="/assets/er-logo-black.png"
          alt="ER"
          width={86}
          height={86}
          priority
        />
        <p className={styles.eyebrow}>Emmanuel Rojas Studio</p>
        <h1 className={styles.title}>Private admin access.</h1>
        <LoginForm />
      </section>
      <section className={styles.loginArt}>
        <Image
          src="/assets/studio-hero.png"
          alt="Studio desk"
          fill
          sizes="50vw"
          priority
        />
      </section>
    </main>
  );
}
