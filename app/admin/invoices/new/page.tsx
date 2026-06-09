import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { readInvoices, formatInvoiceNumber } from "@/lib/db/invoices";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { createInvoiceAction } from "../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  if (!(await hasAdminSession())) redirect("/admin-login");

  const db = await readInvoices();
  const nextInvoiceNumber = formatInvoiceNumber(db.nextNumber);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/admin/invoices" style={{ color: "#A1A1AA" }}>Invoices</Link>
            {" / New"}
          </p>
          <h1 className={styles.title}>New Invoice</h1>
        </div>
      </div>

      <div className={styles.panel} style={{ maxWidth: 900 }}>
        <div className={styles.panelPad}>
          <InvoiceForm
            nextInvoiceNumber={nextInvoiceNumber}
            action={createInvoiceAction}
            mode="create"
          />
        </div>
      </div>
    </div>
  );
}
