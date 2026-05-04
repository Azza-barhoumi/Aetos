import { motion, AnimatePresence } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bird, Bot, User, Sparkles, Loader2, RefreshCw, Paperclip, CheckSquare, ListFilter, AlertTriangle, Mic, MicOff } from "lucide-react";
import { getGemini, getAetosPrompt } from "../services/geminiService";
import { extractTextFromPDF } from "../lib/pdfExtractor";
import { saveSession, getSession } from "../services/firebase";
import { ChatMessage, ChatSession } from "../types";

interface AetosChatProps {
  userContext?: any;
  onComplete: (data: any) => void;
  autoTriggerCV?: boolean;
  sessionId?: string;
  onSessionCreated?: (id: string) => void;
}

export function AetosChat({ userContext, onComplete, autoTriggerCV, sessionId, onSessionCreated }: AetosChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Calibration sequence initiated. I am Aetos. To begin with maximal precision, upload your CV for vector extraction, or select your current strategic focus below.",
      options: ["Strategic Growth", "Market Pivot", "Leadership Ascent"]
    }
  ]);

  // Load existing session info
  useEffect(() => {
    if (sessionId && userContext?.uid) {
      const load = async () => {
        const session = await getSession(userContext.uid, sessionId);
        if (session) {
          setMessages(session.messages);
          setTurnCount(session.messages.length);
          if (session.cvName) setCvName(session.cvName);
        }
      };
      load();
    } else if (!sessionId) {
      // Reset for new chat
      setMessages([
        { 
          role: 'assistant', 
          content: "Calibration sequence initiated. I am Aetos. To begin with maximal precision, upload your CV for vector extraction, or select your current strategic focus below.",
          options: ["Strategic Growth", "Market Pivot", "Leadership Ascent"]
        }
      ]);
      setTurnCount(0);
      setCvName(null);
      setCvContext(null);
    }
  }, [sessionId, userContext?.uid]);

  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cvContext, setCvContext] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [turnCount, setTurnCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoTriggerCV && fileInputRef.current && !cvContext) {
      fileInputRef.current.click();
    }
  }, [autoTriggerCV, cvContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const [sttError, setSttError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing Speech Recognition...");
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
           setInput(prev => (prev.trim() + ' ' + finalTranscript.trim()).trim());
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
            setSttError("Microphone access denied.");
        } else if (event.error === 'no-speech') {
            // Ignore no-speech errors to stay listening
            return;
        } else {
            setSttError(`Speech Error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        if (isListeningRef.current) {
            try { rec.start(); } catch(e) {}
        }
      };

      setRecognition(rec);
    } else {
        console.error("Speech recognition NOT supported");
        setSttError("STT not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognition.stop();
    } else {
      setSttError(null);
      try {
        isListeningRef.current = true;
        setIsListening(true);
        recognition.start();
      } catch (e) {
        console.error("STT Start Error", e);
        isListeningRef.current = false;
        setIsListening(false);
      }
    }
  };

  const updateSession = async (newMessages: ChatMessage[], revelation?: any) => {
    if (!userContext?.uid) return;
    
    try {
      const sessionData: any = {
        messages: newMessages,
      };

      if (sessionId) {
        sessionData.id = sessionId;
      } else {
        sessionData.title = (newMessages.find(m => m.role === 'user')?.content || 'New Calibration').substring(0, 40);
      }
      
      if (cvName) sessionData.cvName = cvName;
      if (revelation) sessionData.revelation = revelation;

      const newId = await saveSession(userContext.uid, sessionData);
      if (!sessionId && onSessionCreated) {
        onSessionCreated(newId);
      }
    } catch (e) {
      console.error("Session update failed", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvName(file.name);
    setIsLoading(true);
    const msg1: ChatMessage = { role: 'user', content: `[SYSTEM: CV_UPLOAD_INITIATED: ${file.name}]` };
    setMessages(prev => {
        const next = [...prev, msg1];
        updateSession(next);
        return next;
    });

    try {
      let text = "";
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractTextFromPDF(arrayBuffer);
      } else {
        text = await file.text();
      }

      // Check if the extracted text looks like binary garbage
      const isLikelyBinary = text.includes('%PDF') || /[\x00-\x08\x0E-\x1F\x7F]/.test(text.substring(0, 500));
      
      if (isLikelyBinary && file.type !== 'application/pdf') {
        setMessages(prev => [...prev, { role: 'assistant', content: "Warning: The uploaded file appears to be in an unreadable format. For maximal precision, please provide a plain text (.txt) or PDF version of your professional story." }]);
        setIsLoading(false);
        return;
      }

      if (!text.trim() || text.length < 50) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Insufficient data detected in file. Please ensure the document contains your professional history." }]);
        setIsLoading(false);
        return;
      }

      const strippedText = text.substring(0, 15000); 
      setCvContext(strippedText);
      const msg2: ChatMessage = { role: 'user', content: `[SYSTEM: CV_INGESTED: ${file.name} - ${text.length} chars]` };
      setMessages(prev => {
          const next = [...prev, msg2];
          updateSession(next);
          return next;
      });
      
      const ai = getGemini();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
          history: [],
          generationConfig: {
              maxOutputTokens: 2000,
          },
      });
      
      const response = await chat.sendMessage(`
        SYSTEM_INSTRUCTION: ${getAetosPrompt(`PRIOR DATA: ${JSON.stringify(userContext || {})}\nCV CONTENT:\n${strippedText}`)}
        
        USER: I have uploaded my CV. Identify my current trajectory (last role/company) to verify ingestion, then begin Turn 1 of DCSF calibration with MCQ Options. Do not mention anything not in the text.
      `);
      
      const textResponse = response.response.text();
      let displayContent = textResponse;
      let options: string[] = [];

      const cleanJson = (raw: string) => raw.replace(/```json/g, '').replace(/```/g, '').trim();

      if (textResponse.includes("---OPTIONS---")) {
          const opParts = textResponse.split("---OPTIONS---");
          displayContent = opParts[0].trim();
          try { options = JSON.parse(cleanJson(opParts[1])); } catch(e) {}
      }
      
      setMessages(prev => {
          const next = [...prev, { role: 'assistant', content: displayContent, options }];
          updateSession(next);
          return next;
      });
      setTurnCount(1);
    } catch (err) {
      console.error("File processing error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "System error during vector ingestion. Please try a different file format." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (forcedInput?: string) => {
    const finalInput = forcedInput || input;
    const hasSelection = !!selectedOption;
    if ((!finalInput.trim() && !hasSelection) || isLoading) return;

    const userMessage = hasSelection ? `[Selection: ${selectedOption}] ${finalInput.trim()}`.trim() : finalInput.trim();
    
    setInput('');
    setSelectedOption(null);
    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    updateSession(updatedMessages);
    setIsLoading(true);

    try {
      const ai = getGemini();
      const contextString = `Context: ${JSON.stringify(userContext || {})}\nCV: ${cvContext || "None"}\nTurn: ${turnCount}/12`;
      const systemInstruction = getAetosPrompt(contextString);

      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      });

      const response = await chat.sendMessage(`SYSTEM_INSTRUCTION: ${systemInstruction}\n\nUSER: ${userMessage}`);
      
      const text = response.response.text();
      setTurnCount(prev => prev + 1);
      
      if (text.includes("---SYNTHESIS_COMPLETE---")) {
        const parts = text.split("---SYNTHESIS_COMPLETE---");
        const finalMessage = parts[0].trim();
        const jsonPart = parts[1].trim();
        
        let finalData: any = null;
        try {
          const cleanJson = (raw: string) => raw.replace(/```json/g, '').replace(/```/g, '').trim();
          finalData = JSON.parse(cleanJson(jsonPart));
        } catch (e) {
          console.error("Failed to parse synthesis", e);
        }

        if (finalMessage) {
            setMessages(prev => {
                const next = [...prev, { role: 'assistant', content: finalMessage }];
                updateSession(next, finalData);
                return next;
            });
        } else if (finalData) {
            updateSession(updatedMessages, finalData);
        }

        if (finalData) {
            onComplete(finalData);
        }
      } else {
        // Check for options in text (Simple markdown list detection or specific JSON tag if we wanted to be stricter)
        // For now, let's assume Gemini might provide options in a structured way or we can prompt it to.
        // We will update the system prompt to use a specific format for options.
        let displayContent = text;
        let options: string[] = [];

        if (text.includes("---OPTIONS---")) {
            const opParts = text.split("---OPTIONS---");
            displayContent = opParts[0].trim();
            try {
                const cleanJson = (raw: string) => raw.replace(/```json/g, '').replace(/```/g, '').trim();
                options = JSON.parse(cleanJson(opParts[1]));
            } catch(e) { console.error("Options parse failed", e); }
        }

        setMessages(prev => {
            const next = [...prev, { role: 'assistant', content: displayContent, options }];
            updateSession(next);
            return next;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Calibration error. Re-initiating neural link..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showOptions = lastMessage?.role === 'assistant' && lastMessage.options && lastMessage.options.length > 0;

  return (
    <div className="flex flex-col h-[650px] w-full max-w-4xl mx-auto glass-dark rounded-[2.5rem] overflow-hidden shadow-2xl border-ambition/20 relative">
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-ambition relative flex items-center justify-center bg-black">
            <Bird className="w-6 h-6 text-ambition" />
            <div className="absolute inset-0 bg-ambition/20 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg leading-tight uppercase tracking-widest text-ambition">Aetos</h3>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Active Inference v2.1</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {sttError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-0 right-0 flex justify-center"
              >
                <div className="bg-red-500/10 border border-red-500/20 px-4 py-1 rounded-full text-[10px] text-red-500 font-mono">
                  {sttError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.pdf,.doc,.docx" 
          />
          <div className="flex items-center gap-2 px-3 py-1 bg-ambition/10 rounded-full border border-ambition/20">
            <div className="w-1.5 h-1.5 rounded-full bg-ambition animate-ping" />
            <span className="text-[10px] font-mono text-ambition uppercase">Turn {turnCount}/12</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar bg-black/20">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-ambition/10 border border-ambition/30'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-ambition" />}
                </div>
                <div className="space-y-4">
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-white/10 text-white border border-white/5 shadow-xl' : 'bg-ambition/5 border border-ambition/10 text-white/90 font-serif italic shadow-lg underline decoration-ambition/10 decoration-skip-ink-none'}`}>
                    {m.content}
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-ambition/50 font-mono text-[10px] uppercase tracking-widest pl-14">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Recalibrating Latent Vectors...
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white/5 border-t border-white/10 backdrop-blur-md">
        {showOptions && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap gap-2"
            >
                {lastMessage.options?.map(opt => (
                    <button
                        key={opt}
                        onClick={() => setSelectedOption(opt)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${selectedOption === opt ? 'bg-ambition text-midnight border-ambition shadow-lg shadow-ambition/20' : 'bg-white/5 border-white/10 text-white/60 hover:border-ambition/50'}`}
                    >
                        {opt}
                    </button>
                ))}
            </motion.div>
        )}

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
            {cvName && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-glow rounded-lg text-[9px] font-black uppercase text-midnight shadow-lg">
                <Paperclip className="w-3 h-3" /> {cvName}
              </div>
            )}
            {selectedOption && (
                <div className="flex items-center gap-1 px-2 py-1 bg-ambition rounded-md text-[9px] font-black uppercase text-midnight shadow-lg">
                    <CheckSquare className="w-3 h-3" /> {selectedOption}
                </div>
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : (showOptions ? (selectedOption ? "Add an optional explanation..." : "Select an option above...") : "Forge your answer...")}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 pr-28 focus:outline-none focus:border-ambition/50 transition-all placeholder:text-white/20 font-sans shadow-inner ${selectedOption || cvName ? 'pl-36 md:pl-48' : 'pl-6'}`}
          />
          <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
            <button
                onClick={toggleListening}
                disabled={!recognition}
                aria-label={isListening ? "Stop listening" : "Start listening"}
                className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                    !recognition 
                    ? 'bg-white/5 text-white/10 cursor-not-allowed'
                    : isListening 
                    ? 'bg-red-500 text-white animate-pulse scale-110' 
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
            >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            {!cvName && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="h-full px-3 glass-dark rounded-xl text-white/40 hover:text-ambition transition-colors border border-white/5 flex items-center justify-center"
                title="Attach CV"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            )}
            <div className="h-full flex flex-col justify-center gap-0.5">
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || (showOptions && !selectedOption)}
                  className="h-full px-5 rounded-xl bg-ambition text-midnight flex items-center justify-center hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale group/btn relative overflow-hidden"
                >
                  <Send className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                  {showOptions && !selectedOption && (
                      <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-[7px] font-black uppercase text-red-500">Select Option</span>
                      </div>
                  )}
                </button>
                {showOptions && selectedOption && !input.trim() && (
                    <span className="text-[7px] font-mono text-ambition/40 uppercase self-center">Optional: Explain Why</span>
                )}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[9px] font-mono text-center text-white/10 uppercase tracking-[0.4em] font-bold">
          High-Fidelity Psychometric Capture • 64-Dimension Synthesis
        </p>
      </div>
    </div>
  );
}

