import { AgentChat } from "@/components/admin/AgentChat";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assistant",
  robots: { index: false, follow: false },
};

// Session gate lives in app/admin/layout.tsx (redirects to /admin-login),
// and the API route re-checks the session on every message.
export default function AgentPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Studio AI</p>
          <h1 className={styles.title}>Assistant</h1>
        </div>
      </div>
      <div style={{ maxWidth: 860 }}>
        <AgentChat />
      </div>
    </div>
  );
}
