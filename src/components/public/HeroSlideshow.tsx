"use client";
import { useEffect, useState } from "react";
import styles from "./Public.module.css";

const SLIDES = [
  "/assets/backgrounds/fondo-1",
  "/assets/backgrounds/fondo-2",
  "/assets/backgrounds/fondo-3",
];

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {SLIDES.map((base, i) => (
        <picture key={base}>
          <source srcSet={`${base}.webp`} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${base}.jpg`}
            alt=""
            aria-hidden="true"
            className={`${styles.heroSlide} ${i === index ? styles.heroSlideActive : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding={i === 0 ? "sync" : "async"}
          />
        </picture>
      ))}
    </>
  );
}
