/**
 * Client-side PDF generation for invoices using jsPDF.
 * Runs entirely in the browser — no server, no Puppeteer, Hostinger-safe.
 * Both InvoicePdfDownload and the preview modal use this helper.
 */

const BUSINESS = {
  name: "Emmanuel Rojas Photography",
  address1: "141 Campbell St, 1602",
  address2: "Brisbane QLD 4006, Australia",
  abn: "77 382 893 651",
  phone: "0412 763 107",
  email: "emmanuel@photographeraustralia.com",
} as const;

export type InvoicePdfData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentMethod?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  lineItems: Array<{
    description: string;
    note?: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    amount: number;
  }>;
  subtotal: number;
  gstEnabled: boolean;
  gstRate: number;
  gstAmount: number;
  total: number;
  totalDue: number;
  paymentNotes?: string;
};

function fmtCurrency(n: number): string {
  return `$${n.toFixed(2)}`;
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export async function downloadInvoicePdf(invoice: InvoicePdfData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const marginL = 52;
  const marginR = 52;
  const contentW = pw - marginL - marginR;
  let y = 52;

  // ── ER monogram ──
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 12);
  doc.text("ER", marginL, y + 6);

  // ── Business info (top-right) ──
  const bizLines = [
    BUSINESS.name,
    BUSINESS.address1,
    BUSINESS.address2,
    `ABN: ${BUSINESS.abn}`,
    `Phone: ${BUSINESS.phone}`,
    `Email: ${BUSINESS.email}`,
  ];
  const bizLineH = 13;
  const bizX = pw - marginR;
  bizLines.forEach((line, i) => {
    if (i === 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 25);
    } else {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 90);
    }
    doc.text(line, bizX, y + i * bizLineH, { align: "right" });
  });

  y += Math.max(40, bizLines.length * bizLineH + 6);

  // ── Rule ──
  doc.setDrawColor(200, 200, 205);
  doc.setLineWidth(0.6);
  doc.line(marginL, y, pw - marginR, y);
  y += 22;

  // ── INVOICE heading ──
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 12);
  doc.text("INVOICE", marginL, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 110);
  doc.text(invoice.invoiceNumber, marginL, y + 16);
  y += 44;

  // ── Bill To + metadata two-column ──
  const colMid = marginL + contentW * 0.55;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 140);
  doc.text("BILL TO", marginL, y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 12);
  doc.text(invoice.clientName || "—", marginL, y + 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 90);
  const billLines = [
    invoice.clientEmail,
    invoice.clientAddress,
    invoice.clientPhone,
  ].filter(Boolean) as string[];
  billLines.forEach((line, i) => {
    doc.text(line, marginL, y + 28 + i * 13);
  });

  const metaRows: [string, string][] = [
    ["Invoice No.", invoice.invoiceNumber],
    ["Issue Date",  fmtDate(invoice.issueDate)],
    ["Due Date",    fmtDate(invoice.dueDate)],
    ["Payment",     invoice.paymentMethod || "—"],
  ];
  let metaY = y;
  doc.setFontSize(8);
  metaRows.forEach(([label, val]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 130, 140);
    doc.text(label, colMid, metaY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 10, 12);
    doc.text(val, pw - marginR, metaY, { align: "right" });
    metaY += 14;
  });

  y += Math.max(28 + billLines.length * 13 + 10, metaRows.length * 14 + 12);
  y += 14;

  // ── Rule ──
  doc.setDrawColor(220, 220, 225);
  doc.setLineWidth(0.5);
  doc.line(marginL, y, pw - marginR, y);
  y += 16;

  // ── Line items ──
  const cw = {
    desc:     contentW * 0.42,
    qty:      contentW * 0.10,
    price:    contentW * 0.15,
    discount: contentW * 0.12,
    amount:   contentW * 0.15,
  };
  const cx = {
    desc:     marginL,
    qty:      marginL + cw.desc + contentW * 0.02,
    price:    marginL + cw.desc + cw.qty + contentW * 0.04,
    discount: marginL + cw.desc + cw.qty + cw.price + contentW * 0.04,
    amount:   pw - marginR - cw.amount,
  };

  doc.setFillColor(20, 20, 25);
  doc.rect(marginL, y - 10, contentW, 18, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 200, 210);
  (
    [
      ["DESCRIPTION",  cx.desc,               "left"],
      ["QTY",          cx.qty,                "left"],
      ["UNIT PRICE",   cx.price + cw.price,   "right"],
      ["DISC %",       cx.discount + cw.discount, "right"],
      ["AMOUNT",       cx.amount + cw.amount, "right"],
    ] as [string, number, "left" | "right"][]
  ).forEach(([h, x, align]) => doc.text(h, x, y + 1, { align }));
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  invoice.lineItems.forEach((item, i) => {
    const rowH = item.note ? 28 : 18;
    if (i % 2 === 1) {
      doc.setFillColor(245, 245, 248);
      doc.rect(marginL, y - 11, contentW, rowH + 2, "F");
    }
    doc.setTextColor(10, 10, 12);
    doc.text(item.description, cx.desc, y);
    if (item.note) {
      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 140);
      doc.text(item.note, cx.desc, y + 11);
      doc.setFontSize(9);
      doc.setTextColor(10, 10, 12);
    }
    doc.text(String(item.quantity), cx.qty, y);
    doc.text(fmtCurrency(item.unitPrice), cx.price + cw.price, y, { align: "right" });
    doc.text(`${item.discountPercent}%`, cx.discount + cw.discount, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(fmtCurrency(item.amount), cx.amount + cw.amount, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(220, 220, 225);
    doc.setLineWidth(0.3);
    doc.line(marginL, y + rowH - 9, pw - marginR, y + rowH - 9);
    y += rowH;
  });

  y += 10;

  // ── Totals ──
  const tLabelX = pw - marginR - 180;
  const tValX   = pw - marginR;
  const totalsRows: [string, string, boolean][] = [
    ["Subtotal",     fmtCurrency(invoice.subtotal),  false],
    ...(invoice.gstEnabled
      ? [[`GST ${invoice.gstRate}%`, fmtCurrency(invoice.gstAmount), false] as [string, string, boolean]]
      : []),
    ["Total AUD",    fmtCurrency(invoice.total),     false],
    ["Total Due AUD", fmtCurrency(invoice.totalDue), true],
  ];

  totalsRows.forEach(([label, val, bold]) => {
    if (bold) {
      doc.setDrawColor(190, 190, 195);
      doc.setLineWidth(0.5);
      doc.line(tLabelX, y - 8, pw - marginR, y - 8);
      y += 8;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10.5 : 9.5);
    doc.setTextColor(bold ? 10 : 80, bold ? 10 : 80, bold ? 12 : 90);
    doc.text(label, tLabelX, y);
    doc.text(val, tValX, y, { align: "right" });
    y += bold ? 16 : 14;
  });

  y += 20;

  // ── Payment notes ──
  if (invoice.paymentNotes) {
    doc.setDrawColor(200, 200, 205);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, pw - marginR, y);
    y += 14;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(130, 130, 140);
    doc.text("PAYMENT NOTES", marginL, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 70);
    const noteLines = doc.splitTextToSize(invoice.paymentNotes, contentW);
    doc.text(noteLines, marginL, y);
    y += (noteLines as string[]).length * 12 + 16;
  }

  // ── Signature ──
  const sigY = Math.max(y + 20, ph - 90);
  doc.setDrawColor(180, 180, 185);
  doc.setLineWidth(0.4);
  doc.line(marginL, sigY, marginL + 200, sigY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 130, 140);
  doc.text("Issued by, signature:", marginL, sigY + 12);

  // ── Save ──
  const safeName = (invoice.clientName || "invoice")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
  const filename = `${invoice.invoiceNumber}-${safeName}.pdf`;
  doc.save(filename);
}
