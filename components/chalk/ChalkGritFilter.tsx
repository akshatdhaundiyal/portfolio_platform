"use client";

import React from "react";

/**
 * Reusable global SVG filters for authentic chalkboard & graph-paper chalk grain textures.
 * Mount this once in the root layout (app/layout.tsx).
 * Elements apply it with: style={{ filter: "url(#chalk-grit)" }} or filter="url(#chalk-grit)"
 */
export default function ChalkGritFilter() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed -top-[9999px] -left-[9999px] w-0 h-0 overflow-hidden"
    >
      <defs>
        {/* Authentic powdery chalk edge distortion */}
        <filter id="chalk-grit" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="3"
            result="noise"
            seed="42"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Subtle soften for chalk powdery texture */}
          <feGaussianBlur in="displaced" stdDeviation="0.25" result="softened" />
          <feMerge>
            <feMergeNode in="softened" />
            <feMergeNode in="SourceGraphic" opacity="0.2" />
          </feMerge>
        </filter>

        {/* Slightly heavier rough edge for diagrams & bold strokes */}
        <filter id="chalk-rough" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.04"
            numOctaves="4"
            result="roughNoise"
            seed="101"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="roughNoise"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roughDisplaced"
          />
          <feGaussianBlur in="roughDisplaced" stdDeviation="0.3" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
            <feMergeNode in="SourceGraphic" opacity="0.25" />
          </feMerge>
        </filter>

        {/* Subtle chalk dust glow */}
        <filter id="chalk-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
