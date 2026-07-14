import React, { useState } from "react";
import { Settings as SettingsIcon, Shield, Bell, Moon, Globe, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = () => {
    setSavedMsg("Settings saved successfully");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const tabs = [
    { id: "account", label: "Account", icon: <SettingsIcon size={16}/> },
    { id: "security", label: "Security", icon: <Shield size={16}/> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16}/> },
    { id: "appearance", label: "Appearance", icon: <Moon size={16}/> },
    { id: "language", label: "Language", icon: <Globe size={16}/> },
    { id: "privacy", label: "Privacy", icon: <Lock size={16}/> },
    { id: "accessibility", label: "Accessibility", icon: <Eye size={16}/> }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Settings</h1>
          <p className="text-[12px] text-[var(--text-muted)] font-medium mt-1">Manage your platform preferences and security.</p>
        </div>
        {savedMsg && (
          <span className="text-[11px] font-bold text-[var(--success)] flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 animate-fade-in">
            <CheckCircle2 size={14}/> {savedMsg}
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 shadow-sm h-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-[var(--primary)] text-white shadow-sm" 
                  : "text-[var(--text-2)] hover:bg-[var(--primary-pale)] hover:text-[var(--primary)]"
              }`}
            >
              <span className={activeTab === tab.id ? "text-white" : "text-[var(--text-muted)]"}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm min-h-[400px]">
          
          {activeTab === "account" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-[15px] font-bold border-b border-[var(--border-light)] pb-3">Account Preferences</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)] border-dashed">
                  <div>
                    <h4 className="text-[13px] font-bold">Email Communications</h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">Receive platform updates via email.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)] border-dashed">
                  <div>
                    <h4 className="text-[13px] font-bold">Two-Factor Authentication</h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer">Enable</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-[15px] font-bold border-b border-[var(--border-light)] pb-3">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-[13px] focus:border-[var(--primary)] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">New Password</label>
                  <input type="password" placeholder="Minimum 8 characters" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-[13px] focus:border-[var(--primary)] focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
             <div className="space-y-6 animate-fade-in">
               <h3 className="text-[15px] font-bold border-b border-[var(--border-light)] pb-3">Theme Settings</h3>
               <div className="grid grid-cols-3 gap-4">
                 {['Light', 'Dark', 'System'].map(theme => (
                   <div key={theme} className="border border-[var(--border)] rounded-xl p-4 text-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-pale)] transition-colors">
                     <span className="text-[13px] font-bold">{theme}</span>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* Placeholders for others */}
          {!["account", "security", "appearance"].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
               <SettingsIcon size={40} className="text-[var(--primary)] opacity-50 mb-4" />
               <h4 className="font-bold text-[14px] uppercase tracking-wider">{activeTab} Settings</h4>
               <p className="text-[12px] text-[var(--text-muted)] mt-2 max-w-xs">Configuration options for this section are managed globally by the institution.</p>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-[var(--border)] flex justify-end">
            <button onClick={handleSave} className="btn-primary px-6 py-2 rounded-xl text-[12px] font-bold shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform">
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
