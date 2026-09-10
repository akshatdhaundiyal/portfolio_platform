import React from "react";

export default function WorkFlyout() {
  return (
    <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-40 animate-doodle-flyout-right flex items-center whitespace-nowrap">
      <div className="relative">
        <svg
          viewBox="0 0 60 74"
          className="w-10 h-13 sm:w-11 sm:h-14 text-neutral-800 dark:text-[#ece5d8] overflow-visible"
        >
          <path d="M 26,0 L 26,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M 34,0 L 34,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="23" y="9" width="14" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="7" y="14" width="46" height="54" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path
            d="M 18,30 L 20,23 L 24,28 L 30,21 L 36,28 L 40,23 L 42,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 18,30 C 17,42 20,48 30,48 C 40,48 43,42 42,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="25" cy="35" r="1.6" fill="currentColor" />
          <circle cx="35" cy="35" r="1.6" fill="currentColor" />
          <path d="M 26,40 Q 30,44 34,40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        {/* Hand-Drawn Retro Mouse Cursor Arrow ↖ */}
        <svg
          viewBox="0 0 20 20"
          className="w-3.5 h-3.5 text-neutral-800 dark:text-[#ece5d8] absolute -right-3 top-5 overflow-visible select-none"
        >
          <path d="M 2,2 L 7,17 L 10,11 L 16,8 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
