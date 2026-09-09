"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, Sparkles, CheckSquare, Square } from "lucide-react";

const rotatingAdjectives = [
  "auditable",
  "high-ROI",
  "statistically sound",
  "cost-calibrated",
  "human-centric",
  "transparent",
];

export default function HeroSection() {
  const [adjectiveIndex, setAdjectiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  // Rotating kinetic headline
  useEffect(() => {
    const interval = setInterval(() => {
      setAdjectiveIndex((prev) => (prev + 1) % rotatingAdjectives.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Live Timezone Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: "High-ROI enterprise machine learning (+$12M annual premium lift)", checked: true },
    { id: 2, text: "Direct commercial unit economics & cloud inference cost modeling", checked: true },
    { id: 3, text: "Mathematically transparent GLMs over black-box vanity complexity", checked: true },
    { id: 4, text: "On-device privacy & local-first zero-cloud edge architectures", checked: true },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <section className="relative pt-4 sm:pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Traditional Red Monogram Seal Stamp */}
      <div className="flex items-center justify-center mb-6">
        <div className="traditional-seal animate-stamp-drop">
          AD
        </div>
      </div>

      {/* Main Intimate Hero Metaphor (Jackie Zhang / Jackie Hu style) */}
      <div className="text-center space-y-6">
        
        {/* Location & Timezone Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/[0.04] border border-black/10 dark:border-white/[0.08] text-xs font-mono text-neutral-800 dark:text-neutral-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>India (GMT +5:30) {currentTime && `• ${currentTime}`}</span>
          <span className="text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-amber-700 dark:text-amber-300 font-medium">MBA Candidate</span>
        </div>

        {/* High-Contrast Editorial Sentence-Case Title with Handwritten Marker Keyword */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white leading-[1.2]">
          Software & AI systems should be{" "}
          <span className="font-handwritten text-4xl sm:text-6xl text-[#d94e34] inline-block -rotate-2 min-w-[200px] transition-all">
            {rotatingAdjectives[adjectiveIndex]}.
          </span>
        </h1>

        {/* Craft Definition (Jackie Hu "Verb & Noun" inspiration) */}
        <div className="max-w-2xl mx-auto text-neutral-700 dark:text-neutral-300 font-sans text-sm sm:text-base leading-relaxed space-y-3">
          <p className="italic font-serif text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
            &ldquo;AI Systems & Product Strategy (Verb & Noun): a disciplined craft where mathematical rigor meets unit economics, operational adoption, and auditable business outcomes.&rdquo;
          </p>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm">
            I bridge machine learning engineering with commercial product leadership. Former Lead Analytics Architect at EXL Service (recovered <strong>+$12M</strong> in commercial insurance audit exposure) currently pursuing an MBA to lead high-leverage AI products.
          </p>
        </div>

        {/* Interactive Operating Checklist on Taped Index Card */}
        <div className="relative mt-8 text-left bg-graph-paper rounded-xl p-5 sm:p-6 border border-[#e2d9cc] text-neutral-900 shadow-xl max-w-2xl mx-auto">
          <div className="washi-tape -top-2.5 left-8 rotate-[-2deg]" />

          <div className="flex items-center justify-between border-b border-neutral-300 pb-2.5 mb-3">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d94e34]" />
              <span>Core Operating Principles (Interactive)</span>
            </span>
            <span className="font-handwritten text-sm text-[#d94e34] font-bold">
              click to test!
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklist(item.id)}
                className={`w-full text-left p-2 rounded text-xs font-mono flex items-start gap-2.5 transition-all cursor-pointer ${
                  item.checked
                    ? "bg-white/80 border border-neutral-200 text-neutral-900"
                    : "bg-black/5 text-neutral-400 line-through"
                }`}
              >
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-[#d94e34] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
