'use client';

import React, { useState } from 'react'
import {
  Paintbrush,
  Type,
  Palette,
  Boxes,
  Copy,
  Share2,
  Heart,
  ArrowUpRight
} from "lucide-react";


interface PromptState {
  style: string;
  typography: string;
  colorPalette: string;
  objects: string;
}

export default function PromptBuilder() {

  const [copied, setCopied] = useState(false);

  // 상태 관리를 통해 Quick Modify와 Final Prompt 실시간 연동
  const [prompt, setPrompt] = useState<PromptState>({
    style: "Glassmorphism, futuristic, modern SaaS",
    typography: "Geist Sans, Inter, clean sans-serif",
    colorPalette: "Deep blue, Electric purple, Frost white",
    objects: "Floating cards, pill buttons, sidebars",
  });

  // 클립보드 복사 핸들러
  const handleCopy = () => {
    const jsonString = JSON.stringify({
      style: prompt.style,
      theme: "Futuristic SaaS",
      palette: prompt.colorPalette.split(", ").map(c => c.trim()),
      details: prompt.objects
    }, null, 2);

    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <section className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Prompt Builder</h2>
      </div>

      {/* 1. Prompt Parts & Quick Modify */}
      <div className="space-y-6">

        {/* Style Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wider uppercase">
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Style</span>
          </div>
          <input
            type="text"
            value={prompt.style}
            onChange={(e) => setPrompt({ ...prompt, style: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {/* Quick Modify Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Minimalist", "Cyberpunk", "Neo-Brutalism"].map((style) => (
              <button
                key={style}
                onClick={() => setPrompt({ ...prompt, style: `${style}, modern SaaS` })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Typography Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wider uppercase">
            <Type className="w-3.5 h-3.5" />
            <span>Typography</span>
          </div>
          <input
            type="text"
            value={prompt.typography}
            onChange={(e) => setPrompt({ ...prompt, typography: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Monospace", "Clean Sans", "Serif"].map((typo) => (
              <button
                key={typo}
                onClick={() => setPrompt({ ...prompt, typography: `${typo}, clean composition` })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                {typo}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wider uppercase">
            <Palette className="w-3.5 h-3.5" />
            <span>Color Palette</span>
          </div>
          <input
            type="text"
            value={prompt.colorPalette}
            onChange={(e) => setPrompt({ ...prompt, colorPalette: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Electric Blue", "Monochrome", "Pastel"].map((color) => (
              <button
                key={color}
                onClick={() => setPrompt({ ...prompt, colorPalette: `${color}, Frost white` })}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Object Elements Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wider uppercase">
            <Boxes className="w-3.5 h-3.5" />
            <span>Object Elements</span>
          </div>
          <input
            type="text"
            value={prompt.objects}
            onChange={(e) => setPrompt({ ...prompt, objects: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 2. Final Prompt (JSON Block) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Prompt JSON</span>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {/* <span>{copied ? "Copied!" : "Copy"}</span> */}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
          {/* <pre>{`{
  "style": "${prompt.style}",
  "theme": "Futuristic SaaS",
  "palette": [
    "${prompt.colorPalette.split(", ").join('",\n    "')}"
  ],
  "details": "${prompt.objects}"
}`}</pre> */}
        </div>
      </div>

      {/* 3. Call to Action Button */}
      <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
        <span>Go to ChatGPT</span>
        <ArrowUpRight className="w-5 h-5" />
      </button>
    </section>
  );
}
