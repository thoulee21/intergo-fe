import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Result, Space, Tag } from "antd";
import ReactMarkdown from "react-markdown";

const CompletedResult = ({ overallScore }: { overallScore: number }) => {
  return (
    <Result
      icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
      title="面试已完成"
      subTitle={
        <Space direction="vertical" size="small">
          <span>总体得分</span>
          <Tag
            color={
              overallScore >= 80
                ? "success"
                : overallScore >= 60
                  ? "warning"
                  : "error"
            }
            style={{ fontSize: 18, padding: "8px 16px" }}
          >
            {overallScore} / 100
          </Tag>
        </Space>
      }
    />
  );
};

export default function EvaluationReport({
  overallScore,
  finalEvaluation,
  handleViewResults,
}: {
  overallScore: number | null;
  finalEvaluation: string | null;
  handleViewResults: () => void;
}) {
  return (
    <>
      {overallScore !== null && (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <CompletedResult overallScore={overallScore} />
        </div>
      )}

      <Divider orientation="horizontal">评估摘要</Divider>
      <div className="markdown-content">
        <ReactMarkdown>{finalEvaluation || "暂无评估内容"}</ReactMarkdown>
      </div>
      <Button
        type="primary"
        onClick={handleViewResults}
        style={{ marginTop: 24 }}
        block
        size="large"
      >
        查看详细分析报告
      </Button>
    </>
  );
}
