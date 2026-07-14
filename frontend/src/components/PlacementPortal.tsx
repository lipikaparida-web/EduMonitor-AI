import { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  Briefcase,
  Building2,
  CheckCircle,
  LogOut,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Student } from "../types";
import { getPlacements } from "../services/placementService";

interface PlacementPortalProps {
  students: Student[];
  onLogout: () => void;
}

export default function PlacementPortal({ students, onLogout }: PlacementPortalProps) {
  const [placements, setPlacements] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlacements = async () => {
      try {
        const data = await getPlacements();
        setPlacements(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Unable to load placements.");
      }
    };

    loadPlacements();
  }, []);

  const placementReadyStudents = students.filter(
    (student) => student.cgpa >= 7 && student.attendanceRate >= 75
  );

  const filteredPlacements = placements.filter((placement) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return [
      placement.company_name,
      placement.job_role,
      placement.location,
      ...(placement.required_skills || []),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const averagePackage = useMemo(() => {
    if (!placements.length) return 0;
    return (
      placements.reduce((total, placement) => total + Number(placement.package || 0), 0) /
      placements.length
    ).toFixed(2);
  }, [placements]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0F172A] text-white hidden lg:flex flex-col z-40">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight">EduMonitor</h1>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Placement Office</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <div className="bg-terracotta-500 text-white font-bold shadow-lg shadow-terracotta-900/20 flex items-center gap-3 px-4 py-3 rounded-xl text-sm">
            <BarChart2 className="w-4.5 h-4.5" /> Placement Dashboard
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Placement Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">Track campus drives, eligible students, and company opportunities.</p>
          </div>
          <button
            onClick={onLogout}
            className="lg:hidden bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {([
            ["Eligible Students", placementReadyStudents.length, Users],
            ["Placement Drives", placements.length, Building2],
            ["Selected", students.filter((student) => student.isEligibleForPlacement).length, CheckCircle],
            ["Avg Package", `${averagePackage} LPA`, TrendingUp],
          ] as Array<[string, string | number, LucideIcon]>).map(([label, value, Icon]) => (
            <div key={String(label)} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{String(label)}</span>
                <Icon className="w-4 h-4 text-terracotta-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 block mt-2">{String(value)}</span>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-950 text-sm tracking-tight uppercase">Campus Drives</h2>
              <p className="text-xs text-slate-500 mt-1">Companies, roles, packages, eligibility, and deadlines.</p>
            </div>
            <div className="relative md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search company, role, skill..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-terracotta-500 font-medium"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Company", "Role", "Package", "Min CGPA", "Departments", "Deadline"].map((header) => (
                    <th key={header} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlacements.map((placement) => (
                  <tr key={placement.id || placement._id || `${placement.company_name}-${placement.job_role}`} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-xs font-bold text-slate-900">{placement.company_name}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{placement.job_role}</td>
                    <td className="px-4 py-3 text-xs font-bold text-terracotta-600">{placement.package} LPA</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{placement.minimum_cgpa}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{(placement.eligible_departments || []).join(", ")}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700">{placement.deadline}</td>
                  </tr>
                ))}
                {filteredPlacements.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-xs font-semibold text-slate-500">
                      No placement drives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
