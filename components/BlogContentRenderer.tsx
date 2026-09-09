"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Play, Terminal } from "lucide-react";

interface Props {
  content: string;
}

function CodeBlock({ children, className }: { children: any; className?: string }) {
  const [copied, setCopied] = useState(false);
  const language = className ? className.replace("language-", "") : "code";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.1] bg-[#07080b]">
      {/* Code Header Bar */}
      <div className="px-4 py-2 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between font-mono text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 transition-colors text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-neutral-200">
        <code>{children}</code>
      </div>
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  // Extract YouTube ID
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (youtubeMatch) {
    return (
      <div className="my-6 rounded-xl overflow-hidden border border-white/[0.1] aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded Video"
        />
      </div>
    );
  }

  // Direct MP4 video
  if (url.endsWith(".mp4") || url.endsWith(".webm")) {
    return (
      <div className="my-6 rounded-xl overflow-hidden border border-white/[0.1]">
        <video controls className="w-full rounded-xl" src={url} />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 inline-flex items-center gap-2 p-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-cyan-300 text-xs font-mono"
    >
      <Play className="w-4 h-4" />
      <span>Watch Media Asset ({url})</span>
    </a>
  );
}

export default function BlogContentRenderer({ content }: Props) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-neutral-300 prose-p:leading-relaxed prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-500/[0.03] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-neutral-200 prose-blockquote:not-italic prose-li:text-neutral-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");
            return !isInline ? (
              <CodeBlock className={className}>{children}</CodeBlock>
            ) : (
              <code className="px-1.5 py-0.5 rounded bg-white/[0.06] font-mono text-xs text-indigo-300 border border-white/[0.08]" {...props}>
                {children}
              </code>
            );
          },
          img({ src, alt }) {
            if (!src) return null;
            return (
              <figure className="my-8 space-y-2">
                <div className="rounded-xl overflow-hidden border border-white/[0.1] bg-[#07080b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt || "Blog visual asset"} className="w-full h-auto object-cover max-h-[550px]" />
                </div>
                {alt && (
                  <figcaption className="text-center font-mono text-xs text-neutral-400">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          a({ href, children }) {
            if (!href) return null;
            // Check if link is a video embed
            if (href.includes("youtube.com") || href.includes("youtu.be") || href.endsWith(".mp4")) {
              return <VideoEmbed url={href} />;
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline font-medium">
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-white/[0.08]">
                <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="bg-white/[0.04] p-3 text-neutral-200 border-b border-white/[0.08] font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="p-3 text-neutral-300 border-b border-white/[0.04]">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
