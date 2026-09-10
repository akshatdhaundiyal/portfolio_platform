"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  FileText,
  Users,
  Receipt,
  Settings,
  Activity,
  LogOut,
  Sparkles,
  Building2,
  Menu,
  X,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface StudioNavbarProps {
  user?: AuthUser | null;
  userRole?: string;
  activeRoute?: string;
  badgeCounts?: {
    projects?: number;
    articles?: number;
    clients?: number;
    invoices?: number;
  };
}

export default function StudioNavbar({
  user: propUser,
  userRole,
  activeRoute,
  badgeCounts,
}: StudioNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(propUser || null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!propUser) {
      fetch("/api/auth")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [propUser]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  };

  const currentPath = activeRoute || pathname;

  const STUDIO_ITEMS = [
    {
      label: "Projects & Artifacts",
      href: "/admin/projects",
      icon: Layers,
      count: badgeCounts?.projects,
      match: currentPath.startsWith("/admin/projects"),
      badge: "Showcase",
    },
    {
      label: "Articles Studio",
      href: "/admin/blogs",
      icon: FileText,
      count: badgeCounts?.articles,
      match: currentPath.startsWith("/admin/blogs"),
      badge: "Medium",
    },
    {
      label: "Studio Identity",
      href: "/admin/settings",
      icon: Settings,
      match: currentPath.startsWith("/admin/settings"),
    },
  ];

  const PORTAL_ITEMS = [
    {
      label: "Clients Hub",
      href: "/admin/clients",
      icon: Users,
      count: badgeCounts?.clients,
      match: currentPath.startsWith("/admin/clients"),
      badge: "Accounts",
    },
    {
      label: "Invoices & Billing",
      href: "/admin/invoices",
      icon: Receipt,
      count: badgeCounts?.invoices,
      match: currentPath.startsWith("/admin/invoices"),
      badge: "FinOps",
    },
    {
      label: "Dev Telemetry",
      href: "/admin/dev",
      icon: Activity,
      pulse: true,
      match: currentPath.startsWith("/admin/dev"),
      badge: "Live",
    },
    {
      label: "Chalk Lab",
      href: "/admin/chalk-lab",
      icon: Sparkles,
      match: currentPath.startsWith("/admin/chalk-lab"),
      badge: "Graphics",
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#22211f]/10 dark:border-white/10 bg-white dark:bg-[#16171b] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="p-1 rounded-md text-[#22211f]/60 dark:text-white/60 hover:text-[#d94e34]"
            title="Return to Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-serif font-bold text-sm text-[#22211f] dark:text-white">
            Studio & Portal
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs"
        />
      )}

      {/* Vertical Sidebar on Left */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 lg:w-72 shrink-0 border-r border-[#22211f]/10 dark:border-white/10 bg-white/95 dark:bg-[#16171b]/95 backdrop-blur-md z-50 flex flex-col justify-between p-5 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Branding & Return Link */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#22211f]/10 dark:border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#22211f]/60 dark:text-white/60 hover:text-[#d94e34] dark:hover:text-[#f87171] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Site</span>
            </Link>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Session Active" />
          </div>

          <div className="pt-4 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#d94e34] dark:text-[#f87171] font-semibold">
                Studio Console
              </span>
              <span className="text-[#22211f]/30 dark:text-white/30 text-xs">//</span>
              <span className="font-mono text-[9px] text-[#22211f]/50 dark:text-white/50">
                Akshat Dhaundiyal
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-[#22211f] dark:text-white tracking-tight mt-0.5">
              Workbench Suite
            </h2>
          </div>

          {/* Navigation Groups */}
          <nav className="mt-6 space-y-6">
            {/* GROUP 1: PERSONAL CREATIVE STUDIO */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#22211f]/40 dark:text-white/40">
                <Sparkles className="w-3 h-3 text-[#d94e34]" />
                <span>Personal Studio</span>
              </div>

              <div className="space-y-1">
                {STUDIO_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono tracking-wide transition-all ${
                        item.match
                          ? "bg-[#d94e34] text-white font-semibold shadow-xs"
                          : "text-[#22211f]/70 dark:text-white/70 hover:bg-[#22211f]/5 dark:hover:bg-white/5 hover:text-[#22211f] dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>

                      {typeof item.count === "number" ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                            item.match
                              ? "bg-white/20 text-white"
                              : "bg-[#22211f]/5 dark:bg-white/10 text-[#22211f]/60 dark:text-white/60"
                          }`}
                        >
                          {item.count}
                        </span>
                      ) : item.badge ? (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                            item.match
                              ? "bg-white/20 text-white"
                              : "text-[#22211f]/40 dark:text-white/40"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* GROUP 2: CLIENT TRANSPARENCY PORTAL */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#22211f]/40 dark:text-white/40">
                <Building2 className="w-3 h-3 text-[#27ae60]" />
                <span>Client Portal</span>
              </div>

              <div className="space-y-1">
                {PORTAL_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono tracking-wide transition-all ${
                        item.match
                          ? "bg-[#22211f] dark:bg-white text-white dark:text-[#121316] font-semibold shadow-xs"
                          : "text-[#22211f]/70 dark:text-white/70 hover:bg-[#22211f]/5 dark:hover:bg-white/5 hover:text-[#22211f] dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>

                      {typeof item.count === "number" ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                            item.match
                              ? "bg-white/20 dark:bg-black/10 text-white dark:text-[#121316]"
                              : "bg-[#22211f]/5 dark:bg-white/10 text-[#22211f]/60 dark:text-white/60"
                          }`}
                        >
                          {item.count}
                        </span>
                      ) : item.pulse ? (
                        <span className="w-2 h-2 rounded-full bg-[#27ae60] animate-pulse" />
                      ) : item.badge ? (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                            item.match
                              ? "bg-white/20 text-white"
                              : "text-[#22211f]/40 dark:text-white/40"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom User Context & Sign Out */}
        <div className="pt-4 border-t border-[#22211f]/10 dark:border-white/10 space-y-3">
          {user && (
            <div className="p-3 rounded-xl bg-[#22211f]/3 dark:bg-white/3 border border-[#22211f]/5 dark:border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-serif text-xs font-semibold text-[#22211f] dark:text-white line-clamp-1">
                  {user.displayName}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#d94e34] dark:text-[#f87171] font-medium">
                  {user.badge}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Connected" />
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono text-[#22211f]/60 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
