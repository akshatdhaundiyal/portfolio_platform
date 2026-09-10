"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";

interface AdminAuthGateProps {
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AdminAuthGate({
  onSuccess,
  title = "Studio Authorization",
  subtitle = "Enter your role passcode to access the unified editorial workbench and project artifacts.",
}: AdminAuthGateProps) {
  const [loginUsername, setLoginUsername] = useState("superadmin");
  const [loginPasscode, setLoginPasscode] = useState("super123");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: loginPasscode,
          role: loginUsername,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece5d8] flex items-center justify-center p-4 sm:p-8 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#18191e] border border-[#1a1a1a]/15 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d94e34] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#8a8780] dark:text-[#9c968f]">
              Studio Console
            </span>
          </div>
          <Link
            href="/"
            className="font-mono text-[11px] text-[#8a8780] hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Return to Site
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Role Quick Pick */}
        <div className="space-y-2">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f]">
            Quick-Select Role
          </span>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => {
                setLoginUsername("superadmin");
                setLoginPasscode("super123");
              }}
              className="p-1.5 rounded-lg border border-[#1a1a1a]/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginUsername("admin");
                setLoginPasscode("admin123");
              }}
              className="p-1.5 rounded-lg border border-[#1a1a1a]/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginUsername("dev");
                setLoginPasscode("dev123");
              }}
              className="p-1.5 rounded-lg border border-[#1a1a1a]/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
            >
              Dev
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginUsername("user");
                setLoginPasscode("user123");
              }}
              className="p-1.5 rounded-lg border border-[#1a1a1a]/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginUsername("guest");
                setLoginPasscode("guest123");
              }}
              className="p-1.5 rounded-lg border border-[#1a1a1a]/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
            >
              Guest
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f]">
              Role Username
            </label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="superadmin"
              className="w-full px-3.5 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-[#1a1a1a]/15 dark:border-white/15 font-mono text-xs focus:border-[#d94e34] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f]">
              Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={loginPasscode}
                onChange={(e) => setLoginPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-[#1a1a1a]/15 dark:border-white/15 font-mono text-xs focus:border-[#d94e34] focus:outline-hidden pr-9"
                autoFocus
              />
              <KeyRound className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5" />
            </div>
            {authError && <p className="font-mono text-[11px] text-red-500 mt-1">{authError}</p>}
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2.5 rounded-xl bg-[#d94e34] hover:bg-[#c23e25] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Studio Workbench</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
