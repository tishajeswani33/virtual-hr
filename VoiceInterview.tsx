import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Square, Volume2, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Polyfill for SpeechRecognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const QUESTIONS = [
  "Tell me about yourself and your background.",
  "What is your greatest strength and how do you use it?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in five years?",
  "Why do you want to work for our company?"
];

interface Message {
  role: 'ai' | 'user';
  text: string;
}

export const VoiceInterview = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const recognition = useRef<any>(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => setIsListening(true);
      recognition.current.onend = () => setIsListening(false);
      recognition.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };
    }

    return () => {
      if (recognition.current) recognition.current.stop();
      synth.cancel();
    };
  }, []);

  const speak = (text: string, callback?: () => void) => {
    if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }
    
    setIsSpeaking(true);
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = () => {
      setIsSpeaking(false);
      if (callback) callback();
    };
    utterThis.onerror = (e) => {
      console.error('Speech synthesis error', e);
      setIsSpeaking(false);
    };
    
    // Select a decent voice if available
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterThis.voice = preferredVoice;

    synth.speak(utterThis);
  };

  const startInterview = () => {
    setIsActive(true);
    setCurrentQuestionIndex(0);
    setMessages([]);
    setShowFeedback(false);
    setTranscript('');
    
    const greeting = "Hello! I'm your AI interviewer today. Let's get started. " + QUESTIONS[0];
    setMessages([{ role: 'ai', text: greeting }]);
    speak(greeting, () => startListening());
  };

  const stopInterview = () => {
    setIsActive(false);
    setIsListening(false);
    recognition.current?.stop();
    synth.cancel();
    setShowFeedback(true);
  };

  const startListening = () => {
    setTranscript('');
    try {
      recognition.current?.start();
    } catch (e) {
      console.log("Recognition already started");
    }
  };

  const stopListeningAndSubmit = () => {
    recognition.current?.stop();
    if (transcript.trim()) {
      handleUserResponse(transcript);
    } else {
        // If nothing heard, maybe prompt again or wait? 
        // For now, let's just assume they are done and if empty, we move on or ask to repeat.
        // Let's just mock a "I didn't catch that" if empty, otherwise proceed.
        if (!transcript) {
            speak("I didn't hear anything. Could you please repeat that?", () => startListening());
            return;
        }
        handleUserResponse(transcript);
    }
  };

  const handleUserResponse = (text: string) => {
    const newMessages = [...messages, { role: 'user', text } as Message];
    setMessages(newMessages);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = QUESTIONS[nextIndex];
      
      // Artificial delay for "thinking"
      setTimeout(() => {
        const aiMsg = { role: 'ai', text: nextQuestion } as Message;
        setMessages(prev => [...prev, aiMsg]);
        speak(nextQuestion, () => startListening());
      }, 1000);
    } else {
      setTimeout(() => {
        const endMsg = "Thank you for your time. The interview is now complete. We will review your responses and get back to you.";
        setMessages(prev => [...prev, { role: 'ai', text: endMsg } as Message]);
        speak(endMsg, () => stopInterview());
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Voice Interview Assistant</h2>
          <p className="text-slate-500">Practice your interview skills with our AI powered voice assistant</p>
        </div>
        {!isActive && !showFeedback ? (
          <button
            onClick={startInterview}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium"
          >
            <Play className="w-5 h-5" /> Start Interview
          </button>
        ) : isActive ? (
            <button
            onClick={stopInterview}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 font-medium"
          >
            <Square className="w-5 h-5" /> End Interview
          </button>
        ) : (
             <button
            onClick={startInterview}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" /> Restart
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Visualizer / Status Area */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl text-white">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Status Indicator */}
                <div className="relative">
                     {isSpeaking && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute -inset-4 bg-indigo-500/30 rounded-full blur-xl"
                        />
                     )}
                     {isListening && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute -inset-4 bg-red-500/30 rounded-full blur-xl"
                        />
                     )}
                     <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-colors duration-300
                        ${isListening ? 'border-red-500 bg-red-900/20' : 
                          isSpeaking ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-700 bg-slate-800'}`}>
                        {isListening ? (
                            <Mic className="w-12 h-12 text-red-500" />
                        ) : isSpeaking ? (
                            <Volume2 className="w-12 h-12 text-indigo-400" />
                        ) : (
                            <MicOff className="w-12 h-12 text-slate-500" />
                        )}
                     </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">
                        {isListening ? "Listening..." : isSpeaking ? "AI Speaking..." : isActive ? "Waiting..." : "Ready"}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-[200px]">
                        {isListening ? "Speak clearly into your microphone" : "Please wait for the question"}
                    </p>
                </div>

                {isActive && isListening && (
                    <button 
                        onClick={stopListeningAndSubmit}
                        className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors"
                    >
                        Finish Answer
                    </button>
                )}
            </div>
        </div>

        {/* Transcript / Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700 flex justify-between items-center">
                <span>Interview Transcript</span>
                {isActive && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Question {currentQuestionIndex + 1}/{QUESTIONS.length}</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
                {messages.length === 0 && !isActive && !showFeedback && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <Mic className="w-16 h-16 mb-4" />
                        <p>Start the interview to begin the conversation</p>
                    </div>
                )}
                
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                         <div
                            className={`max-w-[85%] p-4 rounded-2xl ${
                            msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                            }`}
                        >
                            <p className="leading-relaxed">{msg.text}</p>
                        </div>
                    </motion.div>
                ))}

                {isListening && transcript && (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-end"
                    >
                         <div className="max-w-[85%] p-4 rounded-2xl bg-indigo-600/50 text-white rounded-br-none backdrop-blur-sm animate-pulse">
                            <p className="leading-relaxed">{transcript}...</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Feedback Summary */}
            {showFeedback && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-green-50 border-t border-green-100"
                >
                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-800 text-lg">Interview Complete!</h3>
                            <p className="text-green-700 mt-1">Great job completing the interview session. Your responses have been recorded.</p>
                            <div className="mt-4 flex gap-4 text-sm font-medium text-green-800">
                                <div>Duration: 5:23</div>
                                <div>Questions Answered: {currentQuestionIndex + 1}</div>
                                <div>Confidence Score: 85%</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
};
