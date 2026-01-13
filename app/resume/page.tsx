"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export default function ResumePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 dark:bg-slate-950 flex flex-col items-center">
      <div className="w-full max-w-2xl px-6 text-center">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Resume Optimizer</h1>
         <p className="text-slate-600 dark:text-slate-400 mb-10">Upload your PDF. We'll check it against ATS algorithms.</p>

         <motion.div
            layout
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
               "relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-all duration-300",
               isDragging 
                 ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                 : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
            )}
         >
            {status === "idle" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/30">
                     <UploadCloud className="h-8 w-8" />
                  </div>
                  <div>
                     <p className="text-lg font-semibold text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                     <p className="text-sm text-slate-500 mt-1">PDF or DOCX (max 5MB)</p>
                  </div>
                  <button 
                    onClick={() => setStatus("done")} // Simulating upload
                    className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                     Select File
                  </button>
               </motion.div>
            )}

            {status === "done" && (
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30">
                     <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Complete</h3>
                  <div className="inline-block px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
                     Score: 92/100
                  </div>
                  <p className="text-sm text-slate-500 hover:text-indigo-600 cursor-pointer underline" onClick={() => setStatus("idle")}>
                     Upload another
                  </p>
               </motion.div>
            )}
         </motion.div>
      </div>
    </div>
  );
}