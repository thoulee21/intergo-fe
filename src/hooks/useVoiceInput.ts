import type { MessageInstance } from "antd/es/message/interface";
import { useCallback } from "react";
import type Webcam from "react-webcam";

export default function useVoiceInput(
  webcamRef: React.RefObject<Webcam | null>,
  messageApi: MessageInstance,
  setRecognizing: React.Dispatch<React.SetStateAction<boolean>>,
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
) {
  const handleVoiceInput = useCallback(() => {
    if (!webcamRef.current || !webcamRef.current.stream) {
      messageApi.warning("无法访问麦克风，请检查权限并刷新页面");
      return;
    }

    try {
      const recognition = (
        new 
        window.SpeechRecognition() ||
        window.webkitSpeechRecognition
      )();

      recognition.lang = "zh-CN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.info("语音识别开始");
        setRecognizing(true);
        messageApi.info("请开始说话...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.info("语音识别结果:", transcript);
        setAnswer((prev) => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error === "no-speech") {
          return;
        }

        console.error("语音识别错误:", event.error);
        setRecognizing(false);
        messageApi.error("语音识别失败，请重试");
      };

      recognition.onend = () => {
        setRecognizing(false);
      };

      recognition.start();
    } catch (error) {
      console.error("语音识别初始化失败:", error);
      messageApi.error("语音识别不可用，请使用文字输入");
    }
  }, [messageApi, setAnswer, setRecognizing, webcamRef]);

  return handleVoiceInput;
}
