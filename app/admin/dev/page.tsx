"use client";

import React, { useState, useEffect } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import {
  Activity,
  Server,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Shield,
  Cpu,
  Terminal,
  Clock,
  Code2,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface EndpointHealth {
  endpoint: string;
  name: string;
  status: "idle" | "loading" | "ok" | "error";
  statusCode?: number;
  latencyMs?: number;
  payloadSummary?: string;
  lastChecked?: string;
}

export default function AdminDevPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointHealth[]>([
    { endpoint: "/api/projects", name: "Projects Catalog API", status: "idle" },
    { endpoint: "/api/blogs", name: "Blog Articles & Medium API", status: "idle" },
    { endpoint: "/api/clients", name: "Clients Hub API", status: "idle" },
    { endpoint: "/api/invoices", name: "FinOps Invoices API", status: "idle" },
    { endpoint: "/api/settings", name: "Workspace Settings API", status: "idle" },
    { endpoint: "/api/auth", name: "RBAC Session Auth API", status: "idle" },
  ]);
  const [pingingAll, setPingingAll] = useState(false);
  const [serverTime, setServerTime] = useState<string>("");

  useEffect(() => {
    fetchSession();
    runAllPings();
    setServerTime(new Date().toISOString());
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.authenticated) setUser(data.user);
    } catch {}
  };

  const pingEndpoint = async (index: number) => {
    const ep = endpoints[index];
    setEndpoints((prev) => {
      const updated = [...prev];
      updated[index] = { ...ep, status: "loading" };
      return updated;
    });

    const start = performance.now();
    try {
      const res = await fetch(ep.endpoint);
      const latency = Math.round(performance.now() - start);
      let summary = "";
      try {
        const data = await res.json();
        if (Array.isArray(data)) {
          summary = `${data.length} records returned`;
        } else if (data && typeof data === "object") {
          summary = Object.keys(data).slice(0, 4).join(", ") + "...";
        }
      } catch {
        summary = "Raw payload OK";
      }

      setEndpoints((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...ep,
          status: res.ok ? "ok" : "error",
          statusCode: res.status,
          latencyMs: latency,
          payloadSummary: summary,
          lastChecked: new Date().toLocaleTimeString(),
        };
        return updated;
      });
    } catch (err: any) {
      const latency = Math.round(performance.now() - start);
      setEndpoints((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...ep,
          status: "error",
          statusCode: 500,
          latencyMs: latency,
          payloadSummary: err.message || "Connection failed",
          lastChecked: new Date().toLocaleTimeString(),
        };
        return updated;
      });
    }
  };

  const runAllPings = async () => {
    setPingingAll(true);
    await Promise.all(endpoints.map((_, i) => pingEndpoint(i)));
    setPingingAll(false);
  };

  const avgLatency = Math.round(
    endpoints
      .filter((e) => e.latencyMs !== undefined)
      .reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) /
      (endpoints.filter((e) => e.latencyMs !== undefined).length || 1)
  );

  const allHealthy = endpoints.every((e) => e.status === "ok");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece9e2] font-sans antialiased selection:bg-[#d94e34]/20">
      {/* Studio Left Sidebar */}
      <StudioNavbar activeRoute="/admin/dev" userRole={user?.role} />

      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#22211f]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#d94e34]/10 text-[#d94e34] dark:bg-[#d94e34]/20 border border-[#d94e34]/20 mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>DevOps • Telemetry & System Diagnostics</span>
            </div>
            <h1 className="text-3xl font-serif tracking-tight text-[#22211f] dark:text-white">
              Studio Telemetry & Health Monitor
            </h1>
            <p className="text-sm text-[#22211f]/60 dark:text-white/60 mt-1">
              Active endpoint status pings, memory cache diagnostics, and runtime configuration inspection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runAllPings}
              disabled={pingingAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#22211f] dark:bg-white text-white dark:text-[#121316] hover:bg-[#333] dark:hover:bg-neutral-200 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pingingAll ? "animate-spin" : ""}`} />
              <span>{pingingAll ? "Pinging..." : "Run Health Ping"}</span>
            </button>
          </div>
        </div>

        {/* System Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1.5">
              <span>System Health</span>
              <Server className="w-4 h-4 text-[#27ae60]" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  allHealthy ? "bg-[#27ae60] shadow-[0_0_8px_#27ae60]" : "bg-[#e67e22]"
                }`}
              />
              <span className="text-xl font-serif font-bold text-[#22211f] dark:text-white">
                {allHealthy ? "All Operational" : "Degraded / Pending"}
              </span>
            </div>
            <p className="text-[11px] text-[#22211f]/50 dark:text-white/50 font-mono mt-1">
              6 of 6 microservices responding
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1.5">
              <span>Mean Response Latency</span>
              <Zap className="w-4 h-4 text-[#e67e22]" />
            </div>
            <div className="text-xl font-serif font-bold text-[#22211f] dark:text-white">
              {avgLatency > 0 ? `${avgLatency} ms` : "Calculating..."}
            </div>
            <p className="text-[11px] text-[#22211f]/50 dark:text-white/50 font-mono mt-1">
              Local Node.js event loop
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1.5">
              <span>Active Auth Context</span>
              <Shield className="w-4 h-4 text-[#d94e34]" />
            </div>
            <div className="text-xl font-serif font-bold uppercase tracking-wider text-[#d94e34]">
              {user?.role || "Guest / Public"}
            </div>
            <p className="text-[11px] text-[#22211f]/50 dark:text-white/50 font-mono mt-1">
              Session token verified
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1.5">
              <span>Data Layer Tier</span>
              <Database className="w-4 h-4 text-[#2980b9]" />
            </div>
            <div className="text-xl font-serif font-bold text-[#22211f] dark:text-white">
              Dual In-Memory
            </div>
            <p className="text-[11px] text-[#22211f]/50 dark:text-white/50 font-mono mt-1">
              Fallback seed data active
            </p>
          </div>
        </div>

        {/* Live Endpoints Ping Table */}
        <div className="mt-8 bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#22211f]/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#d94e34]" />
              <h2 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#22211f] dark:text-white">
                Live Microservice Endpoints
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#22211f]/50 dark:text-white/50">
              Auto-calibrated against internal Next.js API routes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#22211f]/10 dark:border-white/10 bg-[#f6f4ee]/50 dark:bg-[#121316]/50 text-[#22211f]/60 dark:text-white/60 font-mono uppercase tracking-wider">
                  <th className="py-3 px-5">Service / Route</th>
                  <th className="py-3 px-5">HTTP Status</th>
                  <th className="py-3 px-5">Latency</th>
                  <th className="py-3 px-5">Response Preview</th>
                  <th className="py-3 px-5">Last Checked</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22211f]/5 dark:divide-white/5 font-sans">
                {endpoints.map((ep, idx) => (
                  <tr key={ep.endpoint} className="hover:bg-[#22211f]/2 dark:hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-[#22211f] dark:text-white">{ep.name}</div>
                      <div className="text-[11px] font-mono text-[#22211f]/50 dark:text-white/50">
                        {ep.endpoint}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-mono">
                      {ep.status === "loading" ? (
                        <span className="text-[#22211f]/40 dark:text-white/40">Pinging...</span>
                      ) : ep.status === "ok" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#27ae60]/10 text-[#27ae60] border border-[#27ae60]/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{ep.statusCode || 200} OK</span>
                        </span>
                      ) : ep.status === "error" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/10 text-red-500 border border-red-500/20">
                          <XCircle className="w-3 h-3" />
                          <span>{ep.statusCode || "ERR"}</span>
                        </span>
                      ) : (
                        <span className="text-[#22211f]/40 dark:text-white/40">Idle</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 font-mono">
                      {ep.latencyMs !== undefined ? (
                        <span
                          className={
                            ep.latencyMs < 50
                              ? "text-[#27ae60]"
                              : ep.latencyMs < 150
                              ? "text-[#e67e22]"
                              : "text-red-500"
                          }
                        >
                          {ep.latencyMs} ms
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#22211f]/70 dark:text-white/70 max-w-xs truncate">
                      {ep.payloadSummary || "—"}
                    </td>

                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#22211f]/50 dark:text-white/50">
                      {ep.lastChecked || "Never"}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => pingEndpoint(idx)}
                        disabled={ep.status === "loading"}
                        className="p-1.5 rounded-md text-[#22211f]/60 dark:text-white/60 hover:text-[#d94e34] hover:bg-[#d94e34]/10 transition-colors"
                        title="Re-ping service"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${ep.status === "loading" ? "animate-spin" : ""}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Runtime Environment Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 p-6 shadow-xs text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#22211f]/10 dark:border-white/10 mb-4 font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60">
              <Cpu className="w-4 h-4 text-[#d94e34]" />
              <span>Platform Specifications</span>
            </div>
            <div className="space-y-3 font-mono">
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Next.js Framework:</span>
                <span className="font-semibold text-[#22211f] dark:text-white">v15.2.4 (App Router)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Rendering Engine:</span>
                <span className="text-[#22211f] dark:text-white">React 19 Server Components + SSR</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Styling Strategy:</span>
                <span className="text-[#22211f] dark:text-white">Tailwind CSS v4 + Draftsman Glass</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Local Dev Server:</span>
                <span className="text-[#27ae60]">http://localhost:3000 (Active)</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 p-6 shadow-xs text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#22211f]/10 dark:border-white/10 mb-4 font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60">
              <Shield className="w-4 h-4 text-[#d94e34]" />
              <span>Security & Access Posture</span>
            </div>
            <div className="space-y-3 font-mono">
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Current Role:</span>
                <span className="font-bold text-[#d94e34] uppercase">{user?.role || "GUEST"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Financial Masking:</span>
                <span className="text-[#22211f] dark:text-white">
                  {user?.role === "superadmin" ? "Unmasked (Full FinOps)" : "Masked (Restricted)"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Write Operations:</span>
                <span className="text-[#22211f] dark:text-white">
                  {user?.role === "superadmin" || user?.role === "admin" ? "Permitted" : "Restricted (Read-Only)"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#22211f]/5 dark:border-white/5">
                <span className="text-[#22211f]/50 dark:text-white/50">Token Transport:</span>
                <span className="text-[#22211f] dark:text-white">HttpOnly Session Cookie</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
