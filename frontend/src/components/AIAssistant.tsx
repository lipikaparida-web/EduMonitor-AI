import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BrainCircuit, Trash2, Plus, Copy, CheckCircle2, User, RefreshCw, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getCareerRecommendation } from "../services/aiServices";

type Role = "student" | "faculty" | "admin";

interface AIAssistantProps {
  role: Role;
  context?: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

const CONFIG = {
  student: {
    title: "EduMonitor AI Career Coach",
    welcome: "Hi! I'm your AI Career Coach. I can help you with academics, placements, resumes, interviews, study planning, and career guidance.",
    prompts: [
      "Explain this topic",
      "Create a study plan",
      "Review my resume",
      "Suggest projects",
      "Recommend certifications",
      "Prepare me for interviews",
      "Analyze my placement readiness",
      "Improve my DSA roadmap"
    ]
  },
  faculty: {
    title: "EduMonitor AI Teaching Assistant",
    welcome: "Hello Professor! I can help you create quizzes, assignments, lesson plans, analyze class performance, and support your teaching.",
    prompts: [
      "Generate quiz",
      "Create assignment",
      "Create lesson plan",
      "Analyze class performance",
      "Student risk analysis",
      "Generate rubric",
      "Suggest classroom activities",
      "Recommend learning resources"
    ]
  },
  admin: {
    title: "EduMonitor AI University Insights",
    welcome: "Welcome Administrator. I can help analyze institutional data, generate reports, identify risks, and provide strategic recommendations.",
    prompts: [
      "Institution health report",
      "Attendance analysis",
      "Department comparison",
      "Predict dropouts",
      "Placement analytics",
      "Fee collection summary",
      "Generate monthly report",
      "Resource planning"
    ]
  }
};

export default function AIAssistant({ role, context }: AIAssistantProps) {
  const cfg = CONFIG[role];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Map existing messages to AI service history format
      const history = messages.map(m => ({
        role: m.role === "ai" ? "model" : "user",
        text: m.text
      }));

      const { data } = await getCareerRecommendation({
        message: text.trim(),
        history,
        context: {
          scope: cfg.title,
          ...context
        }
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to EduMonitor AI. Please try again.");
      
      // Add a fallback fallback error message to the chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "I'm currently experiencing technical difficulties connecting to the intelligence server. Please verify your connection or try again shortly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)] overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)] shrink-0 z-10 relative shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-pale)] border border-[var(--border-orange)] flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="font-bold text-[16px] text-[var(--text)] flex items-center gap-2">
              {cfg.title} <Sparkles size={14} className="text-[var(--primary)]" />
            </h2>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"></span>
              Systems Online
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={clearChat} disabled={messages.length === 0} className="p-2 text-[var(--text-2)] hover:text-[var(--danger)] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer" title="Clear Chat">
            <Trash2 size={18} />
          </button>
          <button onClick={clearChat} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-xs cursor-pointer shadow-sm">
            <Plus size={16} /> New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 scroll-smooth z-10 custom-scrollbar">
          
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full animate-fade-in py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-3xl flex items-center justify-center shadow-[var(--shadow-orange)] mb-6 text-white border-4 border-white">
                <BrainCircuit className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--text)] mb-3 text-center">{cfg.title}</h3>
              <p className="text-[14px] text-[var(--text-muted)] font-medium text-center max-w-lg leading-relaxed mb-10">
                {cfg.welcome}
              </p>
              
              <div className="w-full">
                <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                  <Sparkles size={12} className="text-[var(--primary)]"/> Suggested Prompts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cfg.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-pale)] hover:shadow-sm p-4 rounded-xl text-left text-[13px] font-semibold text-[var(--text-2)] hover:text-[var(--primary)] transition-all cursor-pointer group flex justify-between items-center"
                    >
                      <span>{prompt}</span>
                      <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto w-full pb-6">
              {messages.map((msg, i) => (
                <div key={msg.id} className={`flex gap-4 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Avatar */}
                  <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)]' 
                        : 'bg-[var(--primary)] border-[var(--primary-dark)] text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={20} /> : <BrainCircuit size={20} />}
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">
                        {msg.role === 'user' ? 'You' : cfg.title}
                      </span>
                      <span className="text-[9px] font-semibold text-[var(--border-dark)] uppercase tracking-wider">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className={`relative p-5 text-[14px] leading-relaxed shadow-sm group ${
                      msg.role === 'user'
                        ? 'bg-[var(--primary)] text-white rounded-2xl rounded-tr-sm'
                        : 'bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)] rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.role === 'ai' ? (
                        <div className="prose prose-sm max-w-none prose-p:text-[var(--text-2)] prose-headings:text-[var(--text)] prose-strong:text-[var(--text)] prose-a:text-[var(--primary)] prose-code:text-[var(--primary)] prose-code:bg-[var(--primary-pale)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                      )}

                      {msg.role === 'ai' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className={`absolute -right-12 top-2 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-all ${copiedId === msg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} cursor-pointer`}
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <CheckCircle2 size={16} className="text-[var(--success)]" /> : <Copy size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] border-[var(--primary-dark)] text-white flex items-center justify-center shadow-sm border">
                      <BrainCircuit size={20} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-[85%] items-start">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">{cfg.title}</span>
                    </div>
                    <div className="p-5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3 min-w-[120px]">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center my-4 animate-fade-in">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-[13px] font-semibold max-w-lg shadow-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                    <button onClick={() => handleSend(messages[messages.length-1]?.text || "Hello")} className="ml-auto underline text-red-800 hover:text-red-900 cursor-pointer">Retry</button>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-[var(--bg)] border-t border-[var(--border)] shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your prompt here... (Shift + Enter for new line)"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl pl-5 pr-16 py-4 text-[14px] font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-pale)] text-[var(--text)] shadow-inner resize-none min-h-[60px] max-h-[200px] custom-scrollbar transition-all"
            rows={1}
            disabled={isLoading}
            style={{ height: input ? 'auto' : '60px' }}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 btn-primary rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] font-semibold text-[var(--text-muted)]">
             EduMonitor AI can make mistakes. Consider verifying critical academic or placement information.
          </p>
        </div>
      </div>

    </div>
  );
}
