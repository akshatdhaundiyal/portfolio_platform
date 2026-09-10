import React from "react";

export default function AboutFlyout() {
  return (
    <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-40 animate-doodle-flyout-right flex items-center gap-2 whitespace-nowrap">
      {/* Spiky-Hair Avatar Doodle with Sparkle & Squiggle */}
      <div className="relative flex items-center justify-center">
        {/* Left Sparkle ✦ */}
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-neutral-800 dark:text-[#ece5d8] absolute -left-4 top-1">
          <path d="M 10,0 Q 10,10 20,10 Q 10,10 10,20 Q 10,10 0,10 Q 10,10 10,0 Z" fill="currentColor" />
        </svg>

        {/* Hand-Drawn Boy Avatar Doodle */}
        <svg
          viewBox="0 0 54 50"
          className="w-10 h-9 text-neutral-800 dark:text-[#ece5d8] overflow-visible"
        >
          <path
            d="M 12,18 L 15,8 L 20,15 L 27,6 L 34,15 L 39,8 L 42,18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 12,18 C 11,32 14,40 27,40 C 40,40 43,32 42,18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M 12,23 C 7,23 7,30 12,30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 42,23 C 47,23 47,30 42,30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="24" r="2" fill="currentColor" />
          <circle cx="33" cy="24" r="2" fill="currentColor" />
          <path d="M 22,31 Q 27,36 32,31" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>

        {/* Right Squiggly Loop 〰 */}
        <svg viewBox="0 0 26 20" className="w-5 h-4 text-neutral-800 dark:text-[#ece5d8] absolute -right-5 top-1">
          <path d="M 2,12 C 5,6 8,6 10,12 C 12,18 15,18 17,12 C 19,6 22,6 24,12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
