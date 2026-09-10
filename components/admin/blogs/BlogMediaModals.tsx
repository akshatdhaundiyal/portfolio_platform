"use client";

import React from "react";
import { X, Upload, Video, Code2, ImageIcon } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  imageCaption: string;
  setImageCaption: (val: string) => void;
  uploadingImage: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInsert: () => void;
}

export function ImageInsertModal({
  isOpen,
  onClose,
  imageUrl,
  setImageUrl,
  imageCaption,
  setImageCaption,
  uploadingImage,
  onUpload,
  onInsert,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0b0e] border border-white/[0.15] rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-xs font-semibold text-white">Insert Image Asset</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Upload Local Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              disabled={uploadingImage}
              className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-white/[0.06] file:text-neutral-200 hover:file:bg-white/[0.1]"
            />
            {uploadingImage && <p className="text-[10px] text-cyan-400 mt-1">Uploading...</p>}
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/[0.06]"></div>
            <span className="flex-shrink mx-2 text-[10px] text-neutral-500 uppercase">Or URL</span>
            <div className="flex-grow border-t border-white/[0.06]"></div>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Caption</label>
            <input
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="e.g. Model architecture diagram"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={onInsert}
            disabled={!imageUrl}
            className="w-full py-2 rounded-xl bg-[#d94e34] hover:bg-[#c23d24] disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  onInsert: () => void;
}

export function VideoInsertModal({
  isOpen,
  onClose,
  videoUrl,
  setVideoUrl,
  onInsert,
}: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0b0e] border border-white/[0.15] rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-xs font-semibold text-white">Embed Video / Walkthrough</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">
              YouTube / Vimeo / MP4 URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <p className="text-[11px] text-neutral-400">
            The renderer will automatically embed an interactive responsive video player.
          </p>

          <button
            type="button"
            onClick={onInsert}
            disabled={!videoUrl}
            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Embed Video
          </button>
        </div>
      </div>
    </div>
  );
}

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeLanguage: string;
  setCodeLanguage: (val: string) => void;
  codeSnippet: string;
  setCodeSnippet: (val: string) => void;
  onInsert: () => void;
}

export function CodeInsertModal({
  isOpen,
  onClose,
  codeLanguage,
  setCodeLanguage,
  codeSnippet,
  setCodeSnippet,
  onInsert,
}: CodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0a0b0e] border border-white/[0.15] rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-xs font-semibold text-white">Insert Code Snippet</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Language</label>
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0f1117] border border-white/[0.1] text-xs font-mono text-neutral-200"
            >
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="sql">SQL</option>
              <option value="bash">Bash / Shell</option>
              <option value="json">JSON</option>
              <option value="dockerfile">Dockerfile</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Code</label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={6}
              placeholder="# Paste code snippet here..."
              className="w-full p-3 rounded-xl bg-[#07080c] border border-white/[0.1] text-xs font-mono text-neutral-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={onInsert}
            disabled={!codeSnippet}
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Insert Code Block
          </button>
        </div>
      </div>
    </div>
  );
}
