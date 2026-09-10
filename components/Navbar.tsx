"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import LoginModal from "@/components/LoginModal";
import HandDrawnOvalSvg from "@/components/nav/HandDrawnOvalSvg";
import AboutFlyout from "@/components/nav/AboutFlyout";
import WorkFlyout from "@/components/nav/WorkFlyout";
import ConnectFlyout from "@/components/nav/ConnectFlyout";
import LoginFlyout from "@/components/nav/LoginFlyout";
import ChalkStrikeThrough from "@/components/nav/ChalkStrikeThrough";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredAuthWord, setHoveredAuthWord] = useState<"login" | "signup" | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<{ username: string; role: string; displayName: string } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

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

  const handleAuthAction = async () => {
    if (user) {
      try {
        await fetch("/api/auth", { method: "DELETE" });
        setUser(null);
        if (pathname.startsWith("/admin")) {
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Logout failed", err);
      }
    } else {
      setAuthModalTab("login");
      setLoginModalOpen(true);
    }
  };

  return (
    <header
      className="relative w-full flex justify-center pt-8 sm:pt-12 pb-8 sm:pb-10 select-none z-50 pointer-events-auto"
      onMouseLeave={handleMouseLeave}
    >
      {/* Hand-Drawn Navigation Cluster with Right-Side Horizontal Flyouts */}
      <nav className="flex items-center gap-10 sm:gap-16 font-chalk text-2xl sm:text-3xl text-neutral-800 dark:text-[#ece5d8] transition-colors">
        
        {/* ITEM 0: :) (Smiley with Red Sunburst Rays) */}
        <div
          className="relative flex items-center cursor-pointer"
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

            {/* Red Sunburst Radiant Rays */}
            {activeItem === "home" && (
              <svg
                viewBox="0 0 54 50"
                className="absolute -top-7 -left-3 w-16 h-16 text-[#d94e34] pointer-events-none overflow-visible animate-doodle-drop-spring"
              >
                <path d="M 14,14 L 4,3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <path d="M 28,10 L 28,-3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <path d="M 42,14 L 52,3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <path d="M 8,26 L -4,26" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            )}
          </Link>
        </div>

        {/* ITEM 1: about (with Horizontal Right Flyout: Avatar & Sparkles) */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => handleMouseEnter("about")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/about"
            onMouseEnter={() => handleMouseEnter("about")}
            onFocus={() => handleMouseEnter("about")}
            onBlur={handleMouseLeave}
            className="relative px-4 py-1 font-normal lowercase tracking-wide transition-colors"
          >
            <span>about</span>
            {activeItem === "about" && <HandDrawnOvalSvg />}
          </Link>

          {activeItem === "about" && <AboutFlyout />}
        </div>

        {/* ITEM 2: Work (with Horizontal Right Flyout: Lanyard Badge & Cursor) */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => handleMouseEnter("work")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/work"
            onMouseEnter={() => handleMouseEnter("work")}
            onFocus={() => handleMouseEnter("work")}
            onBlur={handleMouseLeave}
            className="relative px-4 py-1 font-normal tracking-wide transition-colors"
          >
            <span>Work</span>
            {activeItem === "work" && <HandDrawnOvalSvg />}
          </Link>

          {activeItem === "work" && <WorkFlyout />}
        </div>

        {/* ITEM 3: Connect (with Horizontal Right Flyout: Compact 2x2 Mini-Cluster) */}
        <div
          className="relative flex items-center mr-6 sm:mr-8"
          onMouseEnter={() => handleMouseEnter("connect")}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onMouseEnter={() => handleMouseEnter("connect")}
            onFocus={() => handleMouseEnter("connect")}
            onBlur={handleMouseLeave}
            className="relative px-4 py-1 font-normal tracking-wide transition-colors cursor-pointer text-neutral-800 dark:text-[#ece5d8]"
            onClick={() => {
              const el = document.getElementById("connect-footer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Connect</span>
            {activeItem === "connect" && <HandDrawnOvalSvg />}
          </button>

          {activeItem === "connect" && (
            <ConnectFlyout onMouseEnter={() => handleMouseEnter("connect")} />
          )}
        </div>

        {/* ITEM 4: login / signup or logout (with Horizontal Right Flyout & Interactive Reciprocal Strike) */}
        <div
          className="relative flex items-center mr-20 sm:mr-24 group/auth"
          onMouseEnter={() => handleMouseEnter("login")}
          onMouseLeave={() => {
            handleMouseLeave();
            setHoveredAuthWord(null);
          }}
        >
          {user ? (
            <button
              type="button"
              onMouseEnter={() => handleMouseEnter("login")}
              onFocus={() => handleMouseEnter("login")}
              onBlur={handleMouseLeave}
              onClick={handleAuthAction}
              className="relative px-3 sm:px-4 py-1 font-normal tracking-wide transition-colors cursor-pointer text-neutral-800 dark:text-[#ece5d8] flex items-center gap-1.5"
              title={`Signed in as ${user.displayName} (click to log out)`}
            >
              <span>logout</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {activeItem === "login" && <HandDrawnOvalSvg />}
            </button>
          ) : (
            <div
              className="relative px-3 sm:px-4 py-1 flex items-center font-normal tracking-wide text-neutral-800 dark:text-[#ece5d8] select-none"
              onMouseEnter={() => handleMouseEnter("login")}
            >
              {/* Outer shared oval ring encircling BOTH of them together */}
              {(activeItem === "login" || !!hoveredAuthWord) && <HandDrawnOvalSvg />}

              {/* "login" sub-button */}
              <button
                type="button"
                onMouseEnter={() => {
                  handleMouseEnter("login");
                  setHoveredAuthWord("login");
                }}
                onClick={() => {
                  setAuthModalTab("login");
                  setLoginModalOpen(true);
                }}
                className={`login-btn relative px-1 py-0.5 cursor-pointer transition-all duration-200 group-has-[.signup-btn:hover]:opacity-35 group-has-[.signup-btn:hover]:text-neutral-500 ${
                  hoveredAuthWord === "signup" ? "opacity-35 text-neutral-500" : ""
                } hover:text-[#d94e34] dark:hover:text-[#f87171]`}
                title="Log in to your account"
              >
                <span>login</span>
                <span className={`${hoveredAuthWord === "signup" ? "block" : "hidden"} group-has-[.signup-btn:hover]:block`}>
                  <ChalkStrikeThrough />
                </span>
              </button>

              {/* Slash separator */}
              <span className="px-1 text-neutral-400 dark:text-neutral-600 pointer-events-none">
                /
              </span>

              {/* "signup" sub-button */}
              <button
                type="button"
                onMouseEnter={() => {
                  handleMouseEnter("login");
                  setHoveredAuthWord("signup");
                }}
                onClick={() => {
                  setAuthModalTab("signup");
                  setLoginModalOpen(true);
                }}
                className={`signup-btn relative px-1 py-0.5 cursor-pointer transition-all duration-200 group-has-[.login-btn:hover]:opacity-35 group-has-[.login-btn:hover]:text-neutral-500 ${
                  hoveredAuthWord === "login" ? "opacity-35 text-neutral-500" : ""
                } hover:text-[#d94e34] dark:hover:text-[#f87171]`}
                title="Create a new account"
              >
                <span>signup</span>
                <span className={`${hoveredAuthWord === "login" ? "block" : "hidden"} group-has-[.login-btn:hover]:block`}>
                  <ChalkStrikeThrough />
                </span>
              </button>
            </div>
          )}

          {activeItem === "login" && (
            <LoginFlyout
              user={user}
              onMouseEnter={() => handleMouseEnter("login")}
              onClick={handleAuthAction}
            />
          )}
        </div>

        {/* RIGHT UTILITIES: Sun/Moon Theme Toggle with clean divider */}
        <div className="flex items-center pl-3 sm:pl-4 border-l border-neutral-300 dark:border-neutral-700">
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
        </div>
      </nav>

      {/* In-Place Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        initialTab={authModalTab}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(authResult, redirectUrl) => {
          setUser(authResult);
          setTimeout(() => {
            window.location.href = redirectUrl || "/admin/projects";
          }, 400);
        }}
      />
    </header>
  );
}
