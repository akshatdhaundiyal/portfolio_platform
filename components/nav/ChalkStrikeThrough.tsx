import React from "react";

export default function ChalkStrikeThrough() {
  return (
    <span className="absolute inset-0 pointer-events-none flex items-center justify-center -rotate-1 select-none z-20">
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="w-[calc(100%+0.5rem)] h-5 text-[#d94e34] dark:text-[#f87171] overflow-visible"
      >
        {/* Hand-drawn chalk cross-out strike line with organic wobble */}
        <path
          d="M 2,12 C 22,6 38,15 58,8 C 72,4 86,13 98,9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          className="animate-draw-stroke"
        />
        {/* Subtle secondary scratch for authentic handwritten look */}
        <path
          d="M 6,10 C 26,7 46,12 68,9 C 80,8 90,11 96,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.6"
          className="animate-draw-stroke"
        />
      </svg>
    </span>
  );
}
