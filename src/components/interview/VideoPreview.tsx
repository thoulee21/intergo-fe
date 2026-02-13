import { Tooltip } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { RefObject } from "react";
import Webcam from "react-webcam";

export default function VideoPreview({
  webcamRef,
  isRecording,
  isPip,
  interviewStarted,
  messageApi,
}: {
  webcamRef: RefObject<Webcam | null>;
  isRecording: boolean;
  isPip: boolean;
  interviewStarted: boolean;
  messageApi: MessageInstance;
}) {
  return (
    <Tooltip title={interviewStarted ? "点击进入画中画模式" : undefined}>
      <div
        className="video-container video-card"
        onClick={async () => {
          if (!interviewStarted) {
            return;
          }

          if (webcamRef.current?.video) {
            if (!isPip) {
              try {
                await webcamRef.current.video.requestPictureInPicture();
              } catch (error) {
                console.warn("画中画启用失败:", error);
                messageApi.warning("画中画启用失败，请重试");
              }
            } else {
              await document.exitPictureInPicture();
            }
          }
        }}
        style={{
          height: isPip ? 0 : undefined,
          display: interviewStarted ? undefined : "none",
        }}
      >
        <Webcam
          audio
          ref={webcamRef}
          className="video-preview"
          muted
          capture="user"
          disabled={!isRecording}
        />
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <span>正在录制...</span>
          </div>
        )}
      </div>
    </Tooltip>
  );
}
