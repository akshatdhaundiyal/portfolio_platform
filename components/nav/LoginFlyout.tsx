import React from "react";

interface LoginFlyoutProps {
  user: { username: string; role: string; displayName: string } | null;
  onMouseEnter: () => void;
  onClick: () => void;
}

export default function LoginFlyout({ user, onMouseEnter, onClick }: LoginFlyoutProps) {
  return (
    <div
      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-auto z-40 animate-doodle-flyout-right flex items-center gap-1.5 whitespace-nowrap"
      onMouseEnter={onMouseEnter}
    >
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer flex items-center gap-1.5 hover:scale-105 transition-transform text-neutral-800 dark:text-[#ece5d8]"
        title={user ? "Sign out of active session" : "Open login / signup modal"}
      >
        {user ? (
          // Unlocked / Sign-Out Doodle SVG
          <svg viewBox="0 0 44 48" className="w-7 h-8 overflow-visible">
            {/* Unlocked Shackle (lifted and rotated open) */}
            <path
              d="M 14,20 L 14,10 C 14,5 18,2 22,2 C 26,2 30,5 30,10 L 30,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Lock Body */}
            <rect
              x="8"
              y="20"
              width="28"
              height="24"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            />
            {/* Keyhole */}
            <circle cx="22" cy="29" r="2.5" fill="currentColor" />
            <path d="M 22,31 L 22,37" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            {/* Small exit arrow ➔ */}
            <path
              d="M 37,28 L 44,28 M 41,25 L 44,28 L 41,31"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Padlock & Key Doodle SVG
          <svg viewBox="0 0 44 48" className="w-7 h-8 overflow-visible">
            {/* Closed Shackle */}
            <path
              d="M 14,20 L 14,12 C 14,7 18,3 22,3 C 26,3 30,7 30,12 L 30,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Lock Body */}
            <rect
              x="8"
              y="20"
              width="28"
              height="24"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            />
            {/* Keyhole */}
            <circle cx="22" cy="29" r="2.5" fill="currentColor" />
            <path d="M 22,31 L 22,37" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            {/* Whimsical Key hanging to the right */}
            <path
              d="M 37,30 L 44,30 M 42,30 L 42,34 M 44,30 L 44,33"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}

        <span className="font-mono text-[9px] tracking-widest uppercase text-[#d94e34] dark:text-[#f87171]">
          {user ? "LOGOUT" : "LOGIN / SIGNUP"}
        </span>
      </button>
    </div>
  );
}
