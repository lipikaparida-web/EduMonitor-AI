import api from "./api";

export const getCareerRecommendation = (data: any) =>
  api.post("/api/gemini/chat", data);

export const getPlacementPrediction = (data: any) =>
  api.post("/api/gemini/placement", data);

export const getResumeEvaluation = (data: any) =>
  api.post("/api/gemini/resume-eval", data);

export const getInterviewPrep = (data: any) =>
  api.post("/api/gemini/interview-prep", data);

export const getCompanyRecommendations = (data: any) =>
  api.post("/api/gemini/company-recs", data);

export const getStudentReport = (data: any) =>
  api.post("/api/gemini/report", data);
