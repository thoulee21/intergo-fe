import {
  FundProjectionScreenOutlined,
  FundViewOutlined,
  HomeOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Link from "next/link";
import React from "react";

interface InterviewBreadcrumbProps {
  currentStep: "setup" | "interview" | "results";
  sessionId?: string;
  questionIndex?: number;
  isComplete?: boolean;
}

const InterviewBreadcrumb: React.FC<InterviewBreadcrumbProps> = ({
  currentStep,
  sessionId,
  questionIndex = 0,
  isComplete = false,
}) => {
  const steps = ["setup", "interview", "results"];
  const currentStepIndex = steps.indexOf(currentStep);

  let interviewText = "面试进行中";

  if (
    (currentStep === "interview" && isComplete) ||
    currentStep === "results"
  ) {
    interviewText = "面试已完成";
  } else if (currentStep === "interview" && questionIndex > 0) {
    interviewText = `问题 ${questionIndex + 1}`;
  }

  return (
    <div style={{ margin: "16px 0 24px" }}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/">
                <HomeOutlined /> 首页
              </Link>
            ),
          },
          {
            title:
              currentStepIndex >= 0 ? (
                <Link href="/setup">
                  <RocketOutlined /> 面试设置
                </Link>
              ) : (
                "面试设置"
              ),
          },
          ...(currentStepIndex >= 1 || currentStep === "interview"
            ? [
                {
                  title:
                    sessionId && currentStepIndex > 1 ? (
                      <Link href={`/interview/${sessionId}`}>
                        <FundProjectionScreenOutlined /> 面试会话
                      </Link>
                    ) : (
                      <>
                        <FundProjectionScreenOutlined /> {interviewText}
                      </>
                    ),
                },
              ]
            : []),
          ...(currentStepIndex >= 2 || currentStep === "results"
            ? [
                {
                  title: (
                    <>
                      <FundViewOutlined /> 面试结果
                    </>
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
};

export default InterviewBreadcrumb;
