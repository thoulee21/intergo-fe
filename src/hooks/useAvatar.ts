import { avatarAPI, AvatarStatus } from "@/services/api/avatarAPI";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAvatarOptions {
  sessionId: string;
  onError?: (error: Error) => void;
}

export default function useAvatar({ sessionId, onError }: UseAvatarOptions) {
  const isInitializedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AvatarStatus | null>(null);

  const getStatus = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await avatarAPI.getAvatarStatus(sessionId);
      const avatarStatus = response.data;
      setStatus(avatarStatus);
    } catch (err) {
      console.error("获取虚拟人状态失败:", err);
    }
  }, [sessionId]);

  const sendQuestion = useCallback(
    async (question: string) => {
      if (!sessionId) {
        const error = new Error("虚拟人未连接，无法发送问题");
        setError(error.message);
        onError?.(error);
        return;
      }

      try {
        const response = await avatarAPI.sendQuestionToAvatar(
          sessionId,
          question,
        );

        if (response.data.status === "success") {
          console.log("问题已发送给虚拟人:", response.data.request_id);
        } else {
          throw new Error(response.data.message || "发送问题失败");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "发送问题失败";
        console.error("发送问题给虚拟人失败:", errorMessage);

        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    },
    [sessionId, onError],
  );

  useEffect(() => {
    if (sessionId && !isInitializedRef.current) {
      isInitializedRef.current = true;
      getStatus();
    }
  }, [getStatus, sessionId]);

  return {
    streamUrl: status?.stream_url || null,
    error,
    status,
    sendQuestion,
  };
}
