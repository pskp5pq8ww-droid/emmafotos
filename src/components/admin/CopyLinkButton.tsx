"use client";

import { useState } from "react";
import styles from "./Admin.module.css";

export function CopyLinkButton({
  href,
  label = "Copy link",
}: {
  href: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    // href can be a full URL or a path — always resolve against the current origin
    const url = href.startsWith("http") ? href : `${window.location.origin}${href}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button className={styles.ghostButton} onClick={copy} type="button">
      {copied ? "✓ Copied!" : label}
    </button>
  );
}
