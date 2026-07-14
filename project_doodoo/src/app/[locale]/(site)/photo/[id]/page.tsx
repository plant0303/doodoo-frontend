"use client";
import { notFound } from 'next/navigation';
import React, { useState } from "react";
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
import SimilarImages from './SimilarImages';

interface PromptState {
  style: string;
  typography: string;
  colorPalette: string;
  objects: string;
}


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const { id } = await params;

  // 상태 관리를 통해 Quick Modify와 Final Prompt 실시간 연동
  const [prompt, setPrompt] = useState<PromptState>({
    style: "Glassmorphism, futuristic, modern SaaS",
    typography: "Geist Sans, Inter, clean sans-serif",
    colorPalette: "Deep blue, Electric purple, Frost white",
    objects: "Floating cards, pill buttons, sidebars",
  });

  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT PANEL: Hero Image & Information (7/12 cols) */}
        <section className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Futuristic Glassmorphism UI
            </h1>
            <p className="mt-3 text-lg text-slate-500">
              A sleek, semi-transparent user interface with vibrant gradients and frosted glass effects.
            </p>
          </div>

          {/* Hero Image Container */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl flex items-center justify-center p-8">
            {/* 실제 UI 데모를 모방한 내부 글래스모피즘 박스 */}

          </div>

          {/* Engagement bar (Creators, Likes, Share) */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">Used by 1.2k creators</span>
            </div>

            {/* <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${liked ? "bg-pink-50 text-pink-600 border border-pink-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-pink-600 text-pink-600" : ""}`} />
              <span>{liked ? "125" : "124"}</span>
            </button>
            <button className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div> */}
          </div>
        </section>

        {/* RIGHT PANEL: Prompt Builder (5/12 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg space-y-8">
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

      </div>
      <SimilarImages imageId="1" />
    </div>
  );
}

