import { apiClient } from "@/services/advanced-axios";

export const interviewAPI = {
  startInterview: (data: {
    positionType: string;
    difficulty: string;
    questionCount?: number;
    includeCodeExercise?: boolean;
    includeBehavioralQuestions?: boolean;
    includeStressTest?: boolean;
    interviewerStyle?: string;
    interviewMode?: string;
    industryFocus?: string;
    companySize?: string;
    customPrompt?: string;
  }) => {
    return apiClient.post("/start-interview", data);
  },

  getPositionTypes: () => {
    return apiClient.get("/position-types");
  },
  getInterviewPresets: () => {
    return apiClient.get("/interview-presets");
  },

  getAssignedPresets: () => {
    return apiClient.get("/assigned-presets");
  },

  getUserInterviewProgress: () => {
    return apiClient.get("/interview-progress");
  },

  answerQuestion: (sessionId: string, answer: string) => {
    return apiClient.post("/answer-question", {
      session_id: sessionId,
      answer: answer,
    });
  },

  multimodalAnalysis: (videoBlob: Blob, sessionId: string | null = null) => {
    const formData = new FormData();
    formData.append("video", videoBlob);
    if (sessionId) {
      formData.append("session_id", sessionId);
    }

    return apiClient.post("/multimodal-analysis", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getInterviewResults: (sessionId: string) => {
    return apiClient.get(`/interview-results/${sessionId}`);
  },

  sendHeartbeat: (sessionId: string) => {
    return apiClient.post("/heartbeat", {
      session_id: sessionId,
    });
  },

  getSessionStatus: (sessionId: string) => {
    return apiClient.get("/session-status", {
      params: { session_id: sessionId },
    });
  },

  cleanupSession: (sessionId: string, force: boolean = false) => {
    return apiClient.post("/cleanup-session", {
      session_id: sessionId,
      force: force,
    });
  },

  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);

    return apiClient.post("/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteResume: () => {
    return apiClient.delete("/delete-resume");
  },

  getAllSessions: (params?: { userId?: number }) => {
    return apiClient.get("/admin/sessions", { params });
  },

  getSessionDetails: (sessionId: string) => {
    return apiClient.get(`/admin/sessions/${sessionId}`);
  },

  deleteSession: (sessionId: string) => {
    return apiClient.delete(`/admin/sessions/${sessionId}`);
  },

  getAdminPositionTypes: () => {
    return apiClient.get("/admin/position-types");
  },

  getPositionTypeDetail: (id: string) => {
    return apiClient.get(`/admin/position-types/${id}`);
  },

  createPositionType: (data: unknown) => {
    return apiClient.post("/admin/position-types", data);
  },

  updatePositionType: (id: string, data: unknown) => {
    return apiClient.put(`/admin/position-types/${id}`, data);
  },

  deletePositionType: (id: string) => {
    return apiClient.delete(`/admin/position-types/${id}`);
  },

  getAllUsers: () => {
    return apiClient.get("/admin/users");
  },

  getUserDetail: (id: string) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  createUser: (data: {
    username: string;
    password?: string;
    email?: string;
    is_admin?: boolean;
    user_type?: "candidate" | "recruiter";
  }) => {
    return apiClient.post("/admin/users", data);
  },
  updateUser: (
    id: string,
    data: {
      email?: string;
      is_admin?: boolean;
      user_type?: "candidate" | "recruiter";
      status?: string;
    },
  ) => {
    return apiClient.put(`/admin/users/${id}`, data);
  },

  deleteUser: (id: string) => {
    return apiClient.delete(`/admin/users/${id}`);
  },

  resetUserPassword: (id: string) => {
    return apiClient.post(`/admin/users/${id}/reset-password`);
  },

  deleteUserResume: (id: string) => {
    return apiClient.delete(`/admin/users/${id}/resume`);
  },

  getUserInterviewProgressAdmin: (id: string) => {
    return apiClient.get(`/admin/users/${id}/progress`);
  },

  getUserResumeBackups: (id: string) => {
    return apiClient.get(`/admin/users/${id}/resume-backups`);
  },

  downloadUserResumeBackup: (id: string, filename: string) => {
    return apiClient.get(
      `/admin/users/${id}/resume-backups/download?filename=${encodeURIComponent(filename)}`,
      {
        responseType: "blob",
      },
    );
  },

  updatePreset: (
    id: number,
    payload: {
      name: string;
      description: string;
      interviewParams: any;
    },
  ) => {
    return apiClient.put(`/admin/presets/${id}`, payload);
  },

  createPreset: (payload: {
    name: string;
    description: string;
    interviewParams: any;
  }) => {
    return apiClient.post("/admin/presets", payload);
  },

  deletePreset: (id: number) => {
    return apiClient.delete(`/admin/presets/${id}`);
  },

  getAllLearningPaths: () => {
    return apiClient.get("/admin/learning-paths");
  },

  getLearningPathDetail: (id: number) => {
    return apiClient.get(`/admin/learning-paths/${id}`);
  },

  deleteLearningPath: (id: number) => {
    return apiClient.delete(`/admin/learning-paths/${id}`);
  },

  getUserLearningPaths: () => {
    return apiClient.get(`/learning-paths`);
  },

  getUserLearningPathDetail: (id: number) => {
    return apiClient.get(`/learning-paths/${id}`);
  },

  canCreateLearningPath: () => {
    return apiClient.get(`/learning-paths/can-create`);
  },

  createLearningPath: (data: { positionTypes: number[] }) => {
    return apiClient.post(`/learning-paths`, data);
  },

  deleteUserLearningPath: (id: number) => {
    return apiClient.delete(`/learning-paths/${id}`);
  },
};
