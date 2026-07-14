import api from "./api";

export async function getFaculty() {
    const res = await api.get("/faculty");
    return res.data;
}

export type FacultyWorkspaceSection =
    | "timetable"
    | "announcements"
    | "attendance"
    | "marks"
    | "subjects"
    | "assignments"
    | "notices"
    | "messages"
    | "reports";

export async function getFacultyWorkspace() {
    const res = await api.get("/faculty/workspace");
    return res.data;
}

export async function getFacultyClasses() {
    const res = await api.get("/faculty/classes");
    return res.data;
}

export async function getFacultyClassStudents(classId: string) {
    const res = await api.get(`/faculty/classes/${classId}/students`);
    return res.data;
}

export async function saveFacultyClassAttendance(classId: string, data: Record<string, unknown>) {
    const res = await api.post(`/faculty/classes/${classId}/attendance`, data);
    return res.data;
}

export async function updateFacultyProfile(data: Record<string, unknown>) {
    const res = await api.put("/faculty/workspace/profile", data);
    return res.data;
}

export async function addFacultyWorkspaceItem(section: FacultyWorkspaceSection, data: Record<string, unknown>) {
    const res = await api.post(`/faculty/workspace/${section}`, data);
    return res.data;
}

export async function updateFacultyWorkspaceItem(
    section: FacultyWorkspaceSection,
    itemId: string,
    data: Record<string, unknown>
) {
    const res = await api.put(`/faculty/workspace/${section}/${itemId}`, data);
    return res.data;
}

export async function deleteFacultyWorkspaceItem(section: FacultyWorkspaceSection, itemId: string) {
    const res = await api.delete(`/faculty/workspace/${section}/${itemId}`);
    return res.data;
}
