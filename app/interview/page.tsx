"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Sparkles, ChevronRight, Layout, Maximize2, 
  MoreVertical, Copy, ThumbsUp, X, Activity, AlertCircle 
} from "lucide-react";

// --- 1. MOCK KNOWLEDGE BASE (The "Brain") ---
// In a real app, this would come from an OpenAI/Groq API call based on the transcript.
type Suggestion = {
  id: string;
  title: string;
  description: string;
  points: string[];
  confidence: number;
  tags: string[];
};

const AI_KNOWLEDGE_BASE: Record<string, Suggestion> = {
  "react": {
    id: "react-1",
    title: "React Core Concepts",
    description: "Key concepts to mention when asked about React basics.",
    points: [
      "Virtual DOM: Minimizes direct DOM manipulation for performance.",
      "Hooks: Use 'useEffect' for side effects and 'useState' for data.",
      "Unidirectional Data Flow: Data flows down from parent to child."
    ],
    confidence: 98,
    tags: ["React", "Frontend", "Virtual DOM"]
  },
  "performance": {
    id: "perf-1",
    title: "Web Performance Optimization",
    description: "Strategies to optimize frontend speed.",
    points: [
      "Code Splitting: Use React.lazy() to load chunks on demand.",
      "Image Optimization: Use Next.js <Image> component.",
      "Caching: Implement SWR or TanStack Query for server state."
    ],
    confidence: 94,
    tags: ["Performance", "Optimization", "Lighthouse"]
  },
  "api": {
    id: "api-1",
    title: "REST vs GraphQL",
    description: "Comparison of API architectural styles.",
    points: [
      "REST: Standard HTTP methods, caching is easier.",
      "GraphQL: Fetch exact data needed, avoids over-fetching.",
      "Mention standard status codes (200, 404, 500)."
    ],
    confidence: 92,
    tags: ["Backend", "API", "Architecture"]
  },
  "default": {
    id: "def-1",
    title: "General Interview Helper",
    description: "Listening for technical keywords...",
    points: [
      "Keep answers structured (STAR method).",
      "If you don't know, admit it but explain how you'd find out.",
      "Maintain eye contact with the camera."
    ],
    confidence: 100,
    tags: ["System", "Ready"]
  }
};

export default function InterviewPage() {
  // --- STATE ---
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // AI/Speech State
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion>(AI_KNOWLEDGE_BASE.default);
  const [browserSupport, setBrowserSupport] = useState(true);

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // --- 2. CAMERA SETUP ---
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera Error:", err);
      }
    };
    initCamera();

    // Cleanup
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // --- 3. SPEECH RECOGNITION SETUP ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore - SpeechRecognition is not standard in all TS definitions yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setBrowserSupport(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;     // Keep listening even after pauses
      recognition.interimResults = true; // Show results while speaking
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        // Combine all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        // Update UI
        setTranscript(currentTranscript);
        
        // Trigger Logic
        detectKeywords(currentTranscript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  }, []);

  // --- 4. INTELLIGENT KEYWORD DETECTION ---
  const detectKeywords = useCallback((text: string) => {
    const lower = text.toLowerCase();
    
    // Simple heuristic matching (In production, send this text to an LLM)
    if (lower.includes("react") || lower.includes("component") || lower.includes("hook")) {
      setActiveSuggestion(AI_KNOWLEDGE_BASE.react);
    } else if (lower.includes("slow") || lower.includes("fast") || lower.includes("optimize") || lower.includes("performance")) {
      setActiveSuggestion(AI_KNOWLEDGE_BASE.performance);
    } else if (lower.includes("api") || lower.includes("rest") || lower.includes("graphql") || lower.includes("backend")) {
      setActiveSuggestion(AI_KNOWLEDGE_BASE.api);
    }
  }, []);

  // --- HELPERS ---
  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-100 selection:bg-indigo-500/30">
      
      {/* ================= LEFT SIDE: VIDEO CALL UI ================= */}
      <div className="flex-1 flex flex-col relative transition-all duration-500 ease-in-out">
        
        {/* Top Bar (Overlay) */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
          {/* User Info */}
          <div className="flex items-center gap-3 pointer-events-auto bg-black/40 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                HR
             </div>
             <div>
                <h2 className="text-white font-semibold text-sm leading-tight">Sarah Jenkins</h2>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Connected • 00:14:23
                </div>
             </div>
          </div>

          {/* Copilot Toggle Button */}
          <button 
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all border shadow-lg ${
               isCopilotOpen 
               ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 shadow-indigo-500/20' 
               : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className={`h-4 w-4 ${isCopilotOpen ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="text-sm font-medium hidden sm:inline">{isCopilotOpen ? 'Copilot Active' : 'Enable Copilot'}</span>
          </button>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* Interviewer Video (Mock) */}
            <video 
              autoPlay 
              loop 
              muted 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              // Using a professional looking placeholder video
              src="https://videos.pexels.com/video-files/7578548/7578548-hd_1920_1080_30fps.mp4"
            />
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
           
           {/* Self View (Picture-in-Picture) */}
           <motion.div 
             drag
             dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
             className="absolute bottom-24 right-6 w-48 sm:w-64 aspect-video rounded-2xl bg-slate-800 border border-slate-700/50 shadow-2xl overflow-hidden group cursor-move z-30"
           >
              {!isVideoOff ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                  <VideoOff className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium">Camera Off</span>
                </div>
              )}
              
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white font-medium backdrop-blur-sm">
                 YOU {isMuted && '• MUTED'}
              </div>
           </motion.div>
        </div>

        {/* Bottom Control Bar */}
        <div className="h-24 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4 sm:gap-6 px-6 relative z-30">
           <ControlBtn 
             icon={isMuted ? MicOff : Mic} 
             isActive={!isMuted} 
             onClick={toggleMute} 
             variant={isMuted ? 'danger' : 'default'}
           />
           <ControlBtn 
             icon={isVideoOff ? VideoOff : Video} 
             isActive={!isVideoOff} 
             onClick={toggleVideo} 
             variant={isVideoOff ? 'danger' : 'default'}
           />
           
           <div className="w-px h-10 bg-slate-800 mx-2 hidden sm:block" />
           
           <button className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-red-900/20 flex items-center gap-3 active:scale-95 hover:scale-105">
              <PhoneOff className="h-5 w-5" />
              <span className="hidden md:inline">End Interview</span>
           </button>
           
           <div className="w-px h-10 bg-slate-800 mx-2 hidden sm:block" />

           <ControlBtn icon={MessageSquare} isActive={false} />
           <ControlBtn icon={Layout} isActive={false} />
        </div>
      </div>

      {/* ================= RIGHT SIDE: AI COPILOT SIDEBAR ================= */}
      <AnimatePresence mode="wait">
        {isCopilotOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 420, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full border-l border-slate-800 bg-slate-950 flex flex-col shadow-2xl z-40 relative"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800">
               <div className="flex items-center gap-2.5">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </div>
                  <span className="font-bold text-white tracking-wide text-sm">AI INTERVIEW COPILOT</span>
               </div>
               <button onClick={() => setIsCopilotOpen(false)} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
                  <X className="h-5 w-5" />
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
               
               {/* 1. Browser Warning (if speech api missing) */}
               {!browserSupport && (
                 <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-200">Your browser does not support Speech Recognition. Try Chrome or Edge.</p>
                 </div>
               )}

               {/* 2. Live Transcription Card */}
               <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/10">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Live Transcript</span>
                     </div>
                     {isListening && <span className="text-[10px] font-mono text-emerald-500 animate-pulse">LISTENING...</span>}
                  </div>
                  <div className="relative min-h-[60px]">
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                       {transcript ? `"${transcript}"` : <span className="text-slate-600">Waiting for speech... (Try saying "React", "API", or "Performance")</span>}
                    </p>
                  </div>
               </div>

               {/* 3. AI Smart Card */}
               <motion.div 
                 key={activeSuggestion.id} // Forces re-render animation on change
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.4 }}
                 className="space-y-3"
               >
                  <div className="flex items-center gap-2 px-1">
                     <Sparkles className="h-3 w-3 text-teal-400" />
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Suggestion</span>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg group hover:border-indigo-500/30 transition-colors">
                     {/* Card Header */}
                     <div className="p-5 border-b border-slate-800 bg-slate-900 group-hover:bg-slate-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold text-lg">{activeSuggestion.title}</h3>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20">
                            {activeSuggestion.confidence}% MATCH
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{activeSuggestion.description}</p>
                     </div>

                     {/* Bullet Points */}
                     <div className="p-5 bg-slate-950/30">
                        <ul className="space-y-4">
                           {activeSuggestion.points.map((point, i) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-300">
                                 <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                 <span className="leading-relaxed">{point}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     {/* Footer Actions */}
                     <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
                        <div className="flex gap-2">
                          {activeSuggestion.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:text-white cursor-default">#{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-1">
                           <ActionBtn icon={Copy} />
                           <ActionBtn icon={ThumbsUp} />
                        </div>
                     </div>
                  </div>
               </motion.div>

            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
               <div className="relative">
                  <input 
                     type="text" 
                     placeholder="Ask Copilot manually..." 
                     className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl pl-4 pr-10 py-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                  <button className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center justify-center">
                     <ChevronRight className="h-4 w-4" />
                  </button>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function ControlBtn({ 
  icon: Icon, 
  isActive, 
  onClick, 
  variant = 'default' 
}: { 
  icon: any, 
  isActive: boolean, 
  onClick?: () => void,
  variant?: 'default' | 'danger'
}) {
   const baseClasses = "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95";
   
   const activeClasses = variant === 'danger'
      ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700" // Normal state for danger button (e.g. Mute is OFF)
      : "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 shadow-lg"; // Normal state for standard button

   const inactiveClasses = variant === 'danger'
      ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" // Active Danger (e.g. Mute is ON)
      : "bg-slate-900 text-slate-500 border border-transparent hover:bg-slate-800"; // Inactive Standard

   return (
      <button 
        onClick={onClick}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
         <Icon className="h-6 w-6" />
      </button>
   );
}

function ActionBtn({ icon: Icon }: { icon: any }) {
   return (
      <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
         <Icon className="h-4 w-4" />
      </button>
   );
}