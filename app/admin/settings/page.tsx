"use client";

import React, { useState, useEffect } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import {
  Settings,
  User,
  Shield,
  Key,
  Globe,
  Github,
  BookOpen,
  Trello,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import type { WorkspaceSettings } from "@/lib/settings";
import type { AuthUser } from "@/lib/auth";

export default function AdminSettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showPasscodes, setShowPasscodes] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchSettings();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.authenticated) setUser(data.user);
    } catch {}
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data && !data.error) {
        setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = user?.role === "superadmin";
  const canSave = user?.role === "superadmin" || user?.role === "admin";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) {
      setFeedback({
        type: "error",
        message: "Read-only access. You need an Admin or Super Admin role to save workspace configuration.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update settings");
      }

      setFeedback({ type: "success", message: "Workspace settings updated successfully." });
      if (data.settings) setSettings(data.settings);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece9e2] font-sans antialiased selection:bg-[#d94e34]/20">
      {/* Studio Left Sidebar */}
      <StudioNavbar activeRoute="/admin/settings" userRole={user?.role} />

      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-5xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#22211f]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#d94e34]/10 text-[#d94e34] dark:bg-[#d94e34]/20 border border-[#d94e34]/20 mb-3">
              <Settings className="w-3.5 h-3.5" />
              <span>Milestones 12 & 17 • Studio Workspace Config</span>
            </div>
            <h1 className="text-3xl font-serif tracking-tight text-[#22211f] dark:text-white">
              Workspace & Security Settings
            </h1>
            <p className="text-sm text-[#22211f]/60 dark:text-white/60 mt-1">
              Configure profile identity, cross-platform publishing tokens, and role security credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!canSave || saving || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-6 p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 border ${
              feedback.type === "success"
                ? "bg-[#27ae60]/10 border-[#27ae60]/20 text-[#27ae60]"
                : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {loading || !settings ? (
          <div className="p-16 text-center text-xs font-mono text-[#22211f]/40 dark:text-white/40">
            Loading workspace configuration...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 mt-8">
            {/* 1. Profile & Studio Identity */}
            <div className="bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#22211f]/10 dark:border-white/10 mb-6">
                <User className="w-5 h-5 text-[#d94e34]" />
                <div>
                  <h2 className="text-base font-serif font-bold text-[#22211f] dark:text-white">
                    Studio Identity & Bio
                  </h2>
                  <p className="text-xs text-[#22211f]/60 dark:text-white/60">
                    Public-facing metadata, greeting badges, and institutional credentials.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    disabled={!canSave}
                    value={settings.displayName}
                    onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    disabled={!canSave}
                    value={settings.headline}
                    onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Executive Biography
                  </label>
                  <textarea
                    rows={3}
                    disabled={!canSave}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Location & Timezone Badge
                  </label>
                  <input
                    type="text"
                    disabled={!canSave}
                    value={settings.locationPill}
                    onChange={(e) => setSettings({ ...settings, locationPill: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Education & Research Badge
                  </label>
                  <input
                    type="text"
                    disabled={!canSave}
                    value={settings.educationBadge}
                    onChange={(e) => setSettings({ ...settings, educationBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Direct Contact Email
                  </label>
                  <input
                    type="email"
                    disabled={!canSave}
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono focus:outline-hidden focus:border-[#d94e34]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Last Configuration Update
                  </label>
                  <input
                    type="text"
                    disabled
                    value={settings.lastUpdated}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee]/60 dark:bg-[#121316]/60 border border-[#22211f]/5 dark:border-white/5 text-[#22211f]/50 dark:text-white/50 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Platform Integrations */}
            <div className="bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#22211f]/10 dark:border-white/10 mb-6">
                <Globe className="w-5 h-5 text-[#d94e34]" />
                <div>
                  <h2 className="text-base font-serif font-bold text-[#22211f] dark:text-white">
                    Syndication & Automation Integrations
                  </h2>
                  <p className="text-xs text-[#22211f]/60 dark:text-white/60">
                    Tokens for GitHub live telemetry, Medium article syndication, and Trello boards.
                  </p>
                </div>
              </div>

              <div className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-[#22211f] dark:text-white" />
                      <span>GitHub Handle</span>
                    </label>
                    <input
                      type="text"
                      disabled={!canSave}
                      value={settings.githubUsername}
                      onChange={(e) => setSettings({ ...settings, githubUsername: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono focus:outline-hidden focus:border-[#d94e34]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#e67e22]" />
                      <span>GitHub Personal Token (Telemetry)</span>
                    </label>
                    <input
                      type="password"
                      disabled={!canSave}
                      value={settings.githubToken}
                      onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
                      placeholder="ghp_••••••••••••••••••••••••••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono focus:outline-hidden focus:border-[#d94e34]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#27ae60]" />
                      <span>Medium Integration Token (Articles)</span>
                    </label>
                    <input
                      type="password"
                      disabled={!canSave}
                      value={settings.mediumToken}
                      onChange={(e) => setSettings({ ...settings, mediumToken: e.target.value })}
                      placeholder="Integration token for 1-click cross-publishing"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono focus:outline-hidden focus:border-[#d94e34]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5 flex items-center gap-1.5">
                      <Trello className="w-3.5 h-3.5 text-[#2980b9]" />
                      <span>Trello Kanban Board URL</span>
                    </label>
                    <input
                      type="url"
                      disabled={!canSave}
                      value={settings.trelloBoardUrl}
                      onChange={(e) => setSettings({ ...settings, trelloBoardUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono focus:outline-hidden focus:border-[#d94e34]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Role Passcodes & Access Control */}
            <div className="bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#22211f]/10 dark:border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-[#d94e34]" />
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#22211f] dark:text-white">
                      Access Control & Passcodes
                    </h2>
                    <p className="text-xs text-[#22211f]/60 dark:text-white/60">
                      Tiered credentials governing studio write-actions and API financial data masking.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasscodes(!showPasscodes)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#22211f]/70 dark:text-white/70 border border-[#22211f]/10 dark:border-white/10 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
                >
                  {showPasscodes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasscodes ? "Hide" : "Reveal"}</span>
                </button>
              </div>

              {!isSuperAdmin && (
                <div className="mb-6 p-3 rounded-lg bg-[#e67e22]/10 border border-[#e67e22]/20 text-[#e67e22] text-xs font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    Passcodes are masked for non-Super Admin roles. Contact the workspace owner to update passcodes.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-mono">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Super Admin Passcode
                  </label>
                  <input
                    type={showPasscodes ? "text" : "password"}
                    disabled={!isSuperAdmin}
                    value={settings.rolesConfig?.superAdminPasscode || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rolesConfig: { ...settings.rolesConfig, superAdminPasscode: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34] disabled:opacity-60"
                  />
                  <p className="text-[10px] text-[#22211f]/40 dark:text-white/40 mt-1 font-sans">
                    Grants full root privileges and financial unmasking.
                  </p>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Admin Passcode
                  </label>
                  <input
                    type={showPasscodes ? "text" : "password"}
                    disabled={!isSuperAdmin}
                    value={settings.rolesConfig?.adminPasscode || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rolesConfig: { ...settings.rolesConfig, adminPasscode: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34] disabled:opacity-60"
                  />
                  <p className="text-[10px] text-[#22211f]/40 dark:text-white/40 mt-1 font-sans">
                    Allows creating & editing projects, blogs, clients, and invoices.
                  </p>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1.5">
                    Dev / Telemetry Passcode
                  </label>
                  <input
                    type={showPasscodes ? "text" : "password"}
                    disabled={!isSuperAdmin}
                    value={settings.rolesConfig?.devPasscode || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rolesConfig: { ...settings.rolesConfig, devPasscode: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white focus:outline-hidden focus:border-[#d94e34] disabled:opacity-60"
                  />
                  <p className="text-[10px] text-[#22211f]/40 dark:text-white/40 mt-1 font-sans">
                    Enables viewing system health diagnostics and telemetry pings.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#22211f]/10 dark:border-white/10">
              <span className="text-xs text-[#22211f]/50 dark:text-white/50 font-mono">
                {canSave
                  ? "Changes will immediately update the active runtime memory cache."
                  : "Sign in with Admin or Super Admin passcodes to commit changes."}
              </span>
              <button
                type="submit"
                disabled={!canSave || saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
