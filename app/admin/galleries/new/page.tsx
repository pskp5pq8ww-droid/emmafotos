import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { GalleryCreateTabs } from "@/components/admin/GalleryCreateTabs";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewGalleryPage() {
  if (!(await hasAdminSession())) redirect("/admin-login");

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/admin/galleries" style={{ color: "#A1A1AA" }}>Galleries</Link>
            {" / New"}
          </p>
          <h1 className={styles.title}>Create Gallery</h1>
        </div>
      </div>

      <GalleryCreateTabs />
    </div>
  );
}
