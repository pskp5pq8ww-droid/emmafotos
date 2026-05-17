"use client";
import { useEffect, useState } from "react";
import styles from "./Public.module.css";

const SLIDES = [
  "/assets/backgrounds/fondo-1.jpg",
  "/assets/backgrounds/fondo-2.jpg",
  "/assets/backgrounds/fondo-3.jpg",
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
      {SLIDES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`${styles.heroSlide} ${i === index ? styles.heroSlideActive : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding={i === 0 ? "sync" : "async"}
        />
      ))}
    </>
  );
}
