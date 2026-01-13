"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 text-center">
        
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Everything you need to get hired, starting at $0.</p>
        </div>

        {/* Toggle */}
        <div className="mb-16 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative h-7 w-12 rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800"
          >
             <motion.div 
               animate={{ x: isAnnual ? 20 : 2 }}
               className="h-6 w-6 rounded-full bg-white shadow-sm"
             />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Yearly <span className="text-emerald-500 font-bold ml-1">-20%</span></span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {/* Free */}
           <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Starter</h3>
              <div className="mt-4 flex items-baseline justify-center text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                 $0
              </div>
              <ul className="mt-8 space-y-4 text-left">
                 {['3 Mock Interviews/mo', 'Community Access', 'Basic Question Bank'].map(feat => (
                    <li key={feat} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                       <Check className="h-5 w-5 text-indigo-600" /> {feat}
                    </li>
                 ))}
              </ul>
              <button className="mt-8 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                 Get Started
              </button>
           </div>

           {/* Pro */}
           <div className="relative rounded-3xl border-2 border-indigo-600 bg-slate-900 p-8 shadow-2xl transform scale-105 z-10">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                 POPULAR
              </div>
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <div className="mt-4 flex items-baseline justify-center text-5xl font-bold tracking-tight text-white">
                 ${isAnnual ? '12' : '15'}<span className="text-lg font-medium text-slate-400">/mo</span>
              </div>
              <ul className="mt-8 space-y-4 text-left">
                 {['Unlimited Interviews', 'AI Resume Review', 'Advanced Metrics', 'Priority Support'].map(feat => (
                    <li key={feat} className="flex gap-3 text-sm text-slate-300">
                       <Check className="h-5 w-5 text-indigo-400" /> {feat}
                    </li>
                 ))}
              </ul>
              <button className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition-all">
                 Upgrade Now
              </button>
           </div>

           {/* Team */}
           <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Team</h3>
              <div className="mt-4 flex items-baseline justify-center text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                 ${isAnnual ? '49' : '60'}
              </div>
              <ul className="mt-8 space-y-4 text-left">
                 {['Admin Dashboard', 'Team Analytics', 'Custom Questions', 'SSO Integration'].map(feat => (
                    <li key={feat} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                       <Check className="h-5 w-5 text-indigo-600" /> {feat}
                    </li>
                 ))}
              </ul>
              <button className="mt-8 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                 Contact Sales
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}