import { useGlobalHeartbeat } from "@/hooks/useGlobalHeartbeat";
import { App } from "antd";
import { useRouter } from "next/navigation";

interface UseInterviewHeartbeatOptions {
  sessionId: string;
  enabled?: boolean;
  onForceEnd?: () => void;
}

export const useInterviewHeartbeat = ({
  sessionId,
  enabled = true,
  onForceEnd,
}: UseInterviewHeartbeatOptions) => {
  const { modal } = App.useApp();
  const router = useRouter();

  const heartbeat = useGlobalHeartbeat({
    sessionId,
    autoRegister: enabled,
    onSessionEnd: (reason) => {
      console.warn(`面试会话心跳检测到会话结束: ${reason}`);

      const title = "面试会话已结束";
      const content =
        reason === "error"
          ? "由于网络连接问题，面试会话已自动结束。建议检查网络连接后重新开始面试。"
          : "面试会话已超时结束。会话可能由于长时间无活动而被系统自动关闭。";

      modal.warning({
        title,
        content,
        okText: "重新开始面试",
        centered: true,
        onOk: () => {
          onForceEnd?.();

          router.push("/setup");
        },
        onCancel: () => {
          onForceEnd?.();
        },
      });
    },
  });

  return {
    heartbeatStatus: heartbeat,
    isHeartbeatActive: heartbeat.isRegistered,
  };
};
