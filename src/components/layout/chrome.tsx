import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, MessageSquare, X, Send } from "lucide-react";
import { scrollToSection } from "@/lib/scroll-to";
import cubeIcon from "@/assets/cube-icon.png";

export function Chrome() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'bot'|'user', content: string}[]>([
    { role: 'bot', content: 'You have entered the Abyss. What truth do you seek?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();
      const filter = audioContextRef.current.createBiquadFilter();
      
      osc.type = "sine";
      osc.frequency.value = 55; // Deep drone
      
      filter.type = "lowpass";
      filter.frequency.value = 200;
      
      gain.gain.value = 0;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioContextRef.current.destination);
      
      osc.start();
      
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isAudioPlaying) {
      gainNodeRef.current?.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 1);
      setIsAudioPlaying(false);
    } else {
      gainNodeRef.current?.gain.setTargetAtTime(0.2, audioContextRef.current.currentTime, 2);
      setIsAudioPlaying(true);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue("");
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'The market owes you nothing. Your data has been recorded.' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Top Nav */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 mix-blend-difference"
      >
        <div className="flex items-center gap-2">
          <img
            src={cubeIcon}
            alt=""
            aria-hidden="true"
            className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]"
          />
          <span className="font-display font-bold tracking-widest md:tracking-[0.2em] text-lg md:text-2xl text-white md:whitespace-nowrap">OBSIDIAN ABYSS</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm tracking-widest text-white/50">
            <a
              href="#platform"
              onClick={(e) => { e.preventDefault(); scrollToSection("platform"); }}
              className="hover:text-primary transition-colors"
            >
              PLATFORM
            </a>
            <a
              href="#metrics"
              onClick={(e) => { e.preventDefault(); scrollToSection("metrics"); }}
              className="hover:text-primary transition-colors"
            >
              METRICS
            </a>
            <a
              href="#agents"
              onClick={(e) => { e.preventDefault(); scrollToSection("agents"); }}
              className="hover:text-primary transition-colors"
            >
              AGENTS
            </a>
            <a
              href="#access"
              onClick={(e) => { e.preventDefault(); scrollToSection("access"); }}
              className="hover:text-primary transition-colors"
            >
              ACCESS
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection("access")}
              className="text-xs font-bold tracking-widest text-white/70 hover:text-white transition-colors uppercase"
            >
              Log in
            </button>
            <button
              onClick={() => scrollToSection("access")}
              className="px-5 py-2 text-xs font-bold tracking-widest text-[#010309] bg-primary hover:bg-white transition-colors uppercase shadow-[0_0_20px_rgba(0,255,255,0.4)]"
            >
              Get Access
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={toggleAudio}
        aria-label={isAudioPlaying ? "Mute ambient sound" : "Play ambient sound"}
        aria-pressed={isAudioPlaying}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-3 text-white/50 hover:text-primary transition-colors mix-blend-difference"
        data-testid="button-audio-toggle"
      >
        {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
          {isAudioPlaying ? 'Sound On' : 'Sound Off'}
        </span>
      </motion.button>

      {/* Vertical Side Labels */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-16 mix-blend-difference hidden lg:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 rotate-90 origin-center whitespace-nowrap">01 // Initiation</span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 rotate-90 origin-center whitespace-nowrap">02 // The Core</span>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-[#010309]/95 backdrop-blur-xl border border-primary/20 w-80 mb-4 shadow-[0_0_30px_rgba(0,255,255,0.1)] flex flex-col overflow-hidden"
              data-testid="chat-widget-popover"
            >
              <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-primary/5">
                <span className="text-xs font-display tracking-widest text-primary font-bold">RESEARCH COMPANION</span>
                <button onClick={() => setIsChatOpen(false)} aria-label="Close research companion" className="text-white/50 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 h-64 overflow-y-auto flex flex-col gap-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary/10 text-white border border-primary/30' 
                        : 'bg-white/5 text-white/80 border border-white/10'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="border-t border-primary/20 p-2 flex">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Query the abyss..." 
                  aria-label="Message the research companion"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 placeholder:text-white/30"
                />
                <button type="submit" aria-label="Send message" className="p-2 text-primary hover:text-white transition-colors">
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label={isChatOpen ? "Close research companion" : "Open research companion"}
          aria-expanded={isChatOpen}
          className={`p-4 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 ${
            isChatOpen ? 'bg-primary text-[#010309]' : 'bg-[#010309] text-primary hover:bg-primary/10'
          }`}
          data-testid="button-chat-toggle"
        >
          {isChatOpen ? <X size={20} /> : <MessageSquare size={20} />}
        </motion.button>
      </div>
    </>
  );
}
