"use client";

import { motion } from "framer-motion";
import { MessageSquare, Heart, Share2, Flame, Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar: Trending */}
        <div className="lg:col-span-3 space-y-6">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
           >
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
                 <Flame className="h-5 w-5 text-orange-500" /> Trending Topics
              </div>
              <ul className="space-y-3">
                 {["#SystemDesign", "#SalaryNegotiation", "#ResumeTips", "#FAANG"].map(tag => (
                    <li key={tag} className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer dark:text-slate-400 dark:hover:text-indigo-400">
                        {tag}
                    </li>
                 ))}
              </ul>
           </motion.div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
           {/* Post Creator */}
           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">You</div>
                 <input className="flex-1 bg-slate-50 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800" placeholder="Share your interview experience..." />
              </div>
           </div>

           {/* Posts */}
           {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div>
                       <div className="font-semibold text-slate-900 dark:text-white">Alex Johnson</div>
                       <div className="text-xs text-slate-500">Software Engineer • 2h ago</div>
                    </div>
                 </div>
                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    Just finished my loop at Google! The system design round was intense. They asked me to design a rate limiter. Make sure you study sliding window logs! 🚀
                 </p>
                 <div className="flex gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"><Heart className="h-4 w-4" /> 24</button>
                    <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"><MessageSquare className="h-4 w-4" /> 8</button>
                    <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"><Share2 className="h-4 w-4" /> Share</button>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Right: Stats */}
        <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-500/25">
               <Users className="h-8 w-8 mb-2 opacity-80" />
               <div className="text-3xl font-bold">12,405</div>
               <div className="text-indigo-100 text-sm">Developers Online</div>
            </div>
        </div>

      </div>
    </div>
  );
}