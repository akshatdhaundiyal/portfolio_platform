"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy, ArrowUpRight, BookOpen, Terminal, Sparkles } from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "akshatdhaundiyal@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer className="w-full border-t border-black/10 dark:border-white/[0.08] bg-[#eeebe3] dark:bg-[#0c0d0f] mt-24 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top: Tactile Ticket Stub Footer */}
        <div className="bg-[#f4ede2] text-[#18181b] rounded-xl p-6 sm:p-8 shadow-xl border border-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="space-y-2">
            <div className="rubber-stamp text-[#d94e34] border-[#d94e34] text-[10px]">
              <span>COMMERCIAL INQUIRIES & ADVISORY</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight font-semibold">
              Let&apos;s build high-ROI machine learning systems.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 max-w-xl font-sans leading-relaxed">
              Open to AI Product Management (Technical / AI PM) roles, Senior Applied AI / ML Engineering, and strategic advisory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-lg bg-white border border-black/20 text-neutral-900 font-mono text-xs flex items-center justify-between gap-3 shadow-sm hover:bg-neutral-50 transition-all"
            >
              <span className="truncate">{email}</span>
              {copied ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
              )}
            </button>

            <a
              href={`mailto:${email}`}
              className="px-5 py-2.5 rounded-lg bg-[#d94e34] hover:bg-[#c43f27] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Email</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Middle: Reading List & Personal Touch */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono text-neutral-600 dark:text-neutral-400 border-b border-black/10 dark:border-white/[0.08] pb-8">
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <BookOpen className="w-3.5 h-3.5 text-[#d94e34]" />
              <span className="uppercase tracking-wider font-bold">Active Technical & Strategy Reads</span>
            </div>
            <p className="leading-relaxed font-sans text-neutral-600 dark:text-neutral-400">
              <span className="italic text-neutral-800 dark:text-neutral-200">Designing Data-Intensive Applications</span> (Kleppmann), <span className="italic text-neutral-800 dark:text-neutral-200">Chip Huyen&apos;s AI Engineering</span>, and <span className="italic text-neutral-800 dark:text-neutral-200">Working Backwards</span> (Amazon PR/FAQ).
            </p>
          </div>

          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="uppercase tracking-wider font-bold">Systems & Stack Footprint</span>
            </div>
            <p className="leading-relaxed font-mono text-neutral-600 dark:text-neutral-400">
              Next.js 15 App Router · React 19 · Prisma ORM · PostgreSQL · Docker · Google Cloud Run · Tailwind CSS.
            </p>
          </div>
        </div>

        {/* Bottom: Sitemap, Socials & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-500">
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="/work" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Case Studies
            </Link>
            <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Journey & Strategy
            </Link>
            <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Technical Papers
            </Link>
            <Link href="/admin/blogs" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Studio
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/akshatdhaundiyal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://linkedin.com/in/akshatdhaundiyal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>© {new Date().getFullYear()} Akshat Dhaundiyal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
