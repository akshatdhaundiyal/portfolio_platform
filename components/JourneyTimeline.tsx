"use client";

import React from "react";
import { Compass, Cpu, Layers, Milestone, Sparkles } from "lucide-react";

export default function JourneyTimeline() {
  const stages = [
    {
      number: "01",
      badge: "ENGINEERING CORE",
      title: "Hands-on Data Scientist & Systems Builder",
      period: "2019 — 2024",
      accent: "border-cyan-500/30 text-cyan-700 dark:text-cyan-400 bg-cyan-500/10",
      description:
        "Rooted in Electronics & Communication (DSP Minor) at Manipal Institute of Technology (MIT). Shipped production actuarial GLM systems recovering +$12M annually and containerized BERT NLP pipelines on Google Vertex AI at EXL Service.",
      highlights: [
        "Frequency-Severity statistical models & Expected Audit Value matrices",
        "Sub-100ms BERT transformer inference on Vertex AI endpoints",
        "On-device YOLO computer vision & localized IoT telemetry appliances",
      ],
      icon: Cpu,
    },
    {
      number: "02",
      badge: "STRATEGY & DISCOVERY",
      title: "MBA Candidate: Tech Strategy & Unit Economics",
      period: "2024 — Present",
      accent: "border-indigo-500/30 text-indigo-700 dark:text-indigo-400 bg-indigo-500/10",
      description:
        "Bridging technical execution with commercial acumen. Deepening capabilities in AI product discovery, unit economics, market sizing, financial modeling, and go-to-market (GTM) execution.",
      highlights: [
        "Inference cost vs. latency trade-off modeling and cloud unit economics",
        "Product Requirement Documents (PRDs) and user feedback loops",
        "Enterprise stakeholder alignment & regulatory auditability frameworks",
      ],
      icon: Compass,
    },
    {
      number: "03",
      badge: "THE INTERSECTION",
      title: "AI Product Management & Technical Strategy",
      period: "Future Direction",
      accent: "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10",
      description:
        "Operating as the bilingual translation layer between machine learning engineering teams and executive leadership. Converting ambiguous business problems into rigorous, high-ROI AI architectures.",
      highlights: [
        "Translating commercial goals into measurable ML loss functions & metrics",
        "Prioritizing AI roadmaps by customer impact and compute feasibility",
        "Leading high-velocity cross-functional engineering and design pods",
      ],
      icon: Sparkles,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          <Milestone className="w-3.5 h-3.5" />
          <span>EVOLUTION & TRAJECTORY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight">
          The Journey & Leadership Timeline
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          A deliberate progression from deep mathematical modeling to commercial product leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.number}
              className="artifact-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                {/* Stage Header */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold ${stage.accent}`}>
                    STAGE {stage.number} // {stage.badge}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">{stage.period}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white leading-snug group-hover:text-[#d94e34] dark:group-hover:text-cyan-300 transition-colors">
                  {stage.title}
                </h3>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                  {stage.description}
                </p>

                {/* Key Bullet Highlights */}
                <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-black/10 dark:border-white/[0.06]">
                  {stage.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono">▸</span>
                      <span className="leading-normal">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 border-t border-black/10 dark:border-white/[0.04]">
                <span>Phase {stage.number}</span>
                <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
