import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, X, CheckCircle, AlertCircle, FileText, XCircle } from "lucide-react";
import EmptyState from "./EmptyState";

interface TopHeaderProps {
  title: string;
  role: "student" | "faculty" | "admin";
  extraElements?: React.ReactNode;
}

export default function TopHeader({ title, role, extraElements }: TopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock Notifications based on role
  const notifications = [
    ...(role === "student" ? [
      { id: 1, title: "Assignment Due", desc: "OS Assignment due in 2 hours", type: "warning", icon: <AlertCircle size={14} />, time: "2h ago", read: false },
      { id: 2, title: "Result Published", desc: "Midterm results are out", type: "success", icon: <CheckCircle size={14} />, time: "1d ago", read: true },
    ] : role === "faculty" ? [
      { id: 1, title: "Assignment Submitted", desc: "5 students submitted OS Assignment", type: "info", icon: <FileText size={14} />, time: "1h ago", read: false },
      { id: 2, title: "Attendance Pending", desc: "Mark attendance for CS-302", type: "warning", icon: <AlertCircle size={14} />, time: "4h ago", read: false },
    ] : [
      { id: 1, title: "Leave Request", desc: "Dr. Smith applied for leave", type: "info", icon: <FileText size={14} />, time: "30m ago", read: false },
      { id: 2, title: "System Notice", desc: "Server maintenance at 2 AM", type: "warning", icon: <AlertCircle size={14} />, time: "2h ago", read: false },
    ])
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="hidden md:flex h-16 bg-[var(--surface)] border-b border-[var(--border)] items-center justify-between px-8 shrink-0 relative z-30 shadow-sm w-full">
      
      {/* Title */}
      <div className="flex items-center min-w-[200px]">
        <h1 className="text-[17px] font-bold text-[var(--text)]">{title}</h1>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${role} portal...`}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-full pl-10 pr-4 py-2 text-[12px] font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-pale)] transition-all text-[var(--text)]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]">
              <XCircle size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Extra Elements (e.g. Semester Chip) */}
        {extraElements}

        {/* Notification Center */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[var(--text-2)] hover:text-[var(--primary)] hover:bg-[var(--primary-pale)] rounded-xl transition-all cursor-pointer"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--danger)] rounded-full border-2 border-[var(--surface)]"></span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-[var(--border)] bg-[var(--bg)] flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-[var(--text)]">Notifications</h3>
                <div className="flex gap-2">
                  <button className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer">Mark all read</button>
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-[var(--border-light)] hover:bg-[var(--bg)] transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-[var(--primary-pale)]/30' : ''}`}>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          notif.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                          notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {notif.icon}
                        </div>
                        <div>
                          <h4 className="text-[12px] font-bold text-[var(--text)] flex items-center gap-2">
                            {notif.title}
                            {!notif.read && <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>}
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-relaxed">{notif.desc}</p>
                          <span className="text-[9px] font-bold text-[var(--text-muted)] mt-1.5 block">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6">
                    <EmptyState 
                      icon={<Bell size={24} />}
                      title="No Notifications"
                      message="You're all caught up!"
                    />
                  </div>
                )}
              </div>
              
              <div className="p-2 border-t border-[var(--border)] bg-[var(--bg)] text-center">
                <button className="text-[11px] font-bold text-[var(--text-2)] hover:text-[var(--text)] transition-colors p-2 w-full cursor-pointer">
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
