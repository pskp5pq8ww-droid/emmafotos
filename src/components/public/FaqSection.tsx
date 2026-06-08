"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import styles from "./Public.module.css";

type FaqItem = { question: string; answer: string };

export function FaqSection({
  items,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
  mobileLimit,
}: {
  items: FaqItem[];
  title?: string;
  eyebrow?: string;
  /** On mobile (≤640px), only the first N items are shown without JS — purely via CSS */
  mobileLimit?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.sectionTight}>
      <div className={styles.sectionHeader}>
        <Reveal>
          <p className={styles.sectionEyebrow}>{eyebrow}</p>
          <h2 className={styles.sectionTitle}>{title}</h2>
        </Reveal>
      </div>
      <div className={styles.faqList}>
        {items.map((item, i) => (
          <Reveal delay={i * 0.04} key={item.question}>
            <div
              className={styles.faqItem}
              data-mobile-hidden={
                mobileLimit !== undefined && i >= mobileLimit ? "true" : undefined
              }
            >
              <button
                type="button"
                className={styles.faqQuestion}
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{item.question}</span>
                <span className={`${styles.faqIcon} ${open === i ? styles.faqIconOpen : ""}`}>
                  +
                </span>
              </button>
              {open === i && (
                <p className={styles.faqAnswer}>{item.answer}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
