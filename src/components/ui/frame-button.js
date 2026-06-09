"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "motion/react";

const CORNERS = [
  { Component: ChevronUpLeft,    pos: (o) => ({ top: o, left: o }),    hover: { x: -7, y: -7 } },
  { Component: ChevronUpRight,   pos: (o) => ({ top: o, right: o }),   hover: { x: 7,  y: -7 } },
  { Component: ChevronDownRight, pos: (o) => ({ bottom: o, right: o }), hover: { x: 7,  y: 7  } },
  { Component: ChevronDownLeft,  pos: (o) => ({ bottom: o, left: o }), hover: { x: -7, y: 7  } },
];

export function FrameMarkers({ className, size = 20, offset = 7.5 }) {
  const offsetPx = `-${offset}px`;
  return (
    <>
      {CORNERS.map(({ Component, pos, hover }, i) => (
        <motion.span
          key={i}
          className={cn("absolute pointer-events-none text-white/50", className)}
          style={{ position: "absolute", width: size, height: size, ...pos(offsetPx) }}
          variants={{ rest: { x: 0, y: 0 }, hover }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Component style={{ width: size, height: size }} />
        </motion.span>
      ))}
    </>
  );
}

export function FrameButton({
  children,
  className,
  variant = "default",
  glow = false,
  size = 20,
  offset = 7.5,
  as,
  href,
  ...props
}) {
  const commonStyles = cn(
    "group relative inline-flex overflow-visible items-center justify-center",
    "border-[1.5px] px-8 py-4",
    "cursor-pointer no-underline",
    "uppercase tracking-[0.2em]",
    "text-sm font-medium",
    "transition-colors duration-200",
    "select-none",
    variant === "default" && "bg-white text-black border-white hover:bg-white/90",
    variant === "secondary" && "bg-transparent text-white border-white/30 hover:bg-white/10",
    variant === "outline"   && "bg-transparent text-white border-white/30 hover:bg-white/10",
    className,
  );

  const glowLayer = glow ? (
    <div
      className="absolute inset-0 -z-10 opacity-0 blur-2xl group-hover:opacity-40 group-hover:scale-110"
      style={{ background: "currentColor" }}
    />
  ) : null;

  const Content = (
    <>
      {glowLayer}
      {children}
      <FrameMarkers size={size} offset={offset} />
    </>
  );

  if (as === "link") {
    return (
      <motion.a
        href={href}
        className={commonStyles}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.985 }}
        {...props}
      >
        {Content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={commonStyles}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      {...props}
    >
      {Content}
    </motion.button>
  );
}

function ChevronDownLeft({ className, style, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} className={className} {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 8v8h8" />
    </svg>
  );
}

function ChevronDownRight({ className, style, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} className={className} {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 8v8h-8" />
    </svg>
  );
}

function ChevronUpLeft({ className, style, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} className={className} {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 16v-8h8" />
    </svg>
  );
}

function ChevronUpRight({ className, style, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} className={className} {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 16v-8h-8" />
    </svg>
  );
}

export default FrameButton;
