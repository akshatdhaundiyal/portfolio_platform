"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

export interface ChalkSvgDiagramProps {
  src?: string;
  svgContent?: string;
  trigger?: "inView" | "mount" | "controlled";
  active?: boolean;
  strokeDuration?: number;
  stagger?: number;
  chalkFilter?: boolean;
  colorMode?: "original" | "chalk" | "adaptive";
  showControls?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}

interface ParsedPath {
  id: string;
  d: string;
  stroke: string;
  strokeWidth: number;
  fill: string;
  opacity: number;
}

interface ParsedText {
  id: string;
  text: string;
  x: number;
  y: number;
  fill: string;
  fontSize: string;
  fontFamily: string;
  textAnchor?: "inherit" | "start" | "middle" | "end";
}

export default function ChalkSvgDiagram({
  src,
  svgContent,
  trigger = "inView",
  active = false,
  strokeDuration = 0.4,
  stagger = 0.05,
  chalkFilter = true,
  colorMode = "adaptive",
  showControls = false,
  className = "",
  onAnimationComplete,
}: ChalkSvgDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });
  const [viewBox, setViewBox] = useState("0 0 600 400");
  const [paths, setPaths] = useState<ParsedPath[]>([]);
  const [texts, setTexts] = useState<ParsedText[]>([]);
  const [rawSvg, setRawSvg] = useState<string | null>(svgContent || null);
  const [replayKey, setReplayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch external SVG if src provided
  useEffect(() => {
    if (svgContent) {
      setRawSvg(svgContent);
      return;
    }
    if (src) {
      fetch(src)
        .then((res) => res.text())
        .then((data) => setRawSvg(data))
        .catch((err) => console.error("Error loading chalk SVG diagram:", err));
    }
  }, [src, svgContent]);

  // Parse SVG content
  useEffect(() => {
    if (!rawSvg || typeof window === "undefined") return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvg, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) return;

      const vb =
        svgEl.getAttribute("viewBox") ||
        `0 0 ${svgEl.getAttribute("width") || 600} ${svgEl.getAttribute("height") || 400}`;
      setViewBox(vb);

      // Extract all path-like elements
      const extractedPaths: ParsedPath[] = [];
      const pathNodes = svgEl.querySelectorAll("path, line, rect, circle, polyline, polygon");

      pathNodes.forEach((node, idx) => {
        let d = "";
        const tag = node.tagName.toLowerCase();

        if (tag === "path") {
          d = node.getAttribute("d") || "";
        } else if (tag === "line") {
          const x1 = node.getAttribute("x1") || "0";
          const y1 = node.getAttribute("y1") || "0";
          const x2 = node.getAttribute("x2") || "0";
          const y2 = node.getAttribute("y2") || "0";
          d = `M ${x1},${y1} L ${x2},${y2}`;
        } else if (tag === "rect") {
          const x = parseFloat(node.getAttribute("x") || "0");
          const y = parseFloat(node.getAttribute("y") || "0");
          const w = parseFloat(node.getAttribute("width") || "0");
          const h = parseFloat(node.getAttribute("height") || "0");
          d = `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
        } else if (tag === "circle") {
          const cx = parseFloat(node.getAttribute("cx") || "0");
          const cy = parseFloat(node.getAttribute("cy") || "0");
          const r = parseFloat(node.getAttribute("r") || "0");
          d = `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
        }

        if (d.trim()) {
          const stroke = node.getAttribute("stroke") || "currentColor";
          const strokeWidth = parseFloat(node.getAttribute("stroke-width") || "2");
          const fill = node.getAttribute("fill") || "none";
          const opacity = parseFloat(node.getAttribute("opacity") || "1");

          extractedPaths.push({
            id: `path-${idx}`,
            d,
            stroke: stroke === "none" ? "transparent" : stroke,
            strokeWidth: isNaN(strokeWidth) ? 2 : strokeWidth,
            fill: fill === "none" ? "none" : fill,
            opacity: isNaN(opacity) ? 1 : opacity,
          });
        }
      });

      // Extract text elements
      const extractedTexts: ParsedText[] = [];
      const textNodes = svgEl.querySelectorAll("text");
      textNodes.forEach((node, idx) => {
        const text = node.textContent || "";
        const x = parseFloat(node.getAttribute("x") || "0");
        const y = parseFloat(node.getAttribute("y") || "0");
        const fill = node.getAttribute("fill") || "currentColor";
        const fontSize = node.getAttribute("font-size") || "14px";
        const fontFamily = node.getAttribute("font-family") || "var(--font-chalk), sans-serif";
        const rawAnchor = node.getAttribute("text-anchor");
        const textAnchor: "inherit" | "start" | "middle" | "end" =
          rawAnchor === "middle" || rawAnchor === "end" || rawAnchor === "inherit"
            ? rawAnchor
            : "start";

        if (text.trim()) {
          extractedTexts.push({
            id: `text-${idx}`,
            text,
            x,
            y,
            fill,
            fontSize,
            fontFamily,
            textAnchor,
          });
        }
      });

      setPaths(extractedPaths);
      setTexts(extractedTexts);
    } catch (err) {
      console.error("Failed to parse chalk diagram SVG:", err);
    }
  }, [rawSvg]);

  const isTriggered =
    trigger === "mount"
      ? true
      : trigger === "controlled"
      ? active
      : isInView;

  const handleReplay = () => {
    setIsPlaying(true);
    setReplayKey((k) => k + 1);
  };

  const totalDuration = paths.length * stagger + strokeDuration;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl bg-chalk-container select-none ${className}`}
    >
      {/* Controls Overlay (Optional) */}
      {showControls && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-white/10 hover:bg-white/20 text-neutral-200 backdrop-blur transition-all"
            title="Replay Chalk Drawing"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        key={replayKey}
        viewBox={viewBox}
        className="w-full h-auto max-h-[600px] overflow-visible"
        style={chalkFilter ? { filter: "url(#chalk-grit)" } : undefined}
      >
        {/* Animated Chalk Paths */}
        {paths.map((p, idx) => {
          // Adaptive color handling
          let strokeColor = p.stroke;
          if (colorMode === "adaptive") {
            if (p.stroke === "currentColor" || p.stroke === "#000" || p.stroke === "#000000" || p.stroke === "#18181b") {
              strokeColor = "var(--chalk-stroke, currentColor)";
            }
          } else if (colorMode === "chalk") {
            strokeColor = "#f3ede2";
          }

          return (
            <motion.path
              key={p.id}
              d={p.d}
              stroke={strokeColor}
              strokeWidth={p.strokeWidth}
              fill={p.fill !== "none" ? p.fill : "none"}
              fillOpacity={p.fill !== "none" ? 0.15 : 0}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isTriggered
                  ? { pathLength: 1, opacity: p.opacity }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: {
                  duration: strokeDuration,
                  delay: idx * stagger,
                  ease: [0.2, 0.8, 0.2, 1],
                },
                opacity: {
                  duration: 0.1,
                  delay: idx * stagger,
                },
              }}
              onAnimationComplete={
                idx === paths.length - 1 ? onAnimationComplete : undefined
              }
            />
          );
        })}

        {/* Hand-drawn Text Labels */}
        {texts.map((t, idx) => (
          <motion.text
            key={t.id}
            x={t.x}
            y={t.y}
            fill={t.fill === "currentColor" ? "var(--chalk-stroke, currentColor)" : t.fill}
            fontSize={t.fontSize}
            fontFamily="var(--font-chalk), 'Patrick Hand', cursive, sans-serif"
            textAnchor={t.textAnchor}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isTriggered
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{
              duration: 0.35,
              delay: totalDuration * 0.7 + idx * 0.08,
              ease: "easeOut",
            }}
          >
            {t.text}
          </motion.text>
        ))}
      </svg>
    </div>
  );
}
