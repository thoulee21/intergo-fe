import { interviewAPI } from "@/services/api/interviewAPI";

interface SessionInfo {
  sessionId: string;
  lastHeartbeat: Date;
  errorCount: number;
  active: boolean;
}

class HeartbeatManager {
  private sessions: Map<string, SessionInfo> = new Map();
  private globalInterval: NodeJS.Timeout | null = null;
  private readonly interval: number = 30000; 
  private readonly maxErrorCount: number = 3;

  addSession(sessionId: string): void {
    if (this.sessions.has(sessionId)) {
      console.warn(`会话 ${sessionId} 已存在于心跳管理中`);
      return;
    }

    this.sessions.set(sessionId, {
      sessionId,
      lastHeartbeat: new Date(),
      errorCount: 0,
      active: true,
    });

    console.log(`添加会话到心跳管理: ${sessionId}`);

    if (this.sessions.size === 1) {
      this.startGlobalHeartbeat();
    }
  }

  removeSession(sessionId: string): void {
    if (this.sessions.delete(sessionId)) {
      console.log(`从心跳管理中移除会话: ${sessionId}`);
    }

    if (this.sessions.size === 0) {
      this.stopGlobalHeartbeat();
    }
  }

  getSessionStatus(sessionId: string): SessionInfo | null {
    return this.sessions.get(sessionId) || null;
  }

  getAllSessions(): SessionInfo[] {
    return Array.from(this.sessions.values());
  }

  async sendSessionHeartbeat(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.active) {
      return false;
    }

    try {
      const response = await interviewAPI.sendHeartbeat(sessionId);
      const data = response.data;

      session.lastHeartbeat = new Date();
      session.errorCount = 0;

      if (!data.session_active) {
        session.active = false;
        this.removeSession(sessionId);
        this.notifySessionEnd(sessionId);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`会话 ${sessionId} 心跳发送失败:`, error);

      session.errorCount++;

      if (session.errorCount >= this.maxErrorCount) {
        session.active = false;
        this.removeSession(sessionId);
        this.notifySessionEnd(sessionId, "error");
      }

      return false;
    }
  }

  private startGlobalHeartbeat(): void {
    if (this.globalInterval) {
      return;
    }

    console.log("启动全局心跳管理");

    this.globalInterval = setInterval(async () => {
      const activeSessions = Array.from(this.sessions.keys());

      if (activeSessions.length === 0) {
        this.stopGlobalHeartbeat();
        return;
      }

      console.log(`发送心跳到 ${activeSessions.length} 个会话`);

      const heartbeatPromises = activeSessions.map((sessionId) =>
        this.sendSessionHeartbeat(sessionId),
      );

      try {
        await Promise.allSettled(heartbeatPromises);
      } catch (error) {
        console.error("批量心跳发送出错:", error);
      }
    }, this.interval);
  }

  private stopGlobalHeartbeat(): void {
    if (this.globalInterval) {
      clearInterval(this.globalInterval);
      this.globalInterval = null;
      console.log("停止全局心跳管理");
    }
  }

  private notifySessionEnd(
    sessionId: string,
    reason: "inactive" | "error" = "inactive",
  ): void {
    const event = new CustomEvent("heartbeat-session-end", {
      detail: { sessionId, reason },
    });
    window.dispatchEvent(event);
  }

  cleanup(): void {
    console.log("清理心跳管理器");
    this.stopGlobalHeartbeat();
    this.sessions.clear();
  }

  getManagerStatus() {
    return {
      sessionCount: this.sessions.size,
      isRunning: this.globalInterval !== null,
      sessions: this.getAllSessions(),
    };
  }
}

export const heartbeatManager = new HeartbeatManager();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    heartbeatManager.cleanup();
  });
}
