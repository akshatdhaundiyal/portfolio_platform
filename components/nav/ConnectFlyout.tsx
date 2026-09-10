import React from "react";

interface ConnectFlyoutProps {
  onMouseEnter: () => void;
}

export default function ConnectFlyout({ onMouseEnter }: ConnectFlyoutProps) {
  return (
    <div
      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-auto z-40 animate-doodle-flyout-right flex items-center p-2 rounded-xl bg-white/95 dark:bg-[#18191e]/95 border border-[#1a1a1a]/15 dark:border-white/15 shadow-xl backdrop-blur-md"
      onMouseEnter={onMouseEnter}
    >
      <div className="grid grid-cols-2 gap-2 w-[72px]">
        {/* GitHub Cat */}
        <a
          href="https://github.com/akshatdhaundiyal"
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#d94e34]/15 dark:hover:bg-[#d94e34]/25 text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34] transition-all hover:scale-110 flex items-center justify-center shrink-0"
          title="GitHub Repositories"
          aria-label="GitHub Repositories"
        >
          <svg viewBox="0 0 36 36" className="w-4 h-4 shrink-0 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 18,3 C 9.7,3 3,9.7 3,18 C 3,24.6 7.3,30.2 13.3,32.2 C 14,32.3 14.3,31.9 14.3,31.5 C 14.3,31.1 14.3,30.1 14.3,28.8 C 10.1,29.7 9.2,26.8 9.2,26.8 C 8.5,25 7.5,24.5 7.5,24.5 C 6.1,23.5 7.6,23.5 7.6,23.5 C 9.1,23.6 9.9,25 9.9,25 C 11.2,27.3 13.5,26.6 14.3,26.2 C 14.4,25.2 14.8,24.6 15.3,24.2 C 12,23.8 8.4,22.5 8.4,16.8 C 8.4,15.2 9,13.8 10,12.8 C 9.8,12.4 9.3,10.8 10.2,8.8 C 10.2,8.8 11.4,8.4 14.2,10.3 C 15.4,10 16.7,9.8 18,9.8 C 19.3,9.8 20.6,10 21.8,10.3 C 24.6,8.4 25.8,8.8 25.8,8.8 C 26.7,10.8 26.2,12.4 26,12.8 C 27,13.8 27.6,15.2 27.6,16.8 C 27.6,22.6 24,23.8 20.7,24.2 C 21.3,24.7 21.7,25.6 21.7,27 C 21.7,29 21.7,30.6 21.7,31.5 C 21.7,31.9 22,32.3 22.7,32.2 C 28.7,30.2 33,24.6 33,18 C 33,9.7 26.3,3 18,3 Z" />
          </svg>
        </a>

        {/* Twitter / 𝕏 */}
        <a
          href="https://twitter.com/akshatdhaundiyal"
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#d94e34]/15 dark:hover:bg-[#d94e34]/25 text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34] transition-all hover:scale-110 flex items-center justify-center shrink-0"
          title="Twitter / 𝕏"
          aria-label="Twitter / 𝕏"
        >
          <svg viewBox="0 0 28 28" className="w-3.5 h-3.5 shrink-0 stroke-current" strokeWidth="2.8" strokeLinecap="round">
            <path d="M 5,5 L 23,23 M 23,5 L 5,23" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/akshatdhaundiyal"
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#d94e34]/15 dark:hover:bg-[#d94e34]/25 text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34] transition-all hover:scale-110 flex items-center justify-center shrink-0"
          title="LinkedIn Profile"
          aria-label="LinkedIn Profile"
        >
          <svg viewBox="0 0 32 32" className="w-4 h-4 shrink-0 stroke-current" strokeWidth="2.2">
            <rect x="3" y="3" width="26" height="26" rx="5" fill="none" />
            <text x="16" y="22" textAnchor="middle" fontSize="15" fontFamily="var(--font-serif)" fontWeight="bold" fill="currentColor" stroke="none">
              in
            </text>
          </svg>
        </a>

        {/* Email */}
        <a
          href="mailto:akshatdhaundiyal@gmail.com"
          className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#d94e34]/15 dark:hover:bg-[#d94e34]/25 text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34] transition-all hover:scale-110 flex items-center justify-center shrink-0"
          title="Email: akshatdhaundiyal@gmail.com"
          aria-label="Email"
        >
          <svg viewBox="0 0 32 26" className="w-4 h-3.5 shrink-0 stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="2" y="2" width="28" height="22" rx="2" />
            <path d="M 2,4 L 16,15 L 30,4" />
          </svg>
        </a>
      </div>
    </div>
  );
}
