import { apiClient, clearCache } from "@/services/advanced-axios";
import eventBus from "@/utils/eventBus";

export const authAPI = {
  login: async (data: { username: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);

    clearCache(/\/auth\/validate-session/);

    eventBus.publish("AUTH_STATE_CHANGED", { authenticated: true });
    return response;
  },
  register: async (data: {
    username: string;
    password: string;
    email?: string;
    user_type: "candidate" | "recruiter";
    invitation_code?: string;
  }) => {
    const response = await apiClient.post("/auth/register", data);
    return response;
  },

  generateInvitationCode: () => {
    return apiClient.post("/auth/invitation/generate");
  },

  getInvitationCode: () => {
    return apiClient.get("/auth/invitation/code");
  },

  getInvitedCandidates: () => {
    return apiClient.get("/auth/invitation/candidates");
  },

  validateInvitationCode: (invitationCode: string) => {
    return apiClient.post("/auth/invitation/validate", {
      invitation_code: invitationCode,
    });
  },

  getUserProfile: () => {
    return apiClient.get("/auth/profile");
  },

  updateProfile: async (data: { email?: string }) => {
    const response = await apiClient.put("/auth/update-profile", data);
    return response;
  },
  changePassword: async (data: {
    old_password: string;
    new_password: string;
  }) => {
    const response = await apiClient.post("/auth/change-password", data);
    return response;
  },

  changeInvitationCode: async (data: { invitation_code: string }) => {
    const response = await apiClient.post("/auth/change-invitation-code", data);
    return response;
  },

  isAuthenticated: async () => {
    if (!window) return false;

    try {
      const userInfo = await apiClient.get("/auth/validate-session");
      return userInfo.data.valid;
    } catch (error) {
      console.error("验证用户身份失败:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");

      clearCache();

      eventBus.publish("AUTH_STATE_CHANGED", { authenticated: false });
    } catch (error) {
      console.error("登出时发生错误:", error);
    }
  },

  getUserSessions: () => {
    return apiClient.get("/auth/my-sessions");
  },

  validateSession: (useCache = true) => {
    return apiClient.get("/auth/validate-session", {
      noCache: !useCache,
    });
  },
};
