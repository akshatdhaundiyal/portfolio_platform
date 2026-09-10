"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled to safely load WebGL in Next.js App Router
const NeuralTerrainCanvas = dynamic(
  () => import("@/components/background/NeuralTerrainCanvas"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 pointer-events-none" />,
  }
);

export default function Hero3DBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute -top-28 sm:-top-36 left-0 right-0 h-[920px] sm:h-[1100px] w-full overflow-hidden pointer-events-none z-0 select-none"
      style={{
        // Smoothly fade edges to transparent in all directions so it blends invisibly with desk background & header
        maskImage:
          "radial-gradient(ellipse 80% 65% at 50% 48%, black 25%, rgba(0, 0, 0, 0.4) 65%, transparent 95%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 65% at 50% 48%, black 25%, rgba(0, 0, 0, 0.4) 65%, transparent 95%)",
      }}
    >
      {/* 3D WebGL Canvas */}
      <NeuralTerrainCanvas />

      {/* Gentle bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f6f4ee] dark:from-[#121316] to-transparent pointer-events-none opacity-80" />
    </div>
  );
}
