import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { readInvoices, formatInvoiceNumber } from "@/lib/db/invoices";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { InvoicePdfDownload } from "@/components/admin/InvoicePdfDownload";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import {
  updateInvoiceAction,
  deleteInvoiceAction,
  duplicateInvoiceAction,
  markPaidAction,
  markUnpaidAction,
} from "../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

function fmtCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"   ? styles.badgePaid   :
    status === "unpaid" ? styles.badgeUnpaid :
    status === "sent"   ? styles.badgeSent   :
    styles.badgeDraft;
  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: Props) {
  if (!(await hasAdminSession())) redirect("/admin-login");

  const { id } = await params;
  const db = await readInvoices();
  const invoice = db.invoices.find((inv) => inv.id === id);

  if (!invoice) notFound();

  const nextInvoiceNumber = formatInvoiceNumber(db.nextNumber);

  return (
    <div>
      {/* ── Page header ── */}
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/admin/invoices" style={{ color: "#A1A1AA" }}>Invoices</Link>
            {` / ${invoice.invoiceNumber}`}
          </p>
          <h1 className={styles.title}>{invoice.invoiceNumber}</h1>
          <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
            <StatusBadge status={invoice.status} />
            <span className={styles.muted} style={{ fontSize: 12 }}>
              {invoice.clientName} · {fmtCurrency(invoice.totalDue)} · Due {fmtDate(invoice.dueDate)}
            </span>
          </div>
        </div>

        {/* Action bar */}
        <div className={styles.invoiceActions}>
          <InvoicePdfDownload invoice={invoice} />

          {invoice.status !== "paid" ? (
            <form action={markPaidAction} style={{ display: "contents" }}>
              <input type="hidden" name="id" value={invoice.id} />
              <button type="submit" className={styles.successButton}>
                Mark Paid
              </button>
            </form>
          ) : (
            <form action={markUnpaidAction} style={{ display: "contents" }}>
              <input type="hidden" name="id" value={invoice.id} />
              <button type="submit" className={styles.ghostButton}>
                Mark Unpaid
              </button>
            </form>
          )}

          <form action={duplicateInvoiceAction} style={{ display: "contents" }}>
            <input type="hidden" name="id" value={invoice.id} />
            <button type="submit" className={styles.ghostButton}>
              Duplicate
            </button>
          </form>

          <form action={deleteInvoiceAction} style={{ display: "contents" }}>
            <input type="hidden" name="id" value={invoice.id} />
            <ConfirmSubmitButton
              type="submit"
              className={styles.dangerButton}
              message={`Delete ${invoice.invoiceNumber}? This cannot be undone.`}
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      {/* ── Edit form ── */}
      <div className={styles.panel} style={{ maxWidth: 900 }}>
        <div className={styles.panelPad}>
          <InvoiceForm
            invoice={invoice}
            nextInvoiceNumber={nextInvoiceNumber}
            action={updateInvoiceAction}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
}
