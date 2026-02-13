import { apiClient } from "@/services/advanced-axios";

export const recruiterAPI = {
  getCandidates: () => {
    return apiClient.get("/recruiter/candidates");
  },

  getCandidateDetail: (id: number) => {
    return apiClient.get(`/recruiter/candidates/${id}`);
  },

  getCandidateSessions: (id: number) => {
    return apiClient.get(`/recruiter/candidates/${id}/sessions`);
  },

  getSessionAnalysis: (sessionId: string) => {
    return apiClient.get(`/recruiter/sessions/${sessionId}/analysis`);
  },

  getDashboardStats: () => {
    return apiClient.get("/recruiter/dashboard/stats");
  },

  getRecruiterPresets: () => {
    return apiClient.get("/recruiter/presets");
  },

  createRecruiterPreset: (data: any) => {
    return apiClient.post("/recruiter/presets", data);
  },

  updateRecruiterPreset: (id: number, data: any) => {
    return apiClient.put(`/recruiter/presets/${id}`, data);
  },

  deleteRecruiterPreset: (id: number) => {
    return apiClient.delete(`/recruiter/presets/${id}`);
  },

  assignPresetToCandidate: (data: {
    candidate_id: number;
    preset_id: number | null;
  }) => {
    return apiClient.post("/recruiter/presets/assign", data);
  },

  getCandidateAssignments: () => {
    return apiClient.get("/recruiter/presets/assignments");
  },

  removeCandidate: (candidateId: number) => {
    return apiClient.delete(`/recruiter/candidates/${candidateId}`);
  },

  exportInterviewReport: (
    sessionId: string,
    format: "pdf" | "docx" = "pdf",
  ) => {
    return apiClient.get(
      `/export-interview-report/${sessionId}?format=${format}`,
      {
        responseType: "blob",
      },
    );
  },

  getCandidateInterviewProgress: (id: string) => {
    return apiClient.get(`/recruiter/candidates/${id}/progress`);
  },
};
