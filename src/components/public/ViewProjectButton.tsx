"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Public.module.css";

export function ViewProjectButton({ className }: { className?: string }) {
  const router = useRouter();
  const [fading, setFading] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      sessionStorage.setItem("project-entry", "1");
      router.push("/project");
    }, 980);
  }

  return (
    <>
      <button className={className} onClick={handleClick}>
        View Project
      </button>
      {fading && <div className={styles.cinemaOut} aria-hidden="true" />}
    </>
  );
}
