import React, { useState } from "react";
import { LifeBuoy, Book, MessageCircle, AlertTriangle, ChevronDown, ChevronUp, Search, Send } from "lucide-react";

export default function HelpCenter() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    { q: "How do I update my profile picture?", a: "Go to the Settings page or My Profile page, click on your current avatar, and select a new image file to upload." },
    { q: "Where can I find the academic calendar?", a: "The Academic Calendar is accessible from the sidebar menu under 'Calendar'. It highlights exams, assignments, and events." },
    { q: "How do I reset my password?", a: "Navigate to My Profile > Security, enter your current password, and choose a new one. If you forgot your password, contact the IT desk." },
    { q: "Why am I not receiving notifications?", a: "Check your Notification settings under the Settings tab. Ensure email or push notifications are enabled for your account." },
    { q: "How does the AI Assistant work?", a: "The AI Assistant uses state-of-the-art models to analyze context (like your courses or grades) to provide personalized insights and answers." }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in w-full">
      <div className="text-center space-y-2 mb-8">
        <div className="w-20 h-20 bg-[var(--primary-pale)] border-2 border-[var(--primary)] rounded-2xl mx-auto flex items-center justify-center shadow-[var(--shadow-orange)] mb-4">
          <LifeBuoy className="w-10 h-10 text-[var(--primary)]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Help Center</h1>
        <p className="text-[12px] text-[var(--text-muted)] font-medium">Find answers, documentation, or contact support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Docs & Contact */}
        <div className="space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:border-[var(--primary)] transition-colors cursor-pointer group">
            <Book className="w-8 h-8 text-[var(--primary)] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[15px] mb-1">User Guide</h3>
            <p className="text-[12px] text-[var(--text-muted)]">Read the comprehensive manual for using EduMonitor effectively.</p>
          </div>
          
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[14px] mb-4 flex items-center gap-2"><MessageCircle size={16} className="text-[var(--primary)]"/> Contact Support</h3>
            {ticketSent ? (
              <div className="bg-green-50 text-green-700 text-[12px] font-bold p-4 rounded-xl text-center border border-green-200">
                Support ticket sent successfully!
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-3">
                <select className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-[var(--primary)]">
                  <option>General Inquiry</option>
                  <option>Technical Issue</option>
                  <option>Billing / Fees</option>
                  <option>Feature Request</option>
                </select>
                <textarea 
                  required
                  placeholder="Describe your issue..." 
                  rows={3}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-[var(--primary)] resize-none"
                />
                <button type="submit" className="btn-primary w-full py-2 rounded-xl text-[12px] font-bold flex justify-center items-center gap-2">
                  <Send size={14}/> Submit Ticket
                </button>
              </form>
            )}
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:bg-red-100 transition-colors">
            <h3 className="font-bold text-[14px] text-red-700 mb-1 flex items-center gap-2"><AlertTriangle size={16}/> Report Bug</h3>
            <p className="text-[11px] text-red-600 font-medium">Found a technical glitch? Let our engineers know immediately.</p>
          </div>
        </div>

        {/* Right Column: FAQs */}
        <div className="md:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-[16px] mb-4 flex items-center gap-2"><LifeBuoy size={18} className="text-[var(--primary)]"/> Frequently Asked Questions</h3>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-[12px] font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
              <div key={i} className="border border-[var(--border-light)] rounded-xl overflow-hidden bg-[var(--bg)]">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 text-[13px] font-bold flex justify-between items-center hover:bg-[var(--surface-raised)] transition-colors cursor-pointer"
                >
                  {faq.q}
                  {activeFaq === i ? <ChevronUp size={16} className="text-[var(--primary)] shrink-0"/> : <ChevronDown size={16} className="text-[var(--text-muted)] shrink-0"/>}
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-[12px] text-[var(--text-2)] leading-relaxed animate-fade-in border-t border-[var(--border-light)] border-dashed mt-1 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )) : (
               <div className="text-center p-8 text-[var(--text-muted)]">
                 <p className="text-[13px] font-bold">No FAQs found matching "{searchQuery}"</p>
                 <p className="text-[11px] mt-1">Try different keywords or submit a support ticket.</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
