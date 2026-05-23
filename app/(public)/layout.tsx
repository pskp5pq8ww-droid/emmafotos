import { PageTransition } from "@/components/public/PageTransition";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNav } from "@/components/public/PublicNav";
import styles from "@/components/public/Public.module.css";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageTransition>
      <div className={styles.shell}>
        <PublicNav />
        {children}
        <PublicFooter />
      </div>
    </PageTransition>
  );
}
