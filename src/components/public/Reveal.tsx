"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<
  HTMLMotionProps<"div"> & {
    delay?: number;
  }
>;

export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  ...props
}: PropsWithChildren<HTMLMotionProps<"div">>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...props
}: PropsWithChildren<HTMLMotionProps<"div">>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
