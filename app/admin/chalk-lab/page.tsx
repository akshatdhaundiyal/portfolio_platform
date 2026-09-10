"use client";

import React, { useState } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import ChalkAnnotation, { ChalkAnnotationType, ChalkTrigger } from "@/components/chalk/ChalkAnnotation";
import ChalkArrow, { ChalkArrowDirection } from "@/components/chalk/ChalkArrow";
import ChalkBadge from "@/components/chalk/ChalkBadge";
import ChalkSvgDiagram from "@/components/chalk/ChalkSvgDiagram";
import {
  Sparkles,
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Layers,
  Code2,
  FileCode2,
  Eye,
  Terminal,
  Palette,
  ArrowRight,
  BookmarkCheck,
} from "lucide-react";

export default function ChalkLabPage() {
  const [activeTab, setActiveTab] = useState<"annotations" | "arrows" | "diagrams">("annotations");

  // Annotation Sandbox State
  const [annoType, setAnnoType] = useState<ChalkAnnotationType>("circle");
  const [annoColor, setAnnoColor] = useState<string>("#d94e34");
  const [annoTrigger, setAnnoTrigger] = useState<ChalkTrigger>("mount");
  const [annoStrokeWidth, setAnnoStrokeWidth] = useState<number>(2.2);
  const [annoRoughness, setAnnoRoughness] = useState<number>(1.6);
  const [annoDuration, setAnnoDuration] = useState<number>(0.45);
  const [annoText, setAnnoText] = useState<string>("+$12M premium lift");
  const [annoSeed, setAnnoSeed] = useState<number>(42);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Arrow & Badge Sandbox State
  const [arrowDirection, setArrowDirection] = useState<ChArrowDirection>("curve-right-down");
  const [arrowColor, setArrowColor] = useState<string>("#f59e0b");
  const [arrowLabel, setArrowLabel] = useState<string>("12ms latency");
  const [badgeText, setBadgeText] = useState<string>("PROD READY");
  const [badgeColor, setBadgeColor] = useState<string>("#10b981");

  // Diagram Sandbox State
  const [diagramSource, setDiagramSource] = useState<"sample" | "custom">("sample");
  const [customSvgCode, setCustomSvgCode] = useState<string>("");
  const [diagramStagger, setDiagramStagger] = useState<number>(0.06);
  const [diagramDuration, setDiagramDuration] = useState<number>(0.4);
  const [diagramReplayKey, setDiagramReplayKey] = useState<number>(0);
  const [studioBackground, setStudioBackground] = useState<"blackboard" | "paper">("blackboard");

  const colorPresets = [
    { name: "Terracotta Red", value: "#d94e34" },
    { name: "Amber Chalk", value: "#f59e0b" },
    { name: "Emerald Chalk", value: "#10b981" },
    { name: "Sky Cyan", value: "#38bdf8" },
    { name: "Powder White", value: "#f3ede2" },
    { name: "Charcoal Slate", value: "#292524" },
  ];

  type ChArrowDirection =
    | "right"
    | "left"
    | "up"
    | "down"
    | "curve-right-down"
    | "curve-left-down"
    | "loop-right";

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getAnnotationCode = () => {
    return `<ChalkAnnotation
  type="${annoType}"
  color="${annoColor}"
  trigger="${annoTrigger}"
  strokeWidth={${annoStrokeWidth}}
  roughness={${annoRoughness}}
  duration={${annoDuration}}
>
  ${annoText}
</ChalkAnnotation>`;
  };

  const getArrowCode = () => {
    return `<ChalkArrow
  direction="${arrowDirection}"
  color="${arrowColor}"
  label="${arrowLabel}"
  trigger="inView"
/>`;
  };

  const getBadgeCode = () => {
    return `<ChalkBadge
  color="${badgeColor}"
  trigger="inView"
>
  ${badgeText}
</ChalkBadge>`;
  };

  const getDiagramCode = () => {
    return `<ChalkSvgDiagram
  src="/chalk-diagrams/ml-pipeline-sample.svg"
  trigger="inView"
  stagger={${diagramStagger}}
  strokeDuration={${diagramDuration}}
  colorMode="adaptive"
  showControls
/>`;
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 font-sans pb-24">
      {/* Studio Header Bar */}
      <StudioNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>DEVELOPER VELOCITY LAB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Chalk Studio &amp; Animation Lab
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Rapidly author, tune, and test hand-drawn UI annotations, chalk connectors, and Excalidraw diagrams with authentic chalkboard grit.
            </p>
          </div>

          {/* Theme Environment Toggle */}
          <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-lg border border-white/10 text-xs font-mono">
            <span className="text-neutral-400 px-2">Backdrop:</span>
            <button
              onClick={() => setStudioBackground("blackboard")}
              className={`px-3 py-1.5 rounded transition-all ${
                studioBackground === "blackboard"
                  ? "bg-[#181920] text-amber-400 shadow font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Blackboard
            </button>
            <button
              onClick={() => setStudioBackground("paper")}
              className={`px-3 py-1.5 rounded transition-all ${
                studioBackground === "paper"
                  ? "bg-[#f4ede2] text-neutral-900 shadow font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Graph Paper
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 text-sm font-mono">
          <button
            onClick={() => setActiveTab("annotations")}
            className={`pb-3 px-4 border-b-2 font-medium transition-all ${
              activeTab === "annotations"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            1. Text Annotations (Circles &amp; Underlines)
          </button>
          <button
            onClick={() => setActiveTab("arrows")}
            className={`pb-3 px-4 border-b-2 font-medium transition-all ${
              activeTab === "arrows"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            2. Chalk Arrows &amp; Callout Badges
          </button>
          <button
            onClick={() => setActiveTab("diagrams")}
            className={`pb-3 px-4 border-b-2 font-medium transition-all ${
              activeTab === "diagrams"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            3. Excalidraw &amp; SVG Diagram Animator
          </button>
        </div>

        {/* TAB 1: ANNOTATIONS SANDBOX */}
        {activeTab === "annotations" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Canvas Preview */}
            <div className="lg:col-span-7 space-y-6">
              <div
                className={`p-10 rounded-2xl border transition-all duration-300 min-h-[380px] flex flex-col justify-center items-center text-center relative overflow-hidden ${
                  studioBackground === "blackboard"
                    ? "bg-[#14151b] border-white/10 text-[#f3ede2]"
                    : "bg-[#f4ede2] border-neutral-300 text-neutral-900"
                }`}
              >
                {/* Visual Label */}
                <span className="absolute top-4 left-4 font-mono text-xs opacity-50 uppercase tracking-widest">
                  Live Rendering Preview
                </span>

                <div className="space-y-6 max-w-xl">
                  <p className="text-xl sm:text-2xl font-serif leading-relaxed">
                    Delivered actuarial pricing adjustments generating{" "}
                    <ChalkAnnotation
                      key={`${annoType}-${annoSeed}-${annoColor}-${annoStrokeWidth}-${annoRoughness}`}
                      type={annoType}
                      color={annoColor}
                      trigger={annoTrigger}
                      strokeWidth={annoStrokeWidth}
                      roughness={annoRoughness}
                      duration={annoDuration}
                      className="font-bold cursor-pointer"
                    >
                      {annoText}
                    </ChalkAnnotation>{" "}
                    with real-time statistical rigor.
                  </p>

                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setAnnoSeed((s) => s + 1)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        studioBackground === "blackboard"
                          ? "border-white/20 bg-white/5 hover:bg-white/10 text-neutral-200"
                          : "border-neutral-400 bg-black/5 hover:bg-black/10 text-neutral-800"
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-seed Organic Jitter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Generated Code Snippet */}
              <div className="rounded-xl border border-white/10 bg-[#090a0f] overflow-hidden">
                <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between font-mono text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-neutral-200 font-medium">Ready-to-Use JSX</span>
                  </div>
                  <button
                    onClick={() => handleCopy("annotation", getAnnotationCode())}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-all"
                  >
                    {copiedKey === "annotation" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy JSX</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-amber-200/90 overflow-x-auto">
                  <code>{getAnnotationCode()}</code>
                </pre>
              </div>
            </div>

            {/* Controls & Tweaks Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-[#121318] space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-sm text-neutral-200 font-semibold">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Annotation Parameters</span>
                </div>

                {/* Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Annotation Shape
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["circle", "underline", "box", "bracket", "strike", "highlight"] as ChalkAnnotationType[]).map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setAnnoType(t)}
                          className={`px-3 py-2 rounded-lg text-xs font-mono capitalize border transition-all ${
                            annoType === t
                              ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                              : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                          }`}
                        >
                          {t}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Chalk Color Palette
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPresets.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setAnnoColor(c.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          annoColor === c.value ? "scale-125 border-white shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Target Text Input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Annotated Text Content
                  </label>
                  <input
                    type="text"
                    value={annoText}
                    onChange={(e) => setAnnoText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Sliders: Duration, Stroke, Roughness */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Draw Duration: {annoDuration}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={annoDuration}
                      onChange={(e) => setAnnoDuration(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Stroke Thickness: {annoStrokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.2"
                      value={annoStrokeWidth}
                      onChange={(e) => setAnnoStrokeWidth(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Roughness / Wobble: {annoRoughness}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={annoRoughness}
                      onChange={(e) => setAnnoRoughness(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                {/* Trigger Mode */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Trigger Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["mount", "hover", "inView"] as ChalkTrigger[]).map((tr) => (
                      <button
                        key={tr}
                        onClick={() => setAnnoTrigger(tr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase border transition-all ${
                          annoTrigger === tr
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                            : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARROWS & BADGES SANDBOX */}
        {activeTab === "arrows" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {/* Preview Box */}
              <div
                className={`p-10 rounded-2xl border transition-all min-h-[380px] flex flex-col justify-center items-center text-center relative overflow-hidden ${
                  studioBackground === "blackboard"
                    ? "bg-[#14151b] border-white/10 text-[#f3ede2]"
                    : "bg-[#f4ede2] border-neutral-300 text-neutral-900"
                }`}
              >
                <span className="absolute top-4 left-4 font-mono text-xs opacity-50 uppercase tracking-widest">
                  Connectors &amp; Badges Preview
                </span>

                <div className="space-y-8 flex flex-col items-center">
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm opacity-80">Feature Pipeline</span>
                    <ChalkArrow
                      direction={arrowDirection}
                      color={arrowColor}
                      label={arrowLabel}
                      trigger="mount"
                      width={80}
                      height={40}
                    />
                    <span className="font-mono text-sm opacity-80">Model Inference</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <ChalkBadge color={badgeColor} trigger="mount">
                      {badgeText}
                    </ChalkBadge>

                    <ChalkBadge color="#d94e34" trigger="mount" rotation={2}>
                      +$12M IMPACT
                    </ChalkBadge>

                    <ChalkBadge color="#38bdf8" trigger="mount" rotation={-2}>
                      99.98% UPTIME
                    </ChalkBadge>
                  </div>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                    <span className="text-amber-400 font-semibold">&lt;ChalkArrow /&gt;</span>
                    <button
                      onClick={() => handleCopy("arrow", getArrowCode())}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px]"
                    >
                      {copiedKey === "arrow" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-amber-200/90 overflow-x-auto">
                    <code>{getArrowCode()}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                    <span className="text-amber-400 font-semibold">&lt;ChalkBadge /&gt;</span>
                    <button
                      onClick={() => handleCopy("badge", getBadgeCode())}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px]"
                    >
                      {copiedKey === "badge" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-amber-200/90 overflow-x-auto">
                    <code>{getBadgeCode()}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Arrow & Badge Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-[#121318] space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-sm text-neutral-200 font-semibold">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Arrow &amp; Badge Settings</span>
                </div>

                {/* Arrow Direction */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Arrow Trajectory
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "right",
                        "left",
                        "down",
                        "up",
                        "curve-right-down",
                        "curve-left-down",
                        "loop-right",
                      ] as ChArrowDirection[]
                    ).map((dir) => (
                      <button
                        key={dir}
                        onClick={() => setArrowDirection(dir)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                          arrowDirection === dir
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                            : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arrow Label */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Arrow Callout Label
                  </label>
                  <input
                    type="text"
                    value={arrowLabel}
                    onChange={(e) => setArrowLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Badge Text */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIAGRAM ANIMATOR (EXCALIDRAW / SVG) */}
        {activeTab === "diagrams" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Diagram Live Render Canvas */}
              <div
                className={`p-8 rounded-2xl border transition-all relative overflow-hidden ${
                  studioBackground === "blackboard"
                    ? "bg-[#14151b] border-white/10"
                    : "bg-[#f4ede2] border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs opacity-60 uppercase tracking-widest text-neutral-400">
                    Hand-drawn SVG Sequential Stroke Animator
                  </span>
                  <button
                    onClick={() => setDiagramReplayKey((k) => k + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Sequence</span>
                  </button>
                </div>

                {/* SVG Renderer Component */}
                <ChalkSvgDiagram
                  key={diagramReplayKey}
                  src={diagramSource === "sample" ? "/chalk-diagrams/ml-pipeline-sample.svg" : undefined}
                  svgContent={diagramSource === "custom" ? customSvgCode : undefined}
                  trigger="mount"
                  stagger={diagramStagger}
                  strokeDuration={diagramDuration}
                  colorMode="adaptive"
                  showControls={false}
                />
              </div>

              {/* Ready-to-use Code */}
              <div className="rounded-xl border border-white/10 bg-[#090a0f] p-4 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                  <span className="text-cyan-400 font-semibold">Production Diagram JSX</span>
                  <button
                    onClick={() => handleCopy("diagram", getDiagramCode())}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-200 text-xs"
                  >
                    {copiedKey === "diagram" ? "Copied!" : "Copy JSX"}
                  </button>
                </div>
                <pre className="text-xs font-mono text-cyan-200/90 overflow-x-auto">
                  <code>{getDiagramCode()}</code>
                </pre>
              </div>
            </div>

            {/* Diagram Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-[#121318] space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-sm text-neutral-200 font-semibold">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Diagram Playback Settings</span>
                </div>

                {/* Source Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Diagram Source
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDiagramSource("sample")}
                      className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                        diagramSource === "sample"
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                      }`}
                    >
                      Sample Pipeline
                    </button>
                    <button
                      onClick={() => setDiagramSource("custom")}
                      className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                        diagramSource === "custom"
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                      }`}
                    >
                      Paste SVG
                    </button>
                  </div>
                </div>

                {diagramSource === "custom" && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Paste Raw SVG Code (from Excalidraw/Figma)
                    </label>
                    <textarea
                      rows={6}
                      value={customSvgCode}
                      onChange={(e) => setCustomSvgCode(e.target.value)}
                      placeholder="<svg ...> ... </svg>"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Stagger & Duration */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Stroke Draw Time: {diagramDuration}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={diagramDuration}
                      onChange={(e) => setDiagramDuration(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Stagger Delay: {diagramStagger}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.25"
                      step="0.01"
                      value={diagramStagger}
                      onChange={(e) => setDiagramStagger(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-400 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Excalidraw Workflow Tip</span>
                  </div>
                  <p className="leading-relaxed">
                    Draw your architecture in Excalidraw, choose <strong>Export to SVG</strong>, save in <code>public/chalk-diagrams/</code>, and load via <code>&lt;ChalkSvgDiagram src="..." /&gt;</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
