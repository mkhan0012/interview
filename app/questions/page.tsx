"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, ArrowUpRight, Tag, Filter } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const questions = [
  { id: 1, title: "How to handle race conditions in React useEffect?", tags: ["React", "Hooks"], votes: 45, author: "DevSarah" },
  { id: 2, title: "System Design: Scaling WebSockets for 1M users", tags: ["System Design", "Backend"], votes: 128, author: "TechLead_99" },
  { id: 3, title: "Difference between Interface and Type in TS?", tags: ["TypeScript"], votes: 89, author: "JuniorDev" },
  { id: 4, title: "Optimizing Next.js images for LCP score", tags: ["Next.js", "Performance"], votes: 67, author: "WebWizard" },
];

export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Community Knowledge
          </motion.h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Real interview questions asked by real candidates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 mx-auto max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input 
            type="text"
            placeholder="Search for questions, companies, or topics..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {["All", "Frontend", "Backend", "System Design", "Behavioral"].map((tag, i) => (
                <button key={tag} className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                    i === 0 
                    ? "bg-indigo-600 text-white border-indigo-600" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                )}>
                    {tag}
                </button>
            ))}
        </div>

        {/* Questions Grid */}
        <div className="grid gap-4">
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {q.tags.map(t => (
                            <span key={t} className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white">
                        {q.title}
                    </h3>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Posted by <span className="font-medium text-slate-900 dark:text-slate-200">{q.author}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 text-slate-500">
                   <div className="flex items-center gap-1.5 text-sm font-medium">
                      <ArrowUpRight className="h-4 w-4" />
                      {q.votes}
                   </div>
                   <MessageCircle className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 text-indigo-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}