"use client";

import type { Invoice } from "@/lib/db/invoice-types";

const BUSINESS = {
  name: "Emmanuel Rojas Photography",
  address1: "141 Campbell St, 1602",
  address2: "Brisbane QLD 4006, Australia",
  abn: "77 382 893 651",
  phone: "0412 763 107",
  email: "emmanuelrojas-23@hotmail.com",
} as const;

function fmtCurrency(n: number): string {
  return `$${n.toFixed(2)}`;
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function InvoicePdfDownload({ invoice }: { invoice: Invoice }) {
  const handleDownload = async () => {
    // Dynamic import so jsPDF is only loaded client-side and doesn't bloat SSR
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();   // 595.28
    const marginL = 52;
    const marginR = 52;
    const contentW = pw - marginL - marginR;
    let y = 52;

    // ── Fonts ──
    doc.setFont("helvetica");

    // ── ER Logo placeholder (text) ──
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 10, 12);
    doc.text("ER", marginL, y + 6);

    // ── Business info (top-right) ──
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 90);
    const bizLines = [
      BUSINESS.name,
      BUSINESS.address1,
      BUSINESS.address2,
      `ABN: ${BUSINESS.abn}`,
      `Phone: ${BUSINESS.phone}`,
      `Email: ${BUSINESS.email}`,
    ];
    const bizX = pw - marginR;
    const bizLineH = 13;
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

    y += Math.max(36, bizLines.length * bizLineH + 4);

    // ── Horizontal rule ──
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

    // ── Two-column: BILL TO (left) + metadata (right) ──
    const colMid = marginL + contentW * 0.55;

    // Bill To
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(130, 130, 140);
    doc.text("BILL TO", marginL, y);
    doc.setTextColor(10, 10, 12);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
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

    // Metadata table (right column)
    const metaRows: [string, string][] = [
      ["Invoice No.", invoice.invoiceNumber],
      ["Issue Date",  fmtDate(invoice.issueDate)],
      ["Due Date",    fmtDate(invoice.dueDate)],
      ["Payment",     invoice.paymentMethod || "—"],
    ];
    const metaLabelX = colMid;
    const metaValX   = pw - marginR;
    let metaY = y;
    doc.setFontSize(8);
    metaRows.forEach(([label, val]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 130, 140);
      doc.text(label, metaLabelX, metaY);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 10, 12);
      doc.text(val, metaValX, metaY, { align: "right" });
      metaY += 14;
    });

    y += Math.max(28 + billLines.length * 13 + 10, metaRows.length * 14 + 12);
    y += 14;

    // ── Horizontal rule ──
    doc.setDrawColor(220, 220, 225);
    doc.setLineWidth(0.5);
    doc.line(marginL, y, pw - marginR, y);
    y += 16;

    // ── Line items table ──
    const colWidths = {
      desc:     contentW * 0.42,
      qty:      contentW * 0.10,
      price:    contentW * 0.15,
      discount: contentW * 0.12,
      amount:   contentW * 0.15,
      // gap: remaining 6%
    };
    const colX = {
      desc:     marginL,
      qty:      marginL + colWidths.desc + contentW * 0.02,
      price:    marginL + colWidths.desc + colWidths.qty + contentW * 0.04,
      discount: marginL + colWidths.desc + colWidths.qty + colWidths.price + contentW * 0.04,
      amount:   pw - marginR - colWidths.amount,
    };

    // Table header
    doc.setFillColor(20, 20, 25);
    doc.rect(marginL, y - 10, contentW, 18, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 200, 210);
    const headers: [string, number, "left" | "right"][] = [
      ["DESCRIPTION",  colX.desc,     "left"],
      ["QTY",          colX.qty,      "left"],
      ["UNIT PRICE",   colX.price,    "right"],
      ["DISC %",       colX.discount, "right"],
      ["AMOUNT",       colX.amount + colWidths.amount, "right"],
    ];
    headers.forEach(([h, x, align]) => {
      doc.text(h, x, y + 1, { align });
    });
    y += 18;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    invoice.lineItems.forEach((item, i) => {
      const rowBg = i % 2 === 1;
      const rowH = item.note ? 28 : 18;

      if (rowBg) {
        doc.setFillColor(245, 245, 248);
        doc.rect(marginL, y - 11, contentW, rowH + 2, "F");
      }

      doc.setTextColor(10, 10, 12);
      doc.text(item.description, colX.desc, y);
      if (item.note) {
        doc.setFontSize(7.5);
        doc.setTextColor(130, 130, 140);
        doc.text(item.note, colX.desc, y + 11);
        doc.setFontSize(9);
        doc.setTextColor(10, 10, 12);
      }
      doc.text(String(item.quantity), colX.qty, y);
      doc.text(fmtCurrency(item.unitPrice), colX.price + colWidths.price, y, { align: "right" });
      doc.text(`${item.discountPercent}%`, colX.discount + colWidths.discount, y, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(fmtCurrency(item.amount), colX.amount + colWidths.amount, y, { align: "right" });
      doc.setFont("helvetica", "normal");

      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.line(marginL, y + rowH - 9, pw - marginR, y + rowH - 9);

      y += rowH;
    });

    y += 10;

    // ── Totals ──
    const totalsLabelX = pw - marginR - 180;
    const totalsValX   = pw - marginR;

    const totalsRows: [string, string, boolean][] = [
      ["Subtotal", fmtCurrency(invoice.subtotal), false],
      ...(invoice.gstEnabled
        ? [[`GST ${invoice.gstRate}%`, fmtCurrency(invoice.gstAmount), false] as [string, string, boolean]]
        : []),
      ["Total AUD", fmtCurrency(invoice.total), false],
      ["Total Due AUD", fmtCurrency(invoice.totalDue), true],
    ];

    totalsRows.forEach(([label, val, bold]) => {
      if (bold) {
        doc.setDrawColor(190, 190, 195);
        doc.setLineWidth(0.5);
        doc.line(totalsLabelX, y - 8, pw - marginR, y - 8);
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(10, 10, 12);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 90);
      }
      doc.text(label, totalsLabelX, y);
      if (bold) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(10, 10, 12);
      }
      doc.text(val, totalsValX, y, { align: "right" });
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
      y += noteLines.length * 12 + 16;
    }

    // ── Signature line ──
    const pageH = doc.internal.pageSize.getHeight();
    const sigY = Math.max(y + 20, pageH - 90);
    doc.setDrawColor(180, 180, 185);
    doc.setLineWidth(0.4);
    doc.line(marginL, sigY, marginL + 200, sigY);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 130, 140);
    doc.text("Issued by, signature:", marginL, sigY + 12);

    // Save
    const filename = `${invoice.invoiceNumber}-${(invoice.clientName || "invoice").replace(/\s+/g, "-")}.pdf`;
    doc.save(filename);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      style={{
        minHeight: 40,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid rgba(200,169,110,0.3)",
        borderRadius: 100,
        background: "rgba(80,55,20,0.5)",
        color: "#E8C878",
        letterSpacing: "0.14em",
        fontSize: 10.5,
        textTransform: "uppercase",
        paddingInline: 18,
        cursor: "pointer",
        transition: "background 0.18s, box-shadow 0.18s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(110,75,25,0.7)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(200,169,110,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(80,55,20,0.5)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      ↓ Download PDF
    </button>
  );
}
