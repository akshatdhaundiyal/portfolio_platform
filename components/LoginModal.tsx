"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Lock, KeyRound, ShieldCheck, ArrowRight, UserCheck, CheckCircle2, Sparkles, UserPlus, LogIn } from "lucide-react";
import type { UserRole, AuthUser } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser, redirectUrl: string) => void;
  initialTab?: "login" | "signup";
}

interface RolePreset {
  role: UserRole;
  label: string;
  badge: string;
  username: string;
  pass: string;
  desc: string;
  pillColor: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    role: "superadmin",
    label: "Super Admin",
    badge: "FULL CONTROLS",
    username: "superadmin",
    pass: "super123",
    desc: "Complete studio workbench, projects reordering, articles CMS, and telemetry.",
    pillColor: "border-red-500/40 text-[#d94e34] dark:text-red-400 bg-red-500/10",
  },
  {
    role: "admin",
    label: "Admin",
    badge: "EDITORIAL WORKBENCH",
    username: "admin",
    pass: "admin123",
    desc: "Curate case studies, edit articles, manage Medium cross-posting.",
    pillColor: "border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/10",
  },
  {
    role: "dev",
    label: "Dev",
    badge: "TELEMETRY & HEALTH",
    username: "dev",
    pass: "dev123",
    desc: "Real-time system diagnostics, database latency, API route statuses.",
    pillColor: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    role: "user",
    label: "Member",
    badge: "INTERACTIVE ACCESS",
    username: "user",
    pass: "user123",
    desc: "Interactive studio preview and verified feedback submissions.",
    pillColor: "border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-500/10",
  },
  {
    role: "guest",
    label: "Guest",
    badge: "READ-ONLY PREVIEW",
    username: "guest",
    pass: "guest123",
    desc: "Visual tour of all projects & artifacts with read-only watermarks.",
    pillColor: "border-neutral-500/40 text-neutral-600 dark:text-neutral-400 bg-neutral-500/10",
  },
];

export default function LoginModal({ isOpen, onClose, onSuccess, initialTab = "login" }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("super123");
  const [selectedRole, setSelectedRole] = useState<UserRole>("superadmin");

  // Sign up state
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRoleInterest, setSignupRoleInterest] = useState<"client" | "peer" | "community">("client");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const signupDisplayNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || "login");
      setError("");
      setSuccessUser(null);
      setTimeout(() => {
        if (initialTab === "signup") {
          signupDisplayNameInputRef.current?.focus();
        } else {
          passwordInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectPreset = (preset: RolePreset) => {
    setSelectedRole(preset.role);
    setUsername(preset.username);
    setPassword(preset.pass);
    setError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter a passcode.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: username.trim() || undefined,
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Invalid passcode.");
        setIsLoading(false);
        return;
      }

      setSuccessUser(data.user);
      setIsLoading(false);

      if (onSuccess) {
        onSuccess(data.user, data.redirectUrl);
      } else {
        setTimeout(() => {
          window.location.href = data.redirectUrl || "/admin/projects";
        }, 600);
      }
    } catch {
      setError("Network or server connection error.");
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername.trim()) {
      setError("Please choose a username.");
      return;
    }
    if (!signupPassword.trim()) {
      setError("Please enter a passcode for your account.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          username: signupUsername.trim(),
          password: signupPassword.trim(),
          displayName: signupDisplayName.trim() || signupUsername.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      setSuccessUser(data.user);
      setIsLoading(false);

      if (onSuccess) {
        onSuccess(data.user, data.redirectUrl);
      } else {
        setTimeout(() => {
          window.location.href = data.redirectUrl || "/admin/projects";
        }, 600);
      }
    } catch {
      setError("Network or server connection error.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-[#f6f4ee] dark:bg-[#16171b] border border-[#1a1a1a]/15 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all text-neutral-900 dark:text-[#ece5d8]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Top Decorative Drafting Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d94e34] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#8a8780] dark:text-[#9c968f]">
              Studio Workbench // {activeTab === "signup" ? "Account Registration" : "Role Authorization"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* Header Segmented Tabs (Sign In vs Sign Up) */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-black/[0.05] dark:bg-white/[0.05] border border-[#1a1a1a]/15 dark:border-white/15 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "login"
                  ? "bg-white dark:bg-[#202227] text-[#d94e34] dark:text-white shadow-md font-bold ring-1 ring-black/5 dark:ring-white/10"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setError("");
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "signup"
                  ? "bg-white dark:bg-[#202227] text-[#d94e34] dark:text-white shadow-md font-bold ring-1 ring-black/5 dark:ring-white/10"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] tracking-normal font-sans bg-[#d94e34]/15 text-[#d94e34] dark:bg-[#d94e34]/25 dark:text-red-300 font-semibold">
                Create Account
              </span>
            </button>
          </div>

          {activeTab === "login" ? (
            /* =============================================================
               SIGN IN TAB CONTENT
               ============================================================= */
            <div>
              {/* Header Title */}
              <div className="mb-5">
                <h2
                  id="login-modal-title"
                  className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white"
                >
                  Sign into Studio Portal
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 font-sans">
                  Choose a quick-fill role below or enter your personal master passcode to access the workbench.
                </p>
              </div>

              {/* Quick switch banner for visitors looking to sign up */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#d94e34]/10 dark:bg-[#d94e34]/15 border border-[#d94e34]/25 mb-5 text-neutral-800 dark:text-neutral-200">
                <div className="flex items-center gap-2 text-xs font-sans">
                  <UserPlus className="w-4 h-4 text-[#d94e34] shrink-0" />
                  <span>Don't have an account yet?</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setError("");
                  }}
                  className="px-3 py-1 rounded-lg bg-[#d94e34] hover:bg-[#c23e25] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                >
                  <span>Sign Up Here</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Quick-Fill Role Chips */}
              <div className="mb-5">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-2">
                  1-Click Role Quick-Fills
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROLE_PRESETS.map((preset) => {
                    const isSelected = selectedRole === preset.role;
                    return (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#d94e34] bg-[#d94e34]/10 shadow-xs ring-1 ring-[#d94e34]/30"
                            : "border-[#1a1a1a]/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] hover:border-[#1a1a1a]/30 dark:hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                            {preset.label}
                          </span>
                          {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-[#d94e34]" />}
                        </div>
                        <span className="inline-block mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f]">
                          {preset.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedRole && (
                  <div className="mt-2 px-3 py-1.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-[#1a1a1a]/5 dark:border-white/5 flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                    <span className="font-mono text-[10px] text-[#d94e34] uppercase tracking-wider shrink-0 mt-0.5">
                      Permissions:
                    </span>
                    <span>{ROLE_PRESETS.find((p) => p.role === selectedRole)?.desc}</span>
                  </div>
                )}
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="superadmin"
                      className="w-full px-3.5 py-2 text-sm font-mono rounded-xl bg-white dark:bg-[#121316] border border-[#1a1a1a]/15 dark:border-white/15 focus:border-[#d94e34] dark:focus:border-[#d94e34] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-1.5">
                      Passcode
                    </label>
                    <div className="relative">
                      <input
                        ref={passwordInputRef}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 text-sm font-mono rounded-xl bg-white dark:bg-[#121316] border border-[#1a1a1a]/15 dark:border-white/15 focus:border-[#d94e34] dark:focus:border-[#d94e34] focus:outline-none transition-colors pr-9"
                      />
                      <KeyRound className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {successUser && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Unlocked as {successUser.displayName} ({successUser.role})</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-600">Redirecting...</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                    <button
                      type="submit"
                      disabled={isLoading || !!successUser}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d94e34] hover:bg-[#c23e25] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : successUser ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Authorized</span>
                        </>
                      ) : (
                        <>
                          <span>Unlock Workbench</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                </div>
              </form>
            </div>
          ) : (
            /* =============================================================
               SIGN UP TAB CONTENT
               ============================================================= */
            <div>
              {/* Header Title */}
              <div className="mb-5">
                <h2
                  id="login-modal-title"
                  className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white"
                >
                  Create Studio Member Account
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 font-sans">
                  Register your account to access client portals, collaborate on milestones, and leave verified feedback.
                </p>
              </div>

              {/* Quick switch banner for existing users */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#1a1a1a]/10 dark:border-white/10 mb-4 text-neutral-800 dark:text-neutral-200">
                <div className="flex items-center gap-2 text-xs font-sans">
                  <LogIn className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>Already have a studio account?</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                  }}
                  className="px-3 py-1 rounded-lg bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                >
                  <span>Sign In Here</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Account Type Focus */}
              <div className="mb-4">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-2">
                  Account Focus
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "client", label: "Client / Partner", desc: "Contract milestones & invoices" },
                    { id: "peer", label: "ML & Systems Peer", desc: "Dev telemetry & architecture" },
                    { id: "community", label: "Community Reader", desc: "Interactive feedback & preview" },
                  ].map((item) => {
                    const isSelected = signupRoleInterest === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSignupRoleInterest(item.id as any)}
                        className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#d94e34] bg-[#d94e34]/10 shadow-xs ring-1 ring-[#d94e34]/30"
                            : "border-[#1a1a1a]/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] hover:border-[#1a1a1a]/30 dark:hover:border-white/20"
                        }`}
                      >
                        <span className="font-serif text-xs font-medium text-neutral-900 dark:text-white block">
                          {item.label}
                        </span>
                        <span className="font-mono text-[9px] text-[#8a8780] dark:text-[#9c968f] block mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-1">
                    Your Full Name
                  </label>
                  <input
                    ref={signupDisplayNameInputRef}
                    type="text"
                    value={signupDisplayName}
                    onChange={(e) => setSignupDisplayName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-[#121316] border border-[#1a1a1a]/15 dark:border-white/15 focus:border-[#d94e34] dark:focus:border-[#d94e34] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-1">
                      Username / Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="e.g. mayachen"
                      className="w-full px-3.5 py-2 text-sm font-mono rounded-xl bg-white dark:bg-[#121316] border border-[#1a1a1a]/15 dark:border-white/15 focus:border-[#d94e34] dark:focus:border-[#d94e34] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8a8780] dark:text-[#9c968f] mb-1">
                      Account Passcode *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 text-sm font-mono rounded-xl bg-white dark:bg-[#121316] border border-[#1a1a1a]/15 dark:border-white/15 focus:border-[#d94e34] dark:focus:border-[#d94e34] focus:outline-none transition-colors pr-9"
                      />
                      <KeyRound className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {successUser && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Account created for {successUser.displayName}!</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-600">Signing in...</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                    <button
                      type="submit"
                      disabled={isLoading || !!successUser}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d94e34] hover:bg-[#c23e25] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : successUser ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Account Created</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account & Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer info stamp */}
        <div className="px-6 py-3 border-t border-[#1a1a1a]/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-[11px] font-mono text-[#8a8780] dark:text-[#9c968f]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#d94e34]" />
            HMAC-SHA256 Signed Session
          </span>
          <span className="hidden sm:inline">Automatic role redirection</span>
        </div>
      </div>
    </div>
  );
}
