"use client";

import { downloadInvoicePdf, type InvoicePdfData } from "@/lib/pdf/invoice-pdf";

export function InvoicePdfDownload({ invoice }: { invoice: InvoicePdfData }) {
  return (
    <button
      type="button"
      onClick={() => downloadInvoicePdf(invoice)}
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
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 16px rgba(200,169,110,0.15)";
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
