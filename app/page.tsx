"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Mic, 
  FileText, 
  BarChart3, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Terminal,
  Cpu
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility for Shadcn-like class merging ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className, icon: Icon }: any) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant as keyof typeof variants], className)}
    >
      {children}
      {Icon && <Icon className="ml-2 h-4 w-4" />}
    </motion.button>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-indigo-950/30" />
    <div className="relative z-10">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  </motion.div>
);

// --- Main Page ---

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 dark:bg-slate-950 dark:selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/60 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Cpu className="h-5 w-5" />
            </div>
            PrepAI
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            {["Questions", "Community", "Pricing"].map((item) => (
              <Link key={item} href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:text-white">
              Log in
            </Link>
            <Link href="/interview">
              <Button className="h-9 px-4 rounded-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 overflow-hidden">
        
        {/* Abstract Background Blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
           <motion.div style={{ y: y1, x: -100 }} className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px] mix-blend-multiply dark:bg-indigo-500/10 dark:mix-blend-screen" />
           <motion.div style={{ y: y2, x: 100 }} className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px] mix-blend-multiply dark:bg-purple-500/10 dark:mix-blend-screen" />
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <Badge className="border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              New: Voice Analysis Engine 2.0
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white"
          >
            Ace your next interview <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              without the anxiety.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
          >
            The world's first <span className="font-semibold text-slate-900 dark:text-slate-200">zero-login</span> interview platform. 
            Practice with realistic AI, get instant feedback, and refine your resume in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/interview" className="w-full sm:w-auto">
              <Button variant="primary" icon={ArrowRight} className="w-full sm:w-auto h-12 text-base rounded-full">
                Start Mock Interview
              </Button>
            </Link>
            <Link href="/resume" className="w-full sm:w-auto">
              <Button variant="secondary" icon={FileText} className="w-full sm:w-auto h-12 text-base rounded-full">
                Upload Resume
              </Button>
            </Link>
          </motion.div>

          {/* Hero Visual / Mockup */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 40 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
             className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Mock UI Header */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
               <div className="flex gap-1.5">
                 <div className="h-3 w-3 rounded-full bg-red-400/80" />
                 <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                 <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
               </div>
               <div className="mx-auto text-xs font-medium text-slate-400">AI Interview Session - Live</div>
            </div>
            
            {/* Mock UI Body */}
            <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
               {/* AI Avatar Side */}
               <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-8 dark:bg-slate-950/50">
                  <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20 dark:bg-indigo-600"></div>
                    <Mic className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="h-2 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2 w-24 mx-auto rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
               </div>

               {/* Transcript Side */}
               <div className="flex flex-col space-y-4 text-left">
                  <div className="rounded-lg rounded-tl-none bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">AI Interviewer</p>
                    "Tell me about a time you had to handle a conflict within your team."
                  </div>
                  <div className="self-end rounded-lg rounded-tr-none bg-indigo-600 p-4 text-sm text-white">
                    <p className="font-semibold text-indigo-100 mb-1">You</p>
                    "In my last role, two developers disagreed on..."
                  </div>
                  <div className="mt-4 flex gap-2">
                     <span className="h-8 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                     <span className="h-8 w-12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto mt-32 max-w-6xl px-6">
          <div className="mb-12 text-center">
             <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to get hired</h2>
             <p className="mt-4 text-slate-600 dark:text-slate-400">No subscriptions. No credit cards. Just practice.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard 
              delay={0.1}
              icon={Mic}
              title="Voice & Text Practice"
              desc="Speak your answers or type them out. Our AI adapts to your style and provides real-time feedback on your tone."
            />
            <FeatureCard 
              delay={0.2}
              icon={FileText}
              title="ATS Resume Scorer"
              desc="Don't let a robot reject you. Get an instant score and keyword optimization tips to pass the screeners."
            />
            <FeatureCard 
              delay={0.3}
              icon={Terminal}
              title="Technical Drills"
              desc="Frontend, Backend, or PM roles. Select your difficulty and get role-specific questions used by top tech companies."
            />
            <FeatureCard 
              delay={0.4}
              icon={BarChart3}
              title="Instant Feedback"
              desc="Get a detailed report card after every session. See your strengths in Clarity, Confidence, and Accuracy."
            />
            <FeatureCard 
              delay={0.5}
              icon={Users}
              title="Community Answers"
              desc="Stuck on a question? See how other candidates answered it and learn from the community's best responses."
            />
            <FeatureCard 
              delay={0.6}
              icon={Play}
              title="No Login Required"
              desc="We use local browser storage to save your progress. Start practicing immediately without creating an account."
            />
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
           <div className="text-sm text-slate-500">
             © 2026 PrepAI. Open source and free forever.
           </div>
           <div className="flex gap-6">
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" />
           </div>
        </div>
      </footer>
    </div>
  );
}