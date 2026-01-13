"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Sparkles, ChevronRight, Layout, Maximize2, 
  MoreVertical, Copy, ThumbsUp, X, Activity 
} from "lucide-react";

// --- Types ---
type Suggestion = {
  title: string;
  points: string[];
  confidence: number;
  tags: string[];
};

// --- Mock Data / Knowledge Base ---
const KNOWLEDGE_BASE: Record<string, Suggestion> = {
  react: {
    title: "React Core Concepts",
    points: [
      "Virtual DOM ensures efficient updates.",
      "Hooks (useState, useEffect) manage state/lifecycle.",
      "One-way data flow (Parent to Child)."
    ],
    confidence: 98,
    tags: ["React", "Frontend", "Virtual DOM"]
  },
  next: {
    title: "Next.js Rendering Methods",
    points: [
      "SSR (Server-Side Rendering) for dynamic data.",
      "SSG (Static Generation) for best performance.",
      "ISR (Incremental Static Regeneration) for hybrid."
    ],
    confidence: 95,
    tags: ["Next.js", "SSR", "Performance"]
  },
  css: {
    title: "Modern CSS Techniques",
    points: [
      "Flexbox for 1D layouts, Grid for 2D layouts.",
      "Tailwind CSS for utility-first styling.",
      "CSS Variables for theming support."
    ],
    confidence: 92,
    tags: ["CSS", "Design", "Flexbox"]
  },
  default: {
    title: "General Interview Tip",
    points: [
      "Use the STAR method (Situation, Task, Action, Result).",
      "Keep answers concise but detailed.",
      "Ask clarifying questions if stuck."
    ],
    confidence: 85,
    tags: ["Soft Skills", "General"]
  }
};

export default function InterviewPage() {
  // --- State ---
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion>(KNOWLEDGE_BASE.default);
  const [isListening, setIsListening] = useState(false);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // --- 1. Camera Handling ---
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // --- 2. Toggle Media Functions ---
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

  // --- 3. Speech Recognition (The "Copilot" Brain) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          
          setTranscript(currentTranscript);
          analyzeSpeech(currentTranscript);
        };

        recognitionRef.current = recognition;
        recognition.start(); // Auto-start listening
      }
    }
  }, []);

  // --- 4. Keyword Analysis Logic ---
  const analyzeSpeech = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("react") || lowerText.includes("hook") || lowerText.includes("component")) {
      setActiveSuggestion(KNOWLEDGE_BASE.react);
    } else if (lowerText.includes("next") || lowerText.includes("server") || lowerText.includes("render")) {
      setActiveSuggestion(KNOWLEDGE_BASE.next);
    } else if (lowerText.includes("css") || lowerText.includes("style") || lowerText.includes("layout")) {
      setActiveSuggestion(KNOWLEDGE_BASE.css);
    }
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
      
      {/* --- LEFT: MAIN INTERVIEW AREA --- */}
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto bg-black/40 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10">
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                JS
             </div>
             <div>
                <h2 className="text-white font-semibold text-sm leading-tight">John Smith</h2>
                <div className="flex items-center gap-2 text-[10px] text-slate-300 uppercase tracking-wider font-medium">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   Connected • 00:14:23
                </div>
             </div>
          </div>
          <button 
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all border shadow-lg ${
               isCopilotOpen 
               ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 shadow-indigo-500/10' 
               : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{isCopilotOpen ? 'Copilot Active' : 'Enable Copilot'}</span>
          </button>
        </div>

        {/* REMOTE VIDEO (Simulated) */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* Using a stock video to simulate an interviewer */}
            <video 
              autoPlay 
              loop 
              muted 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              src="https://videos.pexels.com/video-files/3195861/3195861-hd_1920_1080_25fps.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
           
           {/* SELF VIEW (PiP) */}
           <motion.div 
             drag
             dragMomentum={false}
             className="absolute bottom-24 right-6 w-48 sm:w-64 aspect-video rounded-xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden group cursor-move z-30"
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
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                  <VideoOff className="h-8 w-8" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur">
                 <Maximize2 className="h-3 w-3 text-white" />
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-medium backdrop-blur">
                 YOU {isMuted && '(MUTED)'}
              </div>
           </motion.div>
        </div>

        {/* BOTTOM CONTROL BAR */}
        <div className="h-20 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-6 px-6 relative z-30">
           <ControlBtn 
             icon={isMuted ? MicOff : Mic} 
             active={!isMuted} 
             onClick={toggleMute} 
             status={isMuted ? 'danger' : 'default'}
           />
           <ControlBtn 
             icon={isVideoOff ? VideoOff : Video} 
             active={!isVideoOff} 
             onClick={toggleVideo} 
             status={isVideoOff ? 'danger' : 'default'}
           />
           
           <div className="w-px h-8 bg-slate-800 mx-2 hidden sm:block" />
           
           <button className="h-12 px-6 sm:px-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium transition-all shadow-lg shadow-red-900/20 flex items-center gap-2 active:scale-95">
              <PhoneOff className="h-5 w-5" />
              <span className="hidden md:inline">End Call</span>
           </button>
           
           <div className="w-px h-8 bg-slate-800 mx-2 hidden sm:block" />

           <ControlBtn icon={MessageSquare} />
           <ControlBtn icon={Layout} />
        </div>
      </div>

      {/* --- RIGHT: COPILOT SIDEBAR --- */}
      <AnimatePresence mode="wait">
        {isCopilotOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full border-l border-slate-800 bg-slate-950 flex flex-col shadow-2xl z-40 relative"
          >
            {/* Copilot Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur">
               <div className="flex items-center gap-2">
                  <div className="relative">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
                  </div>
                  <span className="font-bold text-white tracking-wide text-sm">AI Copilot</span>
               </div>
               <button onClick={() => setIsCopilotOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               
               {/* 1. Live Transcription Card */}
               <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Live Transcription</span>
                     </div>
                     {isListening && (
                       <span className="flex gap-1 h-3 items-center">
                          {[1,2,3,4].map(i => (
                             <motion.div 
                                key={i}
                                animate={{ height: [4, 12, 4] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                className="w-0.5 bg-indigo-500 rounded-full"
                             />
                          ))}
                       </span>
                     )}
                  </div>
                  <p className="text-sm text-slate-300 italic min-h-[3rem] leading-relaxed">
                     "{transcript || "Start speaking to see transcription..."}"
                  </p>
               </div>

               {/* 2. Dynamic AI Suggestion */}
               <motion.div 
                 key={activeSuggestion.title}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-3"
               >
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                        <Sparkles className="h-3 w-3" />
                     </div>
                     <span className="text-sm font-medium text-slate-200">Real-time Assistance</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group shadow-lg">
                     <h3 className="text-white font-semibold mb-3 text-lg">{activeSuggestion.title}</h3>
                     <ul className="space-y-3 mb-5">
                        {activeSuggestion.points.map((point, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                              <span>{point}</span>
                           </li>
                        ))}
                     </ul>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                           {activeSuggestion.confidence}% Match
                        </span>
                        <div className="flex gap-2">
                           <ActionIcon icon={Copy} />
                           <ActionIcon icon={ThumbsUp} />
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* 3. Context Tags */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Detected Context</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {activeSuggestion.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:border-indigo-500/30 hover:text-indigo-400 transition-colors cursor-default">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30 backdrop-blur">
               <div className="relative group">
                  <input 
                     type="text" 
                     placeholder="Ask Copilot a manual question..." 
                     className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  <button className="absolute right-2 top-2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
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

// --- Helper Components ---

function ControlBtn({ 
  icon: Icon, 
  active = false, 
  onClick, 
  status = 'default' 
}: { 
  icon: any, 
  active?: boolean, 
  onClick?: () => void,
  status?: 'default' | 'danger'
}) {
   const baseStyles = "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95";
   
   const activeStyles = status === 'danger' 
      ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
      : "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 shadow-lg";
      
   const inactiveStyles = status === 'danger'
      ? "bg-red-600 text-white hover:bg-red-700 shadow-red-900/20 shadow-lg"
      : "bg-slate-900 text-slate-400 border border-transparent hover:bg-slate-800 hover:text-slate-200";

   return (
      <button 
        onClick={onClick}
        className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
      >
         <Icon className="h-5 w-5" />
      </button>
   );
}

function ActionIcon({ icon: Icon }: { icon: any }) {
   return (
      <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
         <Icon className="h-4 w-4" />
      </button>
   );
}