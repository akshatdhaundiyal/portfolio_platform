"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import rough from "roughjs";
import { motion, useInView } from "framer-motion";

export type ChalkAnnotationType =
  | "circle"
  | "underline"
  | "box"
  | "highlight"
  | "strike"
  | "bracket";

export type ChalkTrigger = "inView" | "hover" | "mount" | "controlled";

export interface ChalkAnnotationProps {
  children: React.ReactNode;
  type?: ChalkAnnotationType;
  color?: string;
  trigger?: ChalkTrigger;
  active?: boolean;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  seed?: number;
  className?: string;
  annotationClassName?: string;
  padding?: number;
}

interface PathItem {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
}

export default function ChalkAnnotation({
  children,
  type = "underline",
  color,
  trigger = "inView",
  active = false,
  duration = 0.45,
  delay = 0,
  strokeWidth = 2.2,
  roughness = 1.6,
  bowing = 1.2,
  seed,
  className = "",
  annotationClassName = "",
  padding = 6,
}: ChalkAnnotationProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const [isHovered, setIsHovered] = useState(false);
  const [bounds, setBounds] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [paths, setPaths] = useState<PathItem[]>([]);
  const internalSeed = useRef(seed || Math.floor(Math.random() * 10000));

  // Determine active state based on trigger
  const isTriggered =
    trigger === "mount"
      ? true
      : trigger === "hover"
      ? isHovered
      : trigger === "controlled"
      ? active
      : isInView;

  // Measure element
  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBounds({
          width: Math.max(rect.width, 20),
          height: Math.max(rect.height, 16),
        });
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [children]);

  // Generate Rough paths whenever bounds or styling props change
  useEffect(() => {
    if (bounds.width === 0 || bounds.height === 0) return;

    const generator = rough.generator();
    const w = bounds.width;
    const h = bounds.height;
    const p = padding;
    const strokeColor = color || "currentColor";
    const commonOpts = {
      roughness,
      bowing,
      stroke: strokeColor,
      strokeWidth,
      seed: internalSeed.current,
      disableMultiStroke: false,
    };

    let drawable;

    switch (type) {
      case "circle": {
        // Organic enclosing ellipse with slight tilt and overlap
        drawable = generator.ellipse(w / 2, h / 2, w + p * 2.2, h + p * 1.8, {
          ...commonOpts,
          curveTightness: 0,
        });
        break;
      }
      case "underline": {
        // Double wobbly underline just below the text baseline
        const yOffset = h + 2;
        drawable = generator.linearPath(
          [
            [-p * 0.5, yOffset],
            [w * 0.35, yOffset + 2],
            [w * 0.7, yOffset - 1],
            [w + p * 0.5, yOffset + 1],
          ],
          commonOpts
        );
        break;
      }
      case "box": {
        // Sketchy loose box around element
        drawable = generator.rectangle(-p, -p * 0.6, w + p * 2, h + p * 1.2, commonOpts);
        break;
      }
      case "strike": {
        // Energetic diagonal or straight chalk strike
        const yCenter = h * 0.52;
        drawable = generator.linearPath(
          [
            [-p * 0.8, yCenter + 2],
            [w * 0.3, yCenter - 2],
            [w * 0.7, yCenter + 2],
            [w + p * 0.8, yCenter - 1],
          ],
          { ...commonOpts, strokeWidth: strokeWidth * 1.2 }
        );
        break;
      }
      case "bracket": {
        // Left & right editorial brackets
        const leftD = generator.linearPath(
          [
            [-p + 4, -p * 0.3],
            [-p, -p * 0.3],
            [-p, h + p * 0.3],
            [-p + 4, h + p * 0.3],
          ],
          commonOpts
        );
        const rightD = generator.linearPath(
          [
            [w + p - 4, -p * 0.3],
            [w + p, -p * 0.3],
            [w + p, h + p * 0.3],
            [w + p - 4, h + p * 0.3],
          ],
          commonOpts
        );
        const allPaths = [...generator.toPaths(leftD), ...generator.toPaths(rightD)];
        setPaths(allPaths);
        return;
      }
      case "highlight": {
        // Translucent hatch fill behind text
        drawable = generator.rectangle(-p * 0.4, 0, w + p * 0.8, h, {
          ...commonOpts,
          stroke: "none",
          fill: color || "rgba(245, 158, 11, 0.22)",
          fillStyle: "zigzag",
          hachureGap: 5,
          fillWeight: strokeWidth * 1.5,
        });
        break;
      }
      default:
        drawable = generator.line(0, h + 2, w, h + 2, commonOpts);
    }

    const generated = generator.toPaths(drawable);
    setPaths(generated);
  }, [bounds, type, color, strokeWidth, roughness, bowing, padding]);

  // Determine overflow margins based on padding
  const marginX = Math.max(padding * 2.5, 12);
  const marginY = Math.max(padding * 2, 10);

  return (
    <span
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Target Content */}
      <span className="relative z-10">{children}</span>

      {/* Chalk SVG Overlay */}
      {bounds.width > 0 && (
        <svg
          aria-hidden="true"
          viewBox={`-${marginX} -${marginY} ${bounds.width + marginX * 2} ${bounds.height + marginY * 2}`}
          style={{
            position: "absolute",
            left: -marginX,
            top: -marginY,
            width: bounds.width + marginX * 2,
            height: bounds.height + marginY * 2,
            pointerEvents: "none",
            overflow: "visible",
            zIndex: type === "highlight" ? 0 : 20,
          }}
          className={`pointer-events-none ${annotationClassName}`}
        >
          {paths.map((p, index) => (
            <motion.path
              key={index}
              d={p.d}
              stroke={p.stroke || color || "currentColor"}
              strokeWidth={p.strokeWidth || strokeWidth}
              fill={p.fill || "none"}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isTriggered
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: {
                  duration,
                  delay: delay + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.15, delay },
              }}
              style={{ filter: "url(#chalk-grit)" }}
            />
          ))}
        </svg>
      )}
    </span>
  );
}
