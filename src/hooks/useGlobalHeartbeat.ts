import { useEffect, useCallback, useState } from "react";
import { heartbeatManager } from "@/services/heartbeatManager";

interface UseGlobalHeartbeatOptions {
  sessionId: string;
  onSessionEnd?: (reason: "inactive" | "error") => void;
  autoRegister?: boolean;
}

export const useGlobalHeartbeat = ({
  sessionId,
  onSessionEnd,
  autoRegister = true,
}: UseGlobalHeartbeatOptions) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const register = useCallback(() => {
    if (!sessionId || isRegistered) {
      return;
    }

    heartbeatManager.addSession(sessionId);
    setIsRegistered(true);
    console.log(`会话 ${sessionId} 已注册到全局心跳管理`);
  }, [sessionId, isRegistered]);

  const unregister = useCallback(() => {
    if (!sessionId || !isRegistered) {
      return;
    }

    heartbeatManager.removeSession(sessionId);
    setIsRegistered(false);
    console.log(`会话 ${sessionId} 已从全局心跳管理注销`);
  }, [sessionId, isRegistered]);

  const getStatus = useCallback(() => {
    return heartbeatManager.getSessionStatus(sessionId);
  }, [sessionId]);

  const sendHeartbeat = useCallback(async () => {
    if (!sessionId) return false;
    return await heartbeatManager.sendSessionHeartbeat(sessionId);
  }, [sessionId]);

  useEffect(() => {
    const handleSessionEnd = (event: CustomEvent) => {
      const { sessionId: endedSessionId, reason } = event.detail;

      if (endedSessionId === sessionId) {
        console.log(`会话 ${sessionId} 结束，原因: ${reason}`);
        setIsRegistered(false);
        onSessionEnd?.(reason);
      }
    };

    window.addEventListener(
      "heartbeat-session-end",
      handleSessionEnd as EventListener,
    );

    return () => {
      window.removeEventListener(
        "heartbeat-session-end",
        handleSessionEnd as EventListener,
      );
    };
  }, [sessionId, onSessionEnd]);

  useEffect(() => {
    let timer: number | undefined;
    if (autoRegister && sessionId) {
      timer = window.setTimeout(() => {
        register();
      }, 0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (isRegistered) {
        unregister();
      }
    };
  }, [autoRegister, sessionId, register, unregister, isRegistered]);

  return {
    isRegistered,
    register,
    unregister,
    getStatus,
    sendHeartbeat,
    managerStatus: heartbeatManager.getManagerStatus(),
  };
};
