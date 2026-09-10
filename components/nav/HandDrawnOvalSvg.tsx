import React from "react";

export interface HandDrawnOvalSvgProps {
  variant?: "word" | "circle";
}

export default function HandDrawnOvalSvg({ variant = "word" }: HandDrawnOvalSvgProps) {
  if (variant === "circle") {
    return (
      <svg
        viewBox="0 0 54 54"
        className="absolute -inset-1.5 w-[calc(100%+0.75rem)] h-[calc(100%+0.75rem)] pointer-events-none text-neutral-800 dark:text-[#ece5d8] overflow-visible"
      >
        <path
          d="M 14,27 C 13,16 20,9 29,9 C 39,9 46,17 45,28 C 44,39 36,45 26,45 C 16,45 9,37 9,26 C 9,15 19,9 31,9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-oval-draw"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      className="absolute -inset-x-3.5 -inset-y-2 w-[calc(100%+1.75rem)] h-[calc(100%+1rem)] pointer-events-none text-neutral-800 dark:text-[#ece5d8] overflow-visible"
    >
      <path
        d="M 16,14 C 18,7 40,4 64,4 C 84,4 96,10 95,22 C 94,33 78,40 52,40 C 26,41 7,35 6,24 C 5,13 22,5 50,5 C 72,5 88,10 90,19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-oval-draw"
      />
    </svg>
  );
}
