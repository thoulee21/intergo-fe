import { apiClient } from "@/services/advanced-axios";

export interface AvatarResponse {
  status: string;
  message: string;
  session_id?: string;
  request_id?: string;
  stream_url?: string;
}

export interface AvatarStatus {
  exists: boolean;
  connected: boolean;
  stream_url?: string;
  status?: any;
}

export const avatarAPI = {
  sendQuestionToAvatar: (sessionId: string, question: string) => {
    return apiClient.post<AvatarResponse>("/avatar/send-question", {
      session_id: sessionId,
      question,
    });
  },

  getAvatarStatus: (sessionId: string) => {
    return apiClient.get<AvatarStatus>(
      `/avatar/status?session_id=${sessionId}`,
    );
  },
};
