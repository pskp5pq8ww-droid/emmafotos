export type InvoiceLineItem = {
  id: string;
  description: string;
  note?: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  /** Auto-calculated: qty * unitPrice * (1 - discountPercent/100) */
  amount: number;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "unpaid";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;

  issueDate: string;  // "YYYY-MM-DD"
  dueDate: string;    // "YYYY-MM-DD"
  paymentMethod: string;

  // Client (Bill To)
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;

  // Line items
  lineItems: InvoiceLineItem[];

  // Totals
  subtotal: number;
  gstEnabled: boolean;
  gstRate: number;     // default 10
  gstAmount: number;
  total: number;
  totalDue: number;

  // Notes
  paymentNotes?: string;
  /** Internal note — never shown on PDF */
  internalNote?: string;

  createdAt: string;
  updatedAt: string;
};

export type InvoiceDatabase = {
  invoices: Invoice[];
  /** Counter used to suggest the next invoice number (e.g. 3 → "INV-003") */
  nextNumber: number;
};

export const emptyInvoiceDatabase: InvoiceDatabase = {
  invoices: [],
  nextNumber: 1,
};

// ── Invoice Client (separate from gallery Client in types.ts) ──────────────

export type InvoiceClient = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  /** How many invoices have been raised for this client */
  invoiceCount: number;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceClientsDatabase = {
  clients: InvoiceClient[];
};

export const emptyInvoiceClientsDatabase: InvoiceClientsDatabase = {
  clients: [],
};
