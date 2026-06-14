"use client";

import { useReducer, useTransition, useRef, useState, useEffect } from "react";
import type { Invoice, InvoiceLineItem } from "@/lib/db/invoice-types";
import type { InvoicePdfData } from "@/lib/pdf/invoice-pdf";
import { ClientAutocomplete } from "./ClientAutocomplete";
import styles from "./Admin.module.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function calcItemAmount(qty: number, price: number, disc: number): number {
  const gross = qty * price;
  return Math.round((gross - gross * (disc / 100)) * 100) / 100;
}

function emptyLineItem(): InvoiceLineItem {
  return { id: newId(), description: "", note: "", quantity: 1, unitPrice: 0, discountPercent: 0, amount: 0 };
}

function calcTotals(items: InvoiceLineItem[], gstEnabled: boolean, gstRate: number) {
  const subtotal = Math.round(items.reduce((s, li) => s + li.amount, 0) * 100) / 100;
  const gstAmount = gstEnabled ? Math.round(subtotal * (gstRate / 100) * 100) / 100 : 0;
  const total = Math.round((subtotal + gstAmount) * 100) / 100;
  return { subtotal, gstAmount, total };
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ── State ─────────────────────────────────────────────────────────────────────

type FormState = {
  invoiceNumber: string; status: Invoice["status"];
  issueDate: string; dueDate: string; paymentMethod: string;
  clientName: string; clientEmail: string; clientAddress: string; clientPhone: string;
  lineItems: InvoiceLineItem[];
  gstEnabled: boolean; gstRate: number;
  paymentNotes: string; internalNote: string;
};

type FormAction =
  | { type: "SET"; key: keyof FormState; value: string | boolean | number }
  | { type: "ADD_ITEM" }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_ITEM"; id: string; field: keyof InvoiceLineItem; value: string | number }
  | { type: "FILL_CLIENT"; name: string; email: string; address: string; phone: string };

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET":
      return { ...state, [action.key]: action.value };
    case "ADD_ITEM":
      return { ...state, lineItems: [...state.lineItems, emptyLineItem()] };
    case "REMOVE_ITEM":
      return { ...state, lineItems: state.lineItems.filter((li) => li.id !== action.id) };
    case "UPDATE_ITEM": {
      const lineItems = state.lineItems.map((li) => {
        if (li.id !== action.id) return li;
        const u = { ...li, [action.field]: action.value };
        u.amount = calcItemAmount(Number(u.quantity), Number(u.unitPrice), Number(u.discountPercent));
        return u;
      });
      return { ...state, lineItems };
    }
    case "FILL_CLIENT":
      return { ...state, clientName: action.name, clientEmail: action.email, clientAddress: action.address, clientPhone: action.phone };
  }
}

function buildInitial(invoice: Invoice | null, next: string, today: string): FormState {
  if (invoice) {
    return {
      invoiceNumber: invoice.invoiceNumber, status: invoice.status,
      issueDate: invoice.issueDate, dueDate: invoice.dueDate, paymentMethod: invoice.paymentMethod,
      clientName: invoice.clientName, clientEmail: invoice.clientEmail ?? "",
      clientAddress: invoice.clientAddress ?? "", clientPhone: invoice.clientPhone ?? "",
      lineItems: invoice.lineItems.length > 0 ? invoice.lineItems : [emptyLineItem()],
      gstEnabled: invoice.gstEnabled, gstRate: invoice.gstRate,
      paymentNotes: invoice.paymentNotes ?? "", internalNote: invoice.internalNote ?? "",
    };
  }
  return {
    invoiceNumber: next, status: "draft",
    issueDate: today, dueDate: today, paymentMethod: "Bank Transfer",
    clientName: "", clientEmail: "", clientAddress: "", clientPhone: "",
    lineItems: [emptyLineItem()],
    gstEnabled: true, gstRate: 10,
    paymentNotes: "", internalNote: "",
  };
}

// ── Preview modal ─────────────────────────────────────────────────────────────

const BUSINESS = {
  name: "Emmanuel Rojas Photography",
  address1: "141 Campbell St, 1602",
  address2: "Brisbane QLD 4006, Australia",
  abn: "77 382 893 651",
  phone: "0412 763 107",
  email: "emmanuel@photographeraustralia.com",
};

function PreviewModal({ data, onClose }: { data: InvoicePdfData; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleDownload() {
    const { downloadInvoicePdf } = await import("@/lib/pdf/invoice-pdf");
    await downloadInvoicePdf(data);
  }

  return (
    <div className={styles.previewOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Toolbar */}
      <div className={styles.previewToolbar}>
        <button
          type="button"
          onClick={handleDownload}
          style={{
            minHeight: 36, display: "inline-flex", alignItems: "center", gap: 6,
            border: "1px solid rgba(200,169,110,0.3)", borderRadius: 100,
            background: "rgba(80,55,20,0.5)", color: "#E8C878",
            letterSpacing: "0.12em", fontSize: 10, textTransform: "uppercase",
            paddingInline: 16, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ↓ Download PDF
        </button>
        <button type="button" className={styles.previewCloseBtn} onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* White A4 document */}
      <div className={styles.previewDocument}>
        {/* Header: ER monogram left, business right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#111", letterSpacing: -1 }}>ER</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className={styles.previewBizName}>{BUSINESS.name}</p>
            <p className={styles.previewBizDetail}>
              {BUSINESS.address1}<br />{BUSINESS.address2}<br />
              ABN: {BUSINESS.abn}<br />
              Phone: {BUSINESS.phone}<br />
              {BUSINESS.email}
            </p>
          </div>
        </div>

        <hr className={styles.previewRule} />

        {/* Invoice heading + two-column */}
        <h1 className={styles.previewInvoiceTitle}>INVOICE</h1>
        <p className={styles.previewInvoiceNum}>{data.invoiceNumber}</p>

        <div className={styles.previewTwoCol} style={{ marginTop: 20 }}>
          {/* Bill To */}
          <div>
            <p className={styles.previewBillLabel}>Bill To</p>
            <p className={styles.previewBillName}>{data.clientName || "—"}</p>
            <p className={styles.previewBillDetail}>
              {[data.clientEmail, data.clientAddress, data.clientPhone].filter(Boolean).join("\n")}
            </p>
          </div>

          {/* Metadata */}
          <div>
            <table className={styles.previewMetaTable}>
              <tbody>
                {[
                  ["Invoice No.", data.invoiceNumber],
                  ["Issue Date", fmtDate(data.issueDate)],
                  ["Due Date", fmtDate(data.dueDate)],
                  ["Payment", data.paymentMethod || "—"],
                ].map(([label, val]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <hr className={styles.previewRule} />

        {/* Line items */}
        <table className={styles.previewItemsTable}>
          <thead>
            <tr>
              <th style={{ width: "44%" }}>Description</th>
              <th style={{ width: "10%" }}>Qty</th>
              <th style={{ width: "16%" }}>Unit Price</th>
              <th style={{ width: "12%" }}>Disc %</th>
              <th style={{ width: "18%" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item) => (
              <tr key={item.description + item.amount}>
                <td>
                  {item.description}
                  {item.note && <div className={styles.previewItemNote}>{item.note}</div>}
                </td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>{item.discountPercent}%</td>
                <td>${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className={styles.previewTotalsSection}>
          <div className={styles.previewTotalsGrid}>
            <div className={styles.previewTotalsRow}>
              <span>Subtotal</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            {data.gstEnabled && (
              <div className={styles.previewTotalsRow}>
                <span>GST {data.gstRate}%</span>
                <span>${data.gstAmount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.previewTotalsRow}>
              <span>Total AUD</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
            <div className={styles.previewTotalsRowFinal}>
              <span>Total Due AUD</span>
              <span>${data.totalDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment notes */}
        {data.paymentNotes && (
          <div className={styles.previewPaymentNotes}>
            <p className={styles.previewPaymentNotesLabel}>Payment Notes</p>
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{data.paymentNotes}</p>
          </div>
        )}

        {/* Signature */}
        <div className={styles.previewSignatureLine}>
          <hr className={styles.previewSignatureRule} />
          <p className={styles.previewSignatureLabel}>Issued by, signature:</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  invoice?: Invoice | null;
  nextInvoiceNumber: string;
  action: (formData: FormData) => Promise<void>;
  mode: "create" | "edit";
};

export function InvoiceForm({ invoice = null, nextInvoiceNumber, action, mode }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [state, dispatch] = useReducer(reducer, buildInitial(invoice, nextInvoiceNumber, today));
  const [pending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { subtotal, gstAmount, total } = calcTotals(state.lineItems, state.gstEnabled, state.gstRate);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  function buildPreviewData(): InvoicePdfData {
    return {
      invoiceNumber: state.invoiceNumber || nextInvoiceNumber,
      issueDate: state.issueDate,
      dueDate: state.dueDate,
      paymentMethod: state.paymentMethod,
      clientName: state.clientName,
      clientEmail: state.clientEmail || undefined,
      clientAddress: state.clientAddress || undefined,
      clientPhone: state.clientPhone || undefined,
      lineItems: state.lineItems,
      subtotal,
      gstEnabled: state.gstEnabled,
      gstRate: state.gstRate,
      gstAmount,
      total,
      totalDue: total,
      paymentNotes: state.paymentNotes || undefined,
    };
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        {invoice && <input type="hidden" name="id" value={invoice.id} />}

        {/* ── Invoice metadata ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="invoiceNumber">Invoice No.</label>
            <input
              id="invoiceNumber" name="invoiceNumber"
              value={state.invoiceNumber}
              onChange={(e) => dispatch({ type: "SET", key: "invoiceNumber", value: e.target.value })}
              placeholder={nextInvoiceNumber}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="status">Status</label>
            <select id="status" name="status" value={state.status}
              onChange={(e) => dispatch({ type: "SET", key: "status", value: e.target.value as Invoice["status"] })}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="paymentMethod">Payment Method</label>
            <input id="paymentMethod" name="paymentMethod" value={state.paymentMethod}
              onChange={(e) => dispatch({ type: "SET", key: "paymentMethod", value: e.target.value })}
              placeholder="Bank Transfer"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="issueDate">Issue Date</label>
            <input id="issueDate" name="issueDate" type="date" value={state.issueDate}
              onChange={(e) => dispatch({ type: "SET", key: "issueDate", value: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="dueDate">Due Date</label>
            <input id="dueDate" name="dueDate" type="date" value={state.dueDate}
              onChange={(e) => dispatch({ type: "SET", key: "dueDate", value: e.target.value })} />
          </div>
        </div>

        <hr className={styles.divider} />

        {/* ── Bill To ── */}
        <h3 style={{ margin: "4px 0 8px", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A1A1AA" }}>
          Bill To
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientName">Client Name *</label>
            <ClientAutocomplete
              id="clientName"
              name="clientName"
              value={state.clientName}
              required
              placeholder="Full name or company"
              onChange={(v) => dispatch({ type: "SET", key: "clientName", value: v })}
              onSelect={(c) =>
                dispatch({
                  type: "FILL_CLIENT",
                  name: c.name,
                  email: c.email ?? "",
                  address: c.address ?? "",
                  phone: c.phone ?? "",
                })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientEmail">Email</label>
            <input id="clientEmail" name="clientEmail" type="email" value={state.clientEmail}
              onChange={(e) => dispatch({ type: "SET", key: "clientEmail", value: e.target.value })}
              placeholder="client@example.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientAddress">Address</label>
            <input id="clientAddress" name="clientAddress" value={state.clientAddress}
              onChange={(e) => dispatch({ type: "SET", key: "clientAddress", value: e.target.value })}
              placeholder="Street, City, State, Postcode"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientPhone">Phone</label>
            <input id="clientPhone" name="clientPhone" value={state.clientPhone}
              onChange={(e) => dispatch({ type: "SET", key: "clientPhone", value: e.target.value })}
              placeholder="04xx xxx xxx"
            />
          </div>
        </div>

        <hr className={styles.divider} />

        {/* ── Line Items ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A1A1AA" }}>
            Line Items
          </h3>
          <button type="button" className={styles.ghostButton}
            style={{ minHeight: 32, fontSize: 10, paddingInline: 14 }}
            onClick={() => dispatch({ type: "ADD_ITEM" })}>
            + Add Item
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.lineItemsTable}>
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Description / Note</th>
                <th style={{ width: "8%" }}>Qty</th>
                <th style={{ width: "13%" }}>Unit Price ($)</th>
                <th style={{ width: "10%" }}>Disc %</th>
                <th style={{ width: "13%" }}>Amount ($)</th>
                <th style={{ width: "6%" }}></th>
              </tr>
            </thead>
            <tbody>
              {state.lineItems.map((item, i) => (
                <tr key={item.id}>
                  <input type="hidden" name="li_id" value={item.id} />
                  <td style={{ paddingRight: 8 }}>
                    <input type="text" name="li_description" value={item.description}
                      onChange={(e) => dispatch({ type: "UPDATE_ITEM", id: item.id, field: "description", value: e.target.value })}
                      placeholder="Description" required />
                    <input type="text" name="li_note" value={item.note ?? ""}
                      onChange={(e) => dispatch({ type: "UPDATE_ITEM", id: item.id, field: "note", value: e.target.value })}
                      placeholder="Note (optional)" style={{ marginTop: 4, fontSize: 11 }} />
                  </td>
                  <td>
                    <input type="number" name="li_quantity" min="0" step="0.01" value={item.quantity}
                      onChange={(e) => dispatch({ type: "UPDATE_ITEM", id: item.id, field: "quantity", value: parseFloat(e.target.value) || 0 })} />
                  </td>
                  <td>
                    <input type="number" name="li_unitPrice" min="0" step="0.01" value={item.unitPrice}
                      onChange={(e) => dispatch({ type: "UPDATE_ITEM", id: item.id, field: "unitPrice", value: parseFloat(e.target.value) || 0 })} />
                  </td>
                  <td>
                    <input type="number" name="li_discount" min="0" max="100" step="0.01" value={item.discountPercent}
                      onChange={(e) => dispatch({ type: "UPDATE_ITEM", id: item.id, field: "discountPercent", value: parseFloat(e.target.value) || 0 })} />
                  </td>
                  <td>
                    <input type="number" name="li_amount" value={item.amount.toFixed(2)} readOnly tabIndex={-1} />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button type="button" title="Remove item"
                      onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                      style={{
                        width: 28, height: 28,
                        border: "1px solid rgba(180,50,50,0.3)", borderRadius: "50%",
                        background: "rgba(80,10,10,0.5)", color: "#FFC8C8",
                        cursor: "pointer", fontSize: 13, lineHeight: 1,
                        display: i === 0 && state.lineItems.length === 1 ? "none" : "inline-flex",
                        alignItems: "center", justifyContent: "center",
                      }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Totals ── */}
        <div className={styles.totalsBox} style={{ borderRadius: 8 }}>
          <div className={styles.totalsRow}>
            <span>Subtotal</span>
            <span className={styles.totalsAmount}>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.totalsRow} style={{ alignItems: "flex-start", gap: 12 }}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="gstEnabled" checked={state.gstEnabled}
                onChange={(e) => dispatch({ type: "SET", key: "gstEnabled", value: e.target.checked })} />
              GST
            </label>
            {state.gstEnabled && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="number" name="gstRate" min="0" max="100" step="0.5" value={state.gstRate}
                  onChange={(e) => dispatch({ type: "SET", key: "gstRate", value: parseFloat(e.target.value) || 10 })}
                  style={{ width: 56, minHeight: 30, border: "1px solid rgba(255,255,255,0.1)", background: "#111113", color: "#F5F5F5", padding: "0 8px", borderRadius: 4, fontSize: 13 }} />
                <span style={{ color: "#A1A1AA", fontSize: 12 }}>%</span>
                <span className={styles.totalsAmount}>${gstAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className={`${styles.totalsRow} ${styles.totalsRowTotal}`}>
            <span>Total AUD</span>
            <span className={styles.totalsAmount}>${total.toFixed(2)}</span>
          </div>
          <div className={styles.totalsRow} style={{ color: "#F5F5F5", fontWeight: 600 }}>
            <span>Total Due AUD</span>
            <span className={styles.totalsAmount}>${total.toFixed(2)}</span>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* ── Notes ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="paymentNotes">Payment Notes (shown on PDF)</label>
            <textarea id="paymentNotes" name="paymentNotes" value={state.paymentNotes}
              onChange={(e) => dispatch({ type: "SET", key: "paymentNotes", value: e.target.value })}
              placeholder="Bank details, payment instructions…" style={{ minHeight: 80 }} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="internalNote">
              Internal Note <span style={{ color: "#5A5A62" }}>(not on PDF)</span>
            </label>
            <textarea id="internalNote" name="internalNote" value={state.internalNote}
              onChange={(e) => dispatch({ type: "SET", key: "internalNote", value: e.target.value })}
              placeholder="Private admin notes…" style={{ minHeight: 80 }} />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className={styles.invoiceActions}>
          <button type="submit" className={styles.primaryButton} disabled={pending}>
            {pending ? "Saving…" : mode === "create" ? "Create Invoice" : "Save Changes"}
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={async () => {
              const { downloadInvoicePdf } = await import("@/lib/pdf/invoice-pdf");
              await downloadInvoicePdf(buildPreviewData());
            }}
          >
            ↓ Download PDF
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>
      </form>

      {/* Preview modal — rendered outside form to avoid nesting issues */}
      {showPreview && (
        <PreviewModal data={buildPreviewData()} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
