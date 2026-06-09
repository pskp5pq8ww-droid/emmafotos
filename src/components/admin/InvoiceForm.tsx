"use client";

import { useReducer, useTransition, useRef } from "react";
import type { Invoice, InvoiceLineItem } from "@/lib/db/invoice-types";
import styles from "./Admin.module.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function newLineItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function calcItemAmount(qty: number, price: number, disc: number): number {
  const gross = qty * price;
  return Math.round((gross - gross * (disc / 100)) * 100) / 100;
}

function emptyLineItem(): InvoiceLineItem {
  return {
    id: newLineItemId(),
    description: "",
    note: "",
    quantity: 1,
    unitPrice: 0,
    discountPercent: 0,
    amount: 0,
  };
}

function calcTotals(
  lineItems: InvoiceLineItem[],
  gstEnabled: boolean,
  gstRate: number,
) {
  const subtotal = Math.round(lineItems.reduce((s, li) => s + li.amount, 0) * 100) / 100;
  const gstAmount = gstEnabled ? Math.round(subtotal * (gstRate / 100) * 100) / 100 : 0;
  const total = Math.round((subtotal + gstAmount) * 100) / 100;
  return { subtotal, gstAmount, total };
}

// ── State types ───────────────────────────────────────────────────────────────

type FormState = {
  invoiceNumber: string;
  status: Invoice["status"];
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  lineItems: InvoiceLineItem[];
  gstEnabled: boolean;
  gstRate: number;
  paymentNotes: string;
  internalNote: string;
};

type FormAction =
  | { type: "SET_FIELD"; key: keyof FormState; value: string | boolean | number }
  | { type: "ADD_LINE_ITEM" }
  | { type: "REMOVE_LINE_ITEM"; id: string }
  | { type: "UPDATE_LINE_ITEM"; id: string; field: keyof InvoiceLineItem; value: string | number }
  | { type: "MOVE_LINE_ITEM"; id: string; dir: -1 | 1 };

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.key]: action.value };

    case "ADD_LINE_ITEM":
      return { ...state, lineItems: [...state.lineItems, emptyLineItem()] };

    case "REMOVE_LINE_ITEM":
      return {
        ...state,
        lineItems: state.lineItems.filter((li) => li.id !== action.id),
      };

    case "UPDATE_LINE_ITEM": {
      const lineItems = state.lineItems.map((li) => {
        if (li.id !== action.id) return li;
        const updated = { ...li, [action.field]: action.value };
        updated.amount = calcItemAmount(
          Number(updated.quantity),
          Number(updated.unitPrice),
          Number(updated.discountPercent),
        );
        return updated;
      });
      return { ...state, lineItems };
    }

    case "MOVE_LINE_ITEM": {
      const idx = state.lineItems.findIndex((li) => li.id === action.id);
      const newIdx = idx + action.dir;
      if (newIdx < 0 || newIdx >= state.lineItems.length) return state;
      const items = [...state.lineItems];
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
      return { ...state, lineItems: items };
    }
  }
}

function buildInitialState(
  invoice: Invoice | null,
  nextInvoiceNumber: string,
  today: string,
): FormState {
  if (invoice) {
    return {
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paymentMethod: invoice.paymentMethod,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail ?? "",
      clientAddress: invoice.clientAddress ?? "",
      clientPhone: invoice.clientPhone ?? "",
      lineItems: invoice.lineItems.length > 0
        ? invoice.lineItems
        : [emptyLineItem()],
      gstEnabled: invoice.gstEnabled,
      gstRate: invoice.gstRate,
      paymentNotes: invoice.paymentNotes ?? "",
      internalNote: invoice.internalNote ?? "",
    };
  }
  return {
    invoiceNumber: nextInvoiceNumber,
    status: "draft",
    issueDate: today,
    dueDate: today,
    paymentMethod: "Bank Transfer",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    lineItems: [emptyLineItem()],
    gstEnabled: true,
    gstRate: 10,
    paymentNotes: "",
    internalNote: "",
  };
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  invoice?: Invoice | null;
  nextInvoiceNumber: string;
  /** Server action — receives FormData */
  action: (formData: FormData) => Promise<void>;
  mode: "create" | "edit";
};

// ── Component ─────────────────────────────────────────────────────────────────

export function InvoiceForm({ invoice = null, nextInvoiceNumber, action, mode }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [state, dispatch] = useReducer(
    reducer,
    buildInitialState(invoice, nextInvoiceNumber, today),
  );
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const { subtotal, gstAmount, total } = calcTotals(
    state.lineItems,
    state.gstEnabled,
    state.gstRate,
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      {invoice && <input type="hidden" name="id" value={invoice.id} />}

      {/* ── Section: Invoice metadata ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="invoiceNumber">Invoice No.</label>
          <input
            id="invoiceNumber"
            name="invoiceNumber"
            value={state.invoiceNumber}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "invoiceNumber", value: e.target.value })}
            placeholder={nextInvoiceNumber}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={state.status}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "status", value: e.target.value as Invoice["status"] })}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="paymentMethod">Payment Method</label>
          <input
            id="paymentMethod"
            name="paymentMethod"
            value={state.paymentMethod}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "paymentMethod", value: e.target.value })}
            placeholder="Bank Transfer"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="issueDate">Issue Date</label>
          <input
            id="issueDate"
            name="issueDate"
            type="date"
            value={state.issueDate}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "issueDate", value: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={state.dueDate}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "dueDate", value: e.target.value })}
          />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Section: Client (Bill To) ─────────────────────────────────── */}
      <h3 style={{ margin: "4px 0 8px", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A1A1AA" }}>Bill To</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="clientName">Client Name *</label>
          <input
            id="clientName"
            name="clientName"
            required
            value={state.clientName}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "clientName", value: e.target.value })}
            placeholder="Full name or company"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="clientEmail">Email</label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={state.clientEmail}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "clientEmail", value: e.target.value })}
            placeholder="client@example.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="clientAddress">Address</label>
          <input
            id="clientAddress"
            name="clientAddress"
            value={state.clientAddress}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "clientAddress", value: e.target.value })}
            placeholder="Street, City, State, Postcode"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="clientPhone">Phone</label>
          <input
            id="clientPhone"
            name="clientPhone"
            value={state.clientPhone}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "clientPhone", value: e.target.value })}
            placeholder="04xx xxx xxx"
          />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Section: Line Items ───────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A1A1AA" }}>
          Line Items
        </h3>
        <button
          type="button"
          className={styles.ghostButton}
          style={{ minHeight: 32, fontSize: 10, paddingInline: 14 }}
          onClick={() => dispatch({ type: "ADD_LINE_ITEM" })}
        >
          + Add Item
        </button>
      </div>

      {/* Hidden arrays for line item IDs */}
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
                {/* Hidden fields */}
                <input type="hidden" name="li_id" value={item.id} />

                <td style={{ paddingRight: 8 }}>
                  <input
                    type="text"
                    name="li_description"
                    value={item.description}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_LINE_ITEM", id: item.id, field: "description", value: e.target.value })
                    }
                    placeholder="Description"
                    required
                  />
                  <input
                    type="text"
                    name="li_note"
                    value={item.note ?? ""}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_LINE_ITEM", id: item.id, field: "note", value: e.target.value })
                    }
                    placeholder="Note (optional)"
                    style={{ marginTop: 4, fontSize: 11 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="li_quantity"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_LINE_ITEM", id: item.id, field: "quantity", value: parseFloat(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="li_unitPrice"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_LINE_ITEM", id: item.id, field: "unitPrice", value: parseFloat(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="li_discount"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.discountPercent}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_LINE_ITEM", id: item.id, field: "discountPercent", value: parseFloat(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="li_amount"
                    value={item.amount.toFixed(2)}
                    readOnly
                    tabIndex={-1}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    title="Remove item"
                    onClick={() => dispatch({ type: "REMOVE_LINE_ITEM", id: item.id })}
                    style={{
                      width: 28,
                      height: 28,
                      border: "1px solid rgba(180,50,50,0.3)",
                      borderRadius: "50%",
                      background: "rgba(80,10,10,0.5)",
                      color: "#FFC8C8",
                      cursor: "pointer",
                      fontSize: 13,
                      lineHeight: 1,
                      display: i === 0 && state.lineItems.length === 1 ? "none" : "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ─────────────────────────────────────────────────────── */}
      <div className={styles.totalsBox} style={{ borderRadius: 8 }}>
        <div className={styles.totalsRow}>
          <span>Subtotal</span>
          <span className={styles.totalsAmount}>${subtotal.toFixed(2)}</span>
        </div>

        {/* GST toggle */}
        <div className={styles.totalsRow} style={{ alignItems: "flex-start", gap: 12 }}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="gstEnabled"
              checked={state.gstEnabled}
              onChange={(e) => dispatch({ type: "SET_FIELD", key: "gstEnabled", value: e.target.checked })}
            />
            GST
          </label>
          {state.gstEnabled && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                name="gstRate"
                min="0"
                max="100"
                step="0.5"
                value={state.gstRate}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", key: "gstRate", value: parseFloat(e.target.value) || 10 })
                }
                style={{
                  width: 56,
                  minHeight: 30,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#111113",
                  color: "#F5F5F5",
                  padding: "0 8px",
                  borderRadius: 4,
                  fontSize: 13,
                }}
              />
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

      {/* ── Notes ─────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="paymentNotes">Payment Notes (shown on PDF)</label>
          <textarea
            id="paymentNotes"
            name="paymentNotes"
            value={state.paymentNotes}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "paymentNotes", value: e.target.value })}
            placeholder="Bank details, payment instructions…"
            style={{ minHeight: 80 }}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="internalNote">
            Internal Note <span style={{ color: "#5A5A62" }}>(not on PDF)</span>
          </label>
          <textarea
            id="internalNote"
            name="internalNote"
            value={state.internalNote}
            onChange={(e) => dispatch({ type: "SET_FIELD", key: "internalNote", value: e.target.value })}
            placeholder="Private admin notes…"
            style={{ minHeight: 80 }}
          />
        </div>
      </div>

      {/* ── Submit ─────────────────────────────────────────────────────── */}
      <div className={styles.invoiceActions}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={pending}
        >
          {pending ? "Saving…" : mode === "create" ? "Create Invoice" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
