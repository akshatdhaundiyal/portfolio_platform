import React from "react";
import JourneyTimeline from "@/components/JourneyTimeline";
import { ArrowUpRight, Award, BookOpen, CheckCircle2, Compass, Cpu, GraduationCap, Layers, Sparkles, Terminal } from "lucide-react";

export const metadata = {
  title: "Journey & Strategy | Akshat Dhaundiyal",
  description: "Background, 3-stage evolution, technical toolchain, and product philosophy of Akshat Dhaundiyal.",
};

const skillMatrix = [
  {
    category: "AI, Machine Learning & Vision",
    icon: Cpu,
    skills: ["YOLOv8 & Computer Vision", "PyTorch", "Actuarial GLMs (Poisson / Gamma)", "Google Vertex AI", "Hugging Face BERT", "spaCy & NER", "Sentence Transformers", "Scikit-Learn", "XGBoost"],
  },
  {
    category: "Full-Stack & Systems Architecture",
    icon: Terminal,
    skills: ["Next.js 15 (App Router)", "React 19", "FastAPI (Python)", "WebSockets (/ws)", "Docker & Cloud Run", "PostgreSQL & Prisma", "SQLite (Local Edge)", "Tailwind CSS"],
  },
  {
    category: "Product Management & MBA Strategy",
    icon: Compass,
    skills: ["AI Product Discovery", "Unit Economics & Cloud ROI", "Product Requirements (PRD)", "Underwriting Triage & Regulated ML", "Go-To-Market (GTM) Strategy", "Financial Modeling"],
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      
      {/* Top Header: Philosophy & Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-b border-white/[0.08] pb-14">
        <div className="lg:col-span-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE PROFILE & STRATEGIC TRAJECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
            Bridging Machine Learning Rigor with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200">
              Commercial Strategy.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
            I am a Data Scientist currently pursuing an MBA, positioning at the intersection of AI Product Management (Technical / AI PM) and Senior Applied AI / ML Engineering.
          </p>

          <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl border-l-2 border-indigo-500 pl-4">
            My engineering foundation is grounded in Digital Signal Processing and statistical rigor at Manipal Institute of Technology (MIT), battle-tested delivering <span className="text-emerald-400 font-mono font-semibold">+$12M</span> in premium adjustments with compound GLMs at EXL Service, and elevated through graduate business education focusing on tech strategy and unit economics.
          </p>
        </div>

        {/* Right Column: Academic & Foundation Artifact Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="artifact-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-neutral-400 border-b border-white/[0.06] pb-3">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <GraduationCap className="w-4 h-4" />
                <span>ACADEMIC FOUNDATION</span>
              </span>
              <span>2019 — 2023</span>
            </div>

            <div>
              <div className="text-lg font-semibold text-white">
                B.Tech in Electronics & Communication
              </div>
              <div className="text-xs font-mono text-cyan-300 mt-0.5">
                Manipal Institute of Technology (MIT)
              </div>
              <div className="text-xs font-mono text-neutral-400 mt-1">
                Minor: Digital Signal Processing (DSP)
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed pt-2 border-t border-white/[0.06]">
              Rigorous grounding in stochastic systems, Fourier analysis, discrete filter design, mathematical optimization, and statistical inference.
            </p>
          </div>

          <div className="artifact-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <Award className="w-4 h-4" />
              <span>CURRENT CANDIDACY</span>
            </div>
            <div className="text-base font-semibold text-white">
              Master of Business Administration (MBA)
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Curriculum focused on Tech Product Strategy, Unit Economics, GTM Execution, Market Discovery, and Financial Valuation.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Stage Evolution Timeline */}
      <section>
        <JourneyTimeline />
      </section>

      {/* Comprehensive Skill Matrix */}
      <section className="space-y-6 pt-4 border-t border-white/[0.08]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            02 // TOOLCHAIN & METHODOLOGIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Technical & Strategic Arsenal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillMatrix.map((matrix) => {
            const Icon = matrix.icon;
            return (
              <div key={matrix.category} className="artifact-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 font-mono text-xs text-neutral-200 border-b border-white/[0.06] pb-3">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">{matrix.category}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {matrix.skills.map((skill) => (
                    <span key={skill} className="tech-tag text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Design & Engineering Philosophy: Form Follows Function */}
      <section className="artifact-card rounded-2xl p-8 sm:p-10 space-y-4 border-l-4 border-indigo-500">
        <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
          CORE PHILOSOPHY // 01
        </div>
        <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Form Follows Function.
        </h3>
        <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
          The best machine learning systems are not the most complex—they are the ones stripped of vanity ornamentation, calibrated for high-throughput reliability, and wired directly into measurable commercial outcomes.
        </p>
      </section>

    </div>
  );
}
