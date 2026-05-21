"use client";

import { useState } from "react";
import styles from "./Admin.module.css";

export function CopyLinkButton({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button className={styles.ghostButton} onClick={copy} type="button">
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
