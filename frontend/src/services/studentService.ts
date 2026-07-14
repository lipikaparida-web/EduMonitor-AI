import api from "./api";
import { Student } from "../types";

export type StudentForm = {
  roll_no: string;
  name: string;
  email: string;
  department: Student["department"];
  academic_year: string;
  semester: number;
  division: string;
  cgpa: number;
  attendance: number;
  skills: string;
  certifications: string;
  projects: string;
  resume_url: string;
  career_goal: string;
  placement_status: string;
};

const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

const toProjectList = (value: unknown) =>
  toList(value).map((project) => ({
    title: project,
    description: "",
    techStack: [],
  }));

export const normalizeStudent = (student: any): Student => ({
  id: String(student.id || student._id || student.roll_no || student.user_id || student.email || ""),
  rollNumber: student.roll_no || student.rollNumber || student.user_id || "",
  name: student.name || "",
  email: student.email || "",
  academicYear: student.academic_year || student.academicYear || student.Admission_Year || "",
  division: student.division || student.Division || student.Section || "A",
  department: student.department || "Computer Science",
  semester: Number(student.semester || 1),
  cgpa: Number(student.cgpa || 0),
  attendanceRate: Number(student.attendance ?? student.attendanceRate ?? 0),
  technicalSkills: toList(student.skills || student.technicalSkills),
  strengths: student.strengths || [],
  weaknesses: student.weaknesses || [],
  softSkills: student.softSkills || student.soft_skills || [],
  extracurriculars: student.extracurriculars || [],
  photoUrl:
    student.photoUrl ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      student.name || "Student"
    )}`,
  historySGPA: student.historySGPA || [],
  subjects: student.subjects || [],
  isEligibleForPlacement:
    student.placement_status === "Placed" ||
    student.isEligibleForPlacement === true,
  placementPredictions: student.placementPredictions || [],
  earlyWarningAlert: student.earlyWarningAlert || student.early_warning_alert || {
    type: "none",
    severity: "stable",
    details: "",
  },
  assignmentCompletion: Number(student.assignmentCompletion ?? 0),
  projects: Array.isArray(student.projects) ? student.projects : toProjectList(student.projects),
  certifications: toList(student.certifications),
  codingProfiles: student.codingProfiles || [],
  resumeUrl: student.resume_url || student.resumeUrl || "",
  careerGoal: student.career_goal || student.careerGoal || "",
  placementStatus:
    student.placement_status ||
    (student.isEligibleForPlacement ? "Placed" : "Active"),
  timetable: student.timetable || [],
  notifications: student.notifications || [],
  fees: student.fees || [],
  internships: student.internships || [],
});

export const getStudents = async () => {
  const response = await api.get("/students");

  return {
    data: response.data.map((student: any) => normalizeStudent(student)),
  };
};

export const getStudentProfile = async () => {
  const response = await api.get("/student/profile");
  return {
    data: normalizeStudent(response.data),
  };
};

export const addStudent = async (student: StudentForm) => {
  const response = await api.post("/students", createStudentPayload(student));
  return response.data;
};

export const updateStudent = async (studentId: string, student: StudentForm) => {
  const response = await api.put(
    `/students/${studentId}`,
    createStudentPayload(student)
  );
  return response.data;
};

export const deleteStudent = async (studentId: string) => {
  const response = await api.delete(`/students/${studentId}`);
  return response.data;
};

export const createStudentPayload = (form: StudentForm) => ({
  roll_no: form.roll_no.trim(),
  name: form.name.trim(),
  email: form.email.trim(),
  department: form.department,
  semester: Number(form.semester),
  cgpa: Number(form.cgpa),
  attendance: Number(form.attendance),
  academic_year: form.academic_year || "SY",
  division: form.division || "A",
  skills: toList(form.skills),
  certifications: toList(form.certifications),
  projects: toList(form.projects),
  resume_url: form.resume_url.trim(),
  career_goal: form.career_goal.trim(),
  placement_status: form.placement_status || "Active",
});

export const mapStudentToForm = (student: Student): StudentForm => ({
  roll_no: student.rollNumber || "",
  name: student.name || "",
  email: student.email || "",
  department: student.department || "Computer Science",
  academic_year: student.academicYear || "SY",
  semester: student.semester || 1,
  division: student.division || "A",
  cgpa: student.cgpa || 0,
  attendance: student.attendanceRate || 0,
  skills: (student.technicalSkills || []).join(", "),
  certifications: (student.certifications || []).join(", "),
  projects: (student.projects || [])
    .map((project) => project.title || "")
    .filter(Boolean)
    .join(", "),
  resume_url: student.resumeUrl || "",
  career_goal: student.careerGoal || "",
  placement_status: student.placementStatus || "Active",
});

export const createInitialStudentForm = (): StudentForm => ({
  roll_no: "",
  name: "",
  email: "",
  department: "Computer Science",
  academic_year: "SY",
  semester: 1,
  division: "A",
  cgpa: 0,
  attendance: 0,
  skills: "",
  certifications: "",
  projects: "",
  resume_url: "",
  career_goal: "",
  placement_status: "Active",
});
