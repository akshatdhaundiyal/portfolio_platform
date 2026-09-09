"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Lock } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredItem(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 380);
  };

  // Active state: hovered item, or fallback to current route
  const activeItem =
    hoveredItem ||
    (pathname === "/"
      ? null
      : pathname.startsWith("/work")
      ? "work"
      : pathname.startsWith("/about")
      ? "about"
      : null);

  return (
    <header
      className="relative w-full flex justify-center pt-8 sm:pt-12 pb-32 sm:pb-40 select-none z-50 pointer-events-auto"
      onMouseLeave={handleMouseLeave}
    >
      {/* Hand-Drawn Navigation Cluster with Downward Dropping Doodles */}
      <nav className="flex items-center gap-7 sm:gap-11 font-chalk text-2xl sm:text-3xl text-neutral-800 dark:text-[#ece5d8] transition-colors">
        
        {/* =========================================================================
            ITEM 0: :) (Smiley with Red Sunburst Rays - Frame 00:00)
            ========================================================================= */}
        <div
          className="relative flex flex-col items-center cursor-pointer"
          onMouseEnter={() => handleMouseEnter("home")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/"
            className="relative px-3 py-1 flex items-center justify-center font-bold tracking-tight transition-transform hover:scale-110"
            title="Home"
          >
            <span>:)</span>

            {/* Hand-Drawn Oval Circle */}
            {activeItem === "home" && <HandDrawnOvalSvg variant="circle" />}

            {/* Red Sunburst Radiant Rays (Frame 00:00) */}
            {activeItem === "home" && (
              <svg
                viewBox="0 0 54 50"
                className="absolute -top-7 -left-3 w-16 h-16 text-[#d94e34] pointer-events-none overflow-visible animate-doodle-drop-spring"
              >
                {/* Top-left angled ray */}
                <path d="M 14,14 L 4,3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                {/* Top vertical ray */}
                <path d="M 28,10 L 28,-3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                {/* Top-right angled ray */}
                <path d="M 42,14 L 52,3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                {/* Left horizontal ray */}
                <path d="M 8,26 L -4,26" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            )}
          </Link>
        </div>

        {/* =========================================================================
            ITEM 1: about (with Downward Dropping Avatar, Sparkle, Squiggle & in-progress)
            ========================================================================= */}
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => handleMouseEnter("about")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/about"
            className="relative px-4 py-1 font-normal lowercase tracking-wide transition-colors"
          >
            <span>about</span>

            {/* Hand-Drawn Oval Ring */}
            {activeItem === "about" && <HandDrawnOvalSvg />}
          </Link>

          {/* DOWNWARD: Spiky Avatar + in-progress Doodle Drawer */}
          {activeItem === "about" && (
            <div className="absolute top-11 sm:top-12 left-1/2 -translate-x-1/2 pointer-events-none z-40 animate-doodle-drop-spring flex flex-col items-center gap-1.5 pt-1">
              {/* Spiky-Hair Avatar Doodle with Sparkle & Squiggle */}
              <div className="relative flex items-center justify-center">
                {/* Left Sparkle ✦ */}
                <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-neutral-800 dark:text-[#ece5d8] absolute -left-5 top-1">
                  <path d="M 10,0 Q 10,10 20,10 Q 10,10 10,20 Q 10,10 0,10 Q 10,10 10,0 Z" fill="currentColor" />
                </svg>

                {/* Hand-Drawn Boy Avatar Doodle */}
                <svg
                  viewBox="0 0 54 50"
                  className="w-11 h-10 text-neutral-800 dark:text-[#ece5d8] overflow-visible"
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
                <svg viewBox="0 0 26 20" className="w-5 h-4 text-neutral-800 dark:text-[#ece5d8] absolute -right-6 top-1">
                  <path d="M 2,12 C 5,6 8,6 10,12 C 12,18 15,18 17,12 C 19,6 22,6 24,12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Red Handwritten "in-progress" & 3 eyelashes */}
              <div className="relative flex flex-col items-center">
                <span className="font-handwritten text-base sm:text-lg font-bold text-[#d94e34] -rotate-2">
                  in-progress
                </span>
                <svg viewBox="0 0 32 14" className="w-7 h-3.5 text-[#d94e34] overflow-visible -mt-1">
                  <path d="M 6,2 L 2,8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 14,3 L 12,11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 22,4 L 22,12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            ITEM 2: Work (with Downward Dropping Hanging Lanyard Badge & Mouse Cursor)
            ========================================================================= */}
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => handleMouseEnter("work")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/work"
            className="relative px-4 py-1 font-normal tracking-wide transition-colors"
          >
            <span>Work</span>

            {/* Hand-Drawn Oval Ring */}
            {activeItem === "work" && <HandDrawnOvalSvg />}
          </Link>

          {/* DOWNWARD: Hanging Lanyard ID Badge Card */}
          {activeItem === "work" && (
            <div className="absolute top-11 sm:top-12 left-1/2 -translate-x-1/2 pointer-events-none z-40 animate-doodle-drop-spring flex flex-col items-center">
              
              {/* Lanyard Strap Cords hanging down */}
              <div className="relative">
                <svg
                  viewBox="0 0 60 74"
                  className="w-12 h-16 sm:w-13 sm:h-17 text-neutral-800 dark:text-[#ece5d8] overflow-visible"
                >
                  {/* Two Vertical Lanyard Cords */}
                  <path d="M 26,0 L 26,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 34,0 L 34,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  {/* Clip Slot */}
                  <rect x="23" y="9" width="14" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  {/* Badge Card Body with Rounded Corners */}
                  <rect x="7" y="14" width="46" height="54" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
                  {/* Spiky-Hair Avatar Face inside Badge */}
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
                  className="w-4 h-4 text-neutral-800 dark:text-[#ece5d8] absolute -right-3.5 top-7 overflow-visible select-none"
                >
                  <path d="M 2,2 L 7,17 L 10,11 L 16,8 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            ITEM 3: Connect (with Downward Dropping Column Doodle Stack)
            ========================================================================= */}
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => handleMouseEnter("connect")}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className="relative px-4 py-1 font-normal tracking-wide transition-colors cursor-pointer text-neutral-800 dark:text-[#ece5d8]"
            onClick={() => {
              const el = document.getElementById("connect-footer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Connect</span>

            {/* Hand-Drawn Oval Ring */}
            {activeItem === "connect" && <HandDrawnOvalSvg />}
          </button>

          {/* DOWNWARD: Vertical Climbing Stack of Doodle Icons */}
          {activeItem === "connect" && (
            <div
              className="absolute top-11 sm:top-12 left-1/2 -translate-x-1/2 pointer-events-auto z-40 animate-doodle-drop-spring flex flex-col items-center gap-2 pt-1 pb-3"
              onMouseEnter={() => handleMouseEnter("connect")}
            >
              {/* Row 1 (Top of dropdown): Boy Face on Left + GitHub Cat on Right */}
              <div className="flex items-center gap-2.5">
                {/* Spiky-Hair Boy Face Doodle */}
                <div className="w-7 h-7 flex items-center justify-center text-neutral-800 dark:text-[#ece5d8]">
                  <svg viewBox="0 0 40 38" className="w-7 h-6 overflow-visible">
                    <path
                      d="M 8,14 L 10,6 L 15,12 L 20,5 L 25,12 L 30,6 L 32,14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 8,14 C 7,24 10,30 20,30 C 30,30 33,24 32,14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="15" cy="19" r="1.5" fill="currentColor" />
                    <circle cx="25" cy="19" r="1.5" fill="currentColor" />
                    <path d="M 16,24 Q 20,27 24,24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* GitHub Cat Mascot Doodle Outline */}
                <a
                  href="https://github.com/akshatdhaundiyal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-125 hover:rotate-6 transition-transform text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34]"
                  title="GitHub Repositories"
                >
                  <svg viewBox="0 0 36 36" className="w-7 h-7 overflow-visible">
                    <path
                      d="M 18,3 C 9.7,3 3,9.7 3,18 C 3,24.6 7.3,30.2 13.3,32.2 C 14,32.3 14.3,31.9 14.3,31.5 C 14.3,31.1 14.3,30.1 14.3,28.8 C 10.1,29.7 9.2,26.8 9.2,26.8 C 8.5,25 7.5,24.5 7.5,24.5 C 6.1,23.5 7.6,23.5 7.6,23.5 C 9.1,23.6 9.9,25 9.9,25 C 11.2,27.3 13.5,26.6 14.3,26.2 C 14.4,25.2 14.8,24.6 15.3,24.2 C 12,23.8 8.4,22.5 8.4,16.8 C 8.4,15.2 9,13.8 10,12.8 C 9.8,12.4 9.3,10.8 10.2,8.8 C 10.2,8.8 11.4,8.4 14.2,10.3 C 15.4,10 16.7,9.8 18,9.8 C 19.3,9.8 20.6,10 21.8,10.3 C 24.6,8.4 25.8,8.8 25.8,8.8 C 26.7,10.8 26.2,12.4 26,12.8 C 27,13.8 27.6,15.2 27.6,16.8 C 27.6,22.6 24,23.8 20.7,24.2 C 21.3,24.7 21.7,25.6 21.7,27 C 21.7,29 21.7,30.6 21.7,31.5 C 21.7,31.9 22,32.3 22.7,32.2 C 28.7,30.2 33,24.6 33,18 C 33,9.7 26.3,3 18,3 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Row 2 (Middle): Twitter / 𝕏 Doodle */}
              <a
                href="https://twitter.com/akshatdhaundiyal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center hover:scale-125 hover:-rotate-6 transition-transform text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34]"
                title="Twitter / 𝕏"
              >
                <svg viewBox="0 0 28 28" className="w-5 h-5 overflow-visible">
                  <path d="M 5,5 L 23,23 M 23,5 L 5,23" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              </a>

              {/* Row 3 (Bottom): LinkedIn "in" & Email Envelope */}
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/in/akshatdhaundiyal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-125 hover:rotate-6 transition-transform text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34]"
                  title="LinkedIn Profile"
                >
                  <svg viewBox="0 0 32 32" className="w-6 h-6 overflow-visible">
                    <rect x="3" y="3" width="26" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
                    <text x="16" y="22" textAnchor="middle" fontSize="15" fontFamily="var(--font-serif)" fontWeight="bold" fill="currentColor">
                      in
                    </text>
                  </svg>
                </a>

                <a
                  href="mailto:akshatdhaundiyal@gmail.com"
                  className="w-7 h-7 flex items-center justify-center hover:scale-125 hover:-rotate-6 transition-transform text-neutral-800 dark:text-[#ece5d8] hover:text-[#d94e34] dark:hover:text-[#d94e34]"
                  title="Email: akshatdhaundiyal@gmail.com"
                >
                  <svg viewBox="0 0 32 26" className="w-6 h-5 overflow-visible">
                    <rect x="2" y="2" width="28" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
                    <path d="M 2,4 L 16,15 L 30,4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT UTILITIES: Sun/Moon Theme Toggle & Studio Lock
            ========================================================================= */}
        <div className="flex items-center gap-3 ml-2">
          {/* Tactile Sun / Moon Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-transform hover:scale-110 cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M 12,2 L 12,5 M 12,19 L 12,22 M 2,12 L 5,12 M 19,12 L 22,12 M 5,5 L 7,7 M 17,17 L 19,19 M 5,19 L 7,17 M 17,7 L 19,5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-neutral-700">
                <path d="M 21 12.79 A 9 9 0 1 1 11.21 3 A 7 7 0 0 0 21 12.79 z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* Discreet Super Admin Studio Lock */}
          <Link
            href="/admin/blogs"
            title="Super Admin Studio"
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

// Hand-Drawn Chalk Double-Loop Oval Ring
function HandDrawnOvalSvg({ variant = "word" }: { variant?: "word" | "circle" }) {
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
