"use client";

import { useState } from "react";
import styles from "./Admin.module.css";

export function CopyLinkButton({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${href}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button className={styles.ghostButton} onClick={copy} type="button">
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
