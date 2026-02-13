import { FundProjectionScreenOutlined } from "@ant-design/icons";
import { Card, Progress, Tag, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function InterviewHeader({
  questionIndex,
  questionCount,
  isComplete,
  interviewStarted,
}: {
  questionIndex: number;
  questionCount: number;
  isComplete: boolean;
  interviewStarted: boolean;
}) {
  return (
    <Card
      className="progress-card"
      style={{ marginBottom: "20px" }}
      title={
        <>
          <Title level={2} className="text-center interview-header">
            <FundProjectionScreenOutlined /> 智能模拟面试
          </Title>
          <Paragraph className="text-center" type="secondary">
            {isComplete
              ? "面试已完成，感谢您的参与！"
              : "请面对摄像头回答问题，系统将自动分析您的表现"}
          </Paragraph>
        </>
      }
    >
      <div className="progress-info">
        <div className="progress-counter">
          <span>{questionIndex + 1}</span>
          <span className="divider">/</span>
          <span className="total-questions">{questionCount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {!isComplete ? (
            <Tag
              color={
                questionIndex + 1 === questionCount ? "warning" : "processing"
              }
            >
              {interviewStarted
                ? questionIndex + 1 === questionCount
                  ? "最后一题"
                  : "进行中"
                : "未开始"}
            </Tag>
          ) : (
            <Tag color="success">面试已完成</Tag>
          )}
        </div>
      </div>

      <Progress
        percent={Math.round(
          ((questionIndex + (isComplete ? 1 : 0)) / questionCount) * 100,
        )}
        status={isComplete ? "success" : "active"}
        showInfo
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068",
        }}
      />
    </Card>
  );
}
