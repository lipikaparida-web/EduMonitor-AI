import React, { useState } from "react";
import { UserCog, Pencil, Save, Mail, Phone, MapPin, Calendar, Building, Fingerprint } from "lucide-react";

interface ProfileProps {
  role: "student" | "faculty" | "admin";
  data: any;
}

export default function Profile({ role, data }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1000);
  };

  const fields = [
    { key: "name", label: "Full Name", icon: <UserCog size={14}/> },
    { key: "email", label: "Email Address", icon: <Mail size={14}/> },
    { key: "phone", label: "Phone Number", icon: <Phone size={14}/> },
    { key: "department", label: "Department", icon: <Building size={14}/> },
    ...(role === "student" ? [
      { key: "roll_no", label: "Student ID", icon: <Fingerprint size={14}/> },
      { key: "semester", label: "Semester", icon: <Calendar size={14}/> }
    ] : [
      { key: "designation", label: "Designation", icon: <Building size={14}/> }
    ]),
    { key: "address", label: "Address", icon: <MapPin size={14}/> },
    { key: "dob", label: "Date of Birth", icon: <Calendar size={14}/> }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in w-full">
      <div className="text-center space-y-2 mb-8">
        <div className="w-20 h-20 bg-[var(--primary-pale)] border-2 border-[var(--primary)] rounded-2xl mx-auto flex items-center justify-center shadow-[var(--shadow-orange)] mb-4">
          <UserCog className="w-10 h-10 text-[var(--primary)]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">My Profile</h1>
        <p className="text-[12px] text-[var(--text-muted)] font-medium">Manage your personal information and account security.</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
        
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-[12px] font-bold rounded-xl border border-green-200 text-center animate-fade-in">
            {successMsg}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Photo */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="relative group">
              <img 
                src={formData.photoUrl || formData.photo_url || `https://ui-avatars.com/api/?name=${formData.name}&background=random`} 
                alt="Profile" 
                className="w-32 h-32 rounded-2xl object-cover border-4 border-[var(--surface-raised)] shadow-md"
              />
              <label className="absolute inset-0 bg-black/50 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Pencil size={20} className="mb-1" />
                <span className="text-[10px] font-bold">Change Photo</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            <div className="text-center">
              <span className="bg-[var(--primary-pale)] text-[var(--primary)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border-orange)] uppercase tracking-widest">
                {role}
              </span>
            </div>
          </div>

          {/* Right Column: Form */}
          <form onSubmit={handleSave} className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-[15px] text-[var(--text)]">Personal Information</h3>
              {!isEditing && (
                <button type="button" onClick={() => setIsEditing(true)} className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer">
                  <Pencil size={12}/> Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    {f.icon} {f.label}
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData[f.key] || ""} 
                      onChange={(e) => setFormData({...formData, [f.key]: e.target.value})}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none"
                    />
                  ) : (
                    <div className="text-[13px] font-semibold text-[var(--text)] py-2 border-b border-[var(--border-light)] min-h-[36px]">
                      {formData[f.key] || "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">About Me</label>
              {isEditing ? (
                <textarea 
                  value={formData.about || ""} 
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  rows={3}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none resize-none"
                />
              ) : (
                <div className="text-[13px] font-medium text-[var(--text-2)] leading-relaxed">
                  {formData.about || "No bio provided."}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsEditing(false); setFormData(data); }} className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--surface-raised)] cursor-pointer transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary px-6 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50">
                  <Save size={16}/> {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
