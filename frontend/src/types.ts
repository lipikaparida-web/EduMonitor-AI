export interface SubjectScore {
  name: string;
  code: string;
  marks: number;
  maxMarks: number;
  attendance: number;
  facultyName: string;
}

export interface PlacementPrediction {
  role: string;
  probability: number; // 0 to 100
  status: "Highly Likely" | "Eligible with Prep" | "Needs Skill Upgrade" | "Ineligible";
  reason: string;
  missingSkills: string[];
  recommendedCertifications: string[];
}

export interface Student {
  id: string;
  rollNumber?: string;
  name: string;
  semester: number;
  department: "Computer Science" | "Information Technology" | "Electronics" | "Mechanical" | "Civil";
  email: string;
  academicYear?: string;
  division?: string;
  photoUrl: string;
  attendanceRate: number; // e.g. 85 for 85%
  cgpa: number;
  historySGPA: { semester: number; sgpa: number }[];
  subjects: SubjectScore[];
  strengths: string[];
  weaknesses: string[];
  technicalSkills: string[];
  softSkills: string[];
  extracurriculars: string[];
  isEligibleForPlacement: boolean;
  placementPredictions: PlacementPrediction[];
  projects?: { title: string; techStack: string[]; description: string }[];
  certifications?: string[];
  codingProfiles?: { platform: string; rating: string; solved: number; url?: string }[];
  resumeUrl?: string;
  careerGoal?: string;
  placementStatus?: string;
  earlyWarningAlert?: {
    type: "academic" | "attendance" | "both" | "none";
    severity: "critical" | "warning" | "stable";
    details: string;
  };
  assignmentCompletion?: number;
  timetable?: { day: string; time: string; subject_code: string; subject_name: string; room: string }[];
  notifications?: { id: string; title: string; body: string; audience?: string; recipient_email?: string; created_at?: string }[];
  fees?: { category: string; amount: number; paid: number; dueDate: string; status: string }[];
  internships?: { company: string; role: string; duration: string; description: string }[];
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  type: "attendance" | "academic" | "general";
  severity: "critical" | "warning";
  message: string;
  date: string;
  status: "active" | "resolved";
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: { code: string; name: string }[];
  photoUrl: string;
}

export interface Admin {
  name: string;
  email: string;
  role: string;
  department: string;
  photoUrl: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type UserRole =
  | "super_admin"
  | "admin"
  | "faculty"
  | "student"
  | "placement_officer";

export interface AuthUser {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  linked_record_id?: string;
}
