"use client";

import AnswerCard from "@/components/interview/AnswerCard";
import AvatarPlayer from "@/components/interview/AvatarPlayer";
import EvaluationReport from "@/components/interview/EvaluationReport";
import InterviewHeader from "@/components/interview/InterviewHeader";
import LoadingContent, { loadingTips } from "@/components/interview/Loading";
import LoadingFinalEvaluation from "@/components/interview/LoadingFinalEvaluation";
import Tips from "@/components/interview/Tips";
import VideoPreview from "@/components/interview/VideoPreview";
import InterviewBreadcrumb from "@/components/shared/InterviewBreadcrumb";
import useAvatar from "@/hooks/useAvatar";
import { useInterviewHeartbeat } from "@/hooks/useInterviewHeartbeat";
import useVoiceInput from "@/hooks/useVoiceInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import interviewAPI from "@/services/api";
import formatEvaluationToMarkdown from "@/utils/formatEvaluationToMarkdown";
import { FundProjectionScreenOutlined, SyncOutlined } from "@ant-design/icons";
import { App, Button, Card, Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Webcam from "react-webcam";
import "./interview.css";

export default function InterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { modal, message: messageApi } = App.useApp();
  const dispatch = useAppDispatch();
  const initials = useAppSelector((state) => state.interview.initials);

  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [avatarContent, setAvatarContent] = useState<string>("");
  const [evaluation, setEvaluation] = useState<string | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(2);
  const [isComplete, setIsComplete] = useState(false);
  const [finalEvaluation, setFinalEvaluation] = useState<string | null>(null);
  const [loadingFinalEvaluation, setLoadingFinalEvaluation] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const [isRecognitionAvailable, setIsRecognitionAvailable] = useState(false);
  const [recognizing, setRecognizing] = useState(false);

  const [avatarEnabled, setAvatarEnabled] = useState(true); 

  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isPip, setIsPip] = useState(false);

  const isInitialized = useRef(false);
  const broadcastedQuestions = useRef(new Set<string>());

  const { streamUrl, sendQuestion } = useAvatar({
    sessionId,
    onError: (error: Error) => {
      console.error("虚拟人错误:", error);
      setAvatarEnabled(false);
      messageApi.warning("虚拟人启动失败，已切换为文本模式");
    },
  });

  useInterviewHeartbeat({
    sessionId,
    enabled: interviewStarted, 
    onForceEnd: () => {
      if (isRecording) {
        stopRecording();
      }
      setInterviewStarted(false);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsRecognitionAvailable(true);
      } else {
        setIsRecognitionAvailable(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!webcamRef.current) return;

    if (webcamRef.current.video) {
      webcamRef.current.video.onenterpictureinpicture = () => {
        setIsPip(true);
      };

      webcamRef.current.video.onleavepictureinpicture = () => {
        setIsPip(false);
      };
    }
  }, [messageApi]);

  const silentAnalysis = useCallback(async () => {
    if (recordedChunks.length === 0) {
      console.warn("没有录制的视频数据，无法进行分析");
      return;
    }

    try {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });

      console.info("开始分析数据...");
      await interviewAPI.multimodalAnalysis(videoBlob, sessionId);
    } catch (error) {
      console.warn("后台分析失败:", error);
    } finally {
      console.info("分析完成");
    }
  }, [recordedChunks, sessionId]);

  const handleDataAvailable = useCallback(({ data }: { data: Blob }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!webcamRef.current || !webcamRef.current.stream) {
      console.log("摄像头流暂不可用，等待中...");

      const maxRetries = 20;
      let retryCount = 0;

      const retryStartRecording = () => {
        if (retryCount >= maxRetries) {
          console.warn("无法获取摄像头流，已达到最大重试次数");
          messageApi.warning(
            "强烈建议您开启摄像头进行面试，否则系统将无法分析您的多模态表现数据",
          );
          return;
        }

        retryCount++;
        console.log(`尝试获取摄像头流，第 ${retryCount} 次尝试...`);

        if (webcamRef.current && webcamRef.current.stream) {
          console.log("摄像头流已可用，开始录制");
          actuallyStartRecording();
        } else {
          setTimeout(retryStartRecording, Math.random() * 1000 + 500);
        }
      };

      retryStartRecording();
      return;
    }

    actuallyStartRecording();

    function actuallyStartRecording() {
      try {
        if (webcamRef.current && webcamRef.current.stream) {
          mediaRecorderRef.current = new MediaRecorder(
            webcamRef.current.stream,
            {
              mimeType: "video/webm",
            },
          );

          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.removeEventListener(
              "dataavailable",
              handleDataAvailable,
            );
          }

          mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable,
          );

          mediaRecorderRef.current.addEventListener("stop", () => {
            console.log("MediaRecorder 停止录制");
            setIsRecording(false);
          });

          mediaRecorderRef.current.addEventListener("start", () => {
            console.log("MediaRecorder 开始录制");
            setIsRecording(true);
          });

          mediaRecorderRef.current.addEventListener("error", (error) => {
            console.log("MediaRecorder 错误:", error);
          });

          mediaRecorderRef.current.start(1000);
        } else {
          throw new Error("摄像头流不可用");
        }
      } catch (error) {
        console.error("无法开始录制:", error);
        messageApi.error("无法开始录制视频，请检查您的摄像头权限");
      }
    }
  }, [handleDataAvailable, messageApi]);

  const stopRecording = useCallback(async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setInterviewStarted(false);

      if (isPip && document.pictureInPictureElement) {
        try {
          await document.exitPictureInPicture();
        } catch (error) {
          console.warn("退出画中画模式失败:", error);
        }
      }
    }
  }, [isPip]);

  useEffect(() => {
    if (isInitialized.current) return;

    const initializeInterview = () => {
      try {
        setCurrentQuestion("正在加载面试问题...");

        if (initials) {
          const { initialQuestion, questionCount } = initials;

          setCurrentQuestion(initialQuestion);
          setAvatarContent(initials.avatarContent);
          setQuestionCount(questionCount);
          setLoading(false);

          if (!isRecording) {
            startRecording();
          }
        } else {
          throw new Error("没有初始问题数据");
        }
      } catch (error) {
        console.warn("获取面试问题失败:", error);
        messageApi.warning("无法获取面试问题，请从设置页面开始面试");
        router.push("/setup");
      } finally {
        isInitialized.current = true;
      }
    };

    initializeInterview();
  }, [
    dispatch,
    initials,
    isRecording,
    messageApi,
    router,
    sessionId,
    startRecording,
    stopRecording,
  ]);

  const handleStartInterview = async () => {
    try {
      if (webcamRef.current?.video) {
        try {
          await webcamRef.current.video.requestPictureInPicture();
          messageApi.success("面试开始");
        } catch (pipError) {
          console.warn("画中画启用失败:", pipError);
          messageApi.info("画中画启用失败，但面试仍可正常进行");
        }
      }

      setInterviewStarted(true);
    } catch (error) {
      console.error("开始面试失败:", error);
      messageApi.error("开始面试失败，请重试");
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      setLoading(true);

      let tipIndex = 0;
      const tipInterval = setInterval(() => {
        messageApi.loading({
          content: loadingTips[tipIndex % loadingTips.length],
          duration: 1.5,
          key: "answerLoading",
        });
        tipIndex++;
      }, 1500);

      modal.confirm({
        title: "回答分析中",
        icon: <SyncOutlined spin />,
        content: <LoadingContent />,
        okButtonProps: { style: { display: "none" } },
        cancelButtonProps: { style: { display: "none" } },
        centered: true,
        keyboard: false,
        maskClosable: false,
      });

      const response = await interviewAPI.answerQuestion(sessionId, answer);

      clearInterval(tipInterval);
      messageApi.destroy("answerLoading");

      Modal.destroyAll();

      if (response.data.isComplete) {
        setIsComplete(true);
        setLoadingFinalEvaluation(true);

        await stopRecording();
        await silentAnalysis();

        try {
          const resultResponse =
            await interviewAPI.getInterviewResults(sessionId);
          setFinalEvaluation(resultResponse.data.recommendations);
          setOverallScore(resultResponse.data.overallScore);
        } catch (error) {
          console.error("获取详细评估结果失败:", error);
        } finally {
          setLoadingFinalEvaluation(false);
        }
        messageApi.success("面试已完成，评估生成完毕");
      } else {
        const formattedEvaluation = formatEvaluationToMarkdown(
          response.data.evaluation,
        );
        setEvaluation(formattedEvaluation);
        setCurrentQuestion(response.data.nextQuestion);
        setAvatarContent(response.data.avatarContent);
        setQuestionIndex(questionIndex + 1);
        setAnswer("");
        messageApi.success("回答已提交，请继续回答下一个问题");
      }
    } catch (error) {
      console.error("提交答案失败:", error);
      messageApi.error("提交答案失败，请重试");

      Modal.destroyAll();
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = () => {
    router.push(`/results/${sessionId}`);
  };

  const handleVoiceInput = useVoiceInput(
    webcamRef,
    messageApi,
    setRecognizing,
    setAnswer,
  );

  useEffect(() => {
    if (
      avatarContent !== "" &&
      interviewStarted &&
      avatarEnabled &&
      !broadcastedQuestions.current.has(avatarContent)
    ) {
      sendQuestion(avatarContent);
      broadcastedQuestions.current.add(avatarContent);
    }
  }, [avatarContent, avatarEnabled, interviewStarted, sendQuestion]);

  return (
    <div className="interview-page">
      <InterviewBreadcrumb
        currentStep="interview"
        sessionId={sessionId}
        questionIndex={questionIndex}
        isComplete={isComplete}
      />

      <div className="interview-container interview-content">
        <div
          className="interview-layout"
          style={{
            maxWidth: interviewStarted && avatarEnabled ? undefined : "800px",
          }}
        >
          <div className="interview-main-content">
            <InterviewHeader
              questionIndex={questionIndex}
              questionCount={questionCount}
              isComplete={isComplete}
              interviewStarted={interviewStarted}
            />
            <VideoPreview
              interviewStarted={interviewStarted}
              isPip={isPip}
              webcamRef={webcamRef}
              isRecording={isRecording}
              messageApi={messageApi}
            />
            {!interviewStarted && !isComplete && (
              <>
                <Tips />
                <div style={{ textAlign: "end" }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FundProjectionScreenOutlined />}
                    onClick={handleStartInterview}
                  >
                    开始面试
                  </Button>
                </div>
              </>
            )}
            {!isComplete && interviewStarted && (
              <Card
                title="面试问题"
                style={{ marginBottom: "20px" }}
                className="question-card"
              >
                <div className="markdown-content">
                  <ReactMarkdown>{currentQuestion}</ReactMarkdown>
                </div>
              </Card>
            )}
            {!isComplete && interviewStarted && (
              <AnswerCard
                answer={answer}
                setAnswer={setAnswer}
                handleSubmitAnswer={handleSubmitAnswer}
                loading={loading}
                recognizing={recognizing}
                handleVoiceInput={handleVoiceInput}
                isRecognitionAvailable={isRecognitionAvailable}
              />
            )}
            {evaluation && !isComplete && (
              <Card
                title="上一问题的评估"
                style={{ marginTop: "20px" }}
                className="evaluation-card"
              >
                <div className="markdown-content">
                  <ReactMarkdown>{evaluation}</ReactMarkdown>
                </div>
              </Card>
            )}
            {isComplete && (
              <Card
                title="面试评估结果"
                style={{ marginTop: "20px" }}
                className="final-evaluation-card"
              >
                {loadingFinalEvaluation ? (
                  <LoadingFinalEvaluation />
                ) : (
                  <EvaluationReport
                    overallScore={overallScore}
                    finalEvaluation={finalEvaluation}
                    handleViewResults={handleViewResults}
                  />
                )}
              </Card>
            )}
          </div>

          {}
          {interviewStarted && avatarEnabled && streamUrl && (
            <div className="interview-sidebar">
              <AvatarPlayer
                streamUrl={streamUrl}
                onError={() => {
                  setAvatarEnabled(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
