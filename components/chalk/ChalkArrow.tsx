"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export type ChalkArrowDirection =
  | "right"
  | "left"
  | "up"
  | "down"
  | "curve-right-down"
  | "curve-left-down"
  | "loop-right";

export interface ChalkArrowProps {
  direction?: ChalkArrowDirection;
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  trigger?: "inView" | "hover" | "mount";
  duration?: number;
  delay?: number;
  className?: string;
  label?: string;
}

export default function ChalkArrow({
  direction = "right",
  color = "#d94e34",
  width = 60,
  height = 24,
  strokeWidth = 2.4,
  trigger = "inView",
  duration = 0.4,
  delay = 0,
  className = "",
  label,
}: ChalkArrowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = React.useState(false);

  const isTriggered =
    trigger === "mount" ? true : trigger === "hover" ? isHovered : isInView;

  // Path coordinates based on direction
  const getPathData = () => {
    switch (direction) {
      case "right":
        return {
          shaft: "M 4,12 C 18,10 36,14 54,12",
          head1: "M 44,5 C 48,9 52,11 55,12",
          head2: "M 44,19 C 48,15 52,13 55,12",
          viewBox: "0 0 60 24",
        };
      case "left":
        return {
          shaft: "M 56,12 C 42,14 24,10 6,12",
          head1: "M 16,5 C 12,9 8,11 5,12",
          head2: "M 16,19 C 12,15 8,13 5,12",
          viewBox: "0 0 60 24",
        };
      case "down":
        return {
          shaft: "M 12,4 C 14,18 10,36 12,54",
          head1: "M 5,44 C 9,48 11,52 12,55",
          head2: "M 19,44 C 15,48 13,52 12,55",
          viewBox: "0 0 24 60",
        };
      case "up":
        return {
          shaft: "M 12,56 C 10,42 14,24 12,6",
          head1: "M 5,16 C 9,12 11,8 12,5",
          head2: "M 19,16 C 15,12 13,8 12,5",
          viewBox: "0 0 24 60",
        };
      case "curve-right-down":
        return {
          shaft: "M 4,6 C 24,4 48,10 46,38",
          head1: "M 38,30 C 42,35 45,37 46,39",
          head2: "M 54,29 C 50,34 47,37 46,39",
          viewBox: "0 0 60 48",
        };
      case "curve-left-down":
        return {
          shaft: "M 56,6 C 36,4 12,10 14,38",
          head1: "M 22,30 C 18,35 15,37 14,39",
          head2: "M 6,29 C 10,34 13,37 14,39",
          viewBox: "0 0 60 48",
        };
      case "loop-right":
        return {
          shaft: "M 4,20 C 15,4 40,2 45,18 C 48,28 32,32 30,22 C 28,14 44,14 56,22",
          head1: "M 47,16 C 52,19 55,21 57,22",
          head2: "M 49,27 C 53,24 55,23 57,22",
          viewBox: "0 0 64 36",
        };
    }
  };

  const { shaft, head1, head2, viewBox } = getPathData();

  return (
    <div
      ref={ref}
      className={`inline-flex flex-col items-center gap-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label && (
        <span
          className="font-chalk text-xs tracking-wide text-neutral-600 dark:text-neutral-300 select-none"
          style={{ color }}
        >
          {label}
        </span>
      )}
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        className="overflow-visible pointer-events-none"
        style={{ filter: "url(#chalk-grit)" }}
      >
        {/* Shaft */}
        <motion.path
          d={shaft}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isTriggered
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Arrowhead Wing 1 */}
        <motion.path
          d={head1}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isTriggered
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: duration * 0.5, delay: delay + duration * 0.75 }}
        />
        {/* Arrowhead Wing 2 */}
        <motion.path
          d={head2}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isTriggered
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: duration * 0.5, delay: delay + duration * 0.85 }}
        />
      </svg>
    </div>
  );
}
