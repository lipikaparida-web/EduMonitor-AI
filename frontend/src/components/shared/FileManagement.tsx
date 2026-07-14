import React, { useState } from "react";
import { Folder, FileText, Upload, Search, Download, Trash2, File, Image as ImageIcon, FileArchive, MoreVertical } from "lucide-react";

interface FileManagementProps {
  role: "student" | "faculty" | "admin";
}

export default function FileManagement({ role }: FileManagementProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = role === "student" 
    ? ["All", "Notes", "Assignments", "Certificates"]
    : role === "faculty"
    ? ["All", "Lecture Notes", "PPTs", "Assignments", "Research"]
    : ["All", "Documents", "Reports", "Policies"];

  const mockFiles = [
    { id: 1, name: "Data_Structures_Midterm.pdf", type: "pdf", category: "Notes", size: "2.4 MB", date: "Oct 12, 2026" },
    { id: 2, name: "OS_Assignment_1.docx", type: "doc", category: "Assignments", size: "1.1 MB", date: "Oct 15, 2026" },
    { id: 3, name: "Annual_Report_2025.pdf", type: "pdf", category: "Reports", size: "5.7 MB", date: "Jan 10, 2026" },
    { id: 4, name: "Machine_Learning_Ch1.pptx", type: "ppt", category: "PPTs", size: "14.2 MB", date: "Sep 05, 2026" },
    { id: 5, name: "AWS_Cloud_Certificate.png", type: "img", category: "Certificates", size: "3.8 MB", date: "Nov 20, 2026" },
    { id: 6, name: "Student_Handbook.pdf", type: "pdf", category: "Policies", size: "1.9 MB", date: "Aug 01, 2026" },
    { id: 7, name: "Research_Dataset.zip", type: "zip", category: "Research", size: "45.0 MB", date: "Oct 01, 2026" }
  ];

  // Filter based on role categories (simulating backend filtering)
  const roleFiles = mockFiles.filter(f => categories.includes(f.category) || f.category === "Documents" || f.category === "Notes");
  
  const filteredFiles = roleFiles.filter(f => 
    (activeCategory === "All" || f.category === activeCategory) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'doc': return <File className="text-blue-500" />;
      case 'ppt': return <File className="text-orange-500" />;
      case 'img': return <ImageIcon className="text-green-500" />;
      case 'zip': return <FileArchive className="text-purple-500" />;
      default: return <File className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in w-full h-full flex flex-col">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">File Management</h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-1 font-medium">Organize, upload, and manage your files securely.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold shadow-sm">
          <Upload size={16}/> Upload File
        </button>
      </div>

      <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg)] gap-4 shrink-0">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? "bg-[var(--primary)] text-white shadow-sm" 
                    : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative shrink-0 w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2 text-[12px] font-medium focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[var(--bg)] relative">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
          
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
              {filteredFiles.map(file => (
                <div key={file.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg)] border border-[var(--border-light)] flex items-center justify-center">
                      {getIcon(file.type)}
                    </div>
                    <button className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16}/>
                    </button>
                  </div>
                  <h4 className="font-bold text-[13px] text-[var(--text)] line-clamp-1 mb-1" title={file.name}>{file.name}</h4>
                  <div className="flex justify-between items-center mt-auto pt-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--border-light)]">
                      {file.category}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">{file.size}</span>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="w-8 h-8 bg-white text-[var(--text)] rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--primary)] hover:text-white transition-colors" title="Download">
                      <Download size={14}/>
                    </button>
                    <button className="w-8 h-8 bg-white text-[var(--text)] rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 relative z-10">
              <Folder size={48} className="text-[var(--primary)] opacity-50 mb-4" />
              <h3 className="text-[16px] font-bold text-[var(--text)] mb-2">No files found</h3>
              <p className="text-[12px] text-[var(--text-muted)] max-w-sm mb-6">
                Try adjusting your search or filter criteria, or upload a new file to this directory.
              </p>
              <button className="btn-primary px-5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2">
                <Upload size={16}/> Upload New File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
