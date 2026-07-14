import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from "lucide-react";

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 14)); // July 14, 2026

  const daysInMonth = 31;
  const firstDayOfMonth = 3; // Wednesday (0 = Sun)

  const events = [
    { day: 15, title: "Midterm Exams", type: "exam", time: "09:00 AM" },
    { day: 18, title: "Project Submission", type: "assignment", time: "11:59 PM" },
    { day: 22, title: "Placement Drive (TCS)", type: "placement", time: "10:00 AM" },
    { day: 26, title: "Faculty Meeting", type: "meeting", time: "02:00 PM" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in w-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Academic Calendar</h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-1 font-medium">Manage your schedule, exams, and important events.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[12px] font-bold shadow-sm hover:bg-[var(--bg)] cursor-pointer">Today</button>
          <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden p-1">
            <button className="p-1 hover:bg-[var(--bg)] rounded-lg text-[var(--text-2)] cursor-pointer"><ChevronLeft size={16}/></button>
            <span className="px-3 text-[13px] font-bold w-32 text-center text-[var(--text)]">July 2026</span>
            <button className="p-1 hover:bg-[var(--bg)] rounded-lg text-[var(--text-2)] cursor-pointer"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Empty cells before 1st */}
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} className="h-28 rounded-xl border border-dashed border-[var(--border-light)] bg-[var(--bg)] opacity-50"></div>
          ))}

          {/* Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday = day === 14;
            const dayEvents = events.filter(e => e.day === day);

            return (
              <div 
                key={day} 
                className={`h-28 rounded-xl border p-2 flex flex-col transition-colors group cursor-pointer hover:border-[var(--primary)] hover:shadow-sm relative ${
                  isToday 
                    ? "border-[var(--primary)] bg-[var(--primary-pale)]" 
                    : "border-[var(--border)] bg-white hover:bg-[var(--bg)]"
                }`}
              >
                <span className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                  isToday ? "bg-[var(--primary)] text-white shadow-[var(--shadow-orange)]" : "text-[var(--text-2)] group-hover:text-[var(--text)]"
                }`}>
                  {day}
                </span>

                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                  {dayEvents.map((evt, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[9px] font-bold px-1.5 py-1 rounded border leading-tight truncate ${
                        evt.type === 'exam' ? 'bg-red-50 text-red-700 border-red-200' :
                        evt.type === 'assignment' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        evt.type === 'placement' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                      title={`${evt.title} at ${evt.time}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Upcoming Events List */}
      <div className="mt-8">
        <h3 className="font-bold text-[14px] mb-4 text-[var(--text)] flex items-center gap-2">
          <Clock size={16} className="text-[var(--primary)]"/> Upcoming Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((evt, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
              <span className="text-[10px] font-bold text-[var(--text-muted)] mb-1 block">July {evt.day}, 2026 • {evt.time}</span>
              <h4 className="text-[13px] font-bold text-[var(--text)] mb-3">{evt.title}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                  evt.type === 'exam' ? 'bg-red-50 text-red-700 border-red-200' :
                  evt.type === 'assignment' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  evt.type === 'placement' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {evt.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
