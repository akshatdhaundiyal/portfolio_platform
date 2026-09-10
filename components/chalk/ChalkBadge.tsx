"use client";

import React, { useRef, useState, useEffect } from "react";
import rough from "roughjs";
import { motion, useInView } from "framer-motion";

export interface ChalkBadgeProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  rotation?: number;
  trigger?: "inView" | "hover" | "mount";
  strokeWidth?: number;
  className?: string;
}

export default function ChalkBadge({
  children,
  color = "#d94e34",
  bgColor = "rgba(217, 78, 52, 0.08)",
  rotation = -1.5,
  trigger = "inView",
  strokeWidth = 2,
  className = "",
}: ChalkBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [borderPaths, setBorderPaths] = useState<string[]>([]);

  const isTriggered =
    trigger === "mount" ? true : trigger === "hover" ? isHovered : isInView;

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = Math.max(rect.width, 30);
    const h = Math.max(rect.height, 20);
    setDimensions({ width: w, height: h });

    const gen = rough.generator();
    const rectDrawable = gen.rectangle(2, 2, w - 4, h - 4, {
      roughness: 1.4,
      bowing: 1.2,
      stroke: color,
      strokeWidth,
      disableMultiStroke: false,
    });
    const paths = gen.toPaths(rectDrawable).map((p) => p.d);
    setBorderPaths(paths);
  }, [children, color, strokeWidth]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundColor: bgColor,
      }}
      className={`relative inline-flex items-center justify-center px-2.5 py-1 select-none font-chalk text-xs tracking-wider uppercase font-semibold transition-transform duration-200 hover:scale-105 ${className}`}
    >
      {/* Hand-drawn SVG border */}
      {dimensions.width > 0 && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={{ filter: "url(#chalk-grit)" }}
        >
          {borderPaths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isTriggered
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: { duration: 0.35, delay: i * 0.05, ease: "easeOut" },
                opacity: { duration: 0.15 },
              }}
            />
          ))}
        </svg>
      )}

      {/* Content */}
      <span style={{ color }} className="relative z-10 flex items-center gap-1">
        {children}
      </span>
    </div>
  );
}
