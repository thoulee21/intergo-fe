import type { InterviewResults } from "@/types/results";
import formatEvaluationToMarkdown from "@/utils/formatEvaluationToMarkdown";
import getScoreLevel from "@/utils/getScoreLevel";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Card,
  Collapse,
  Progress,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import ReactMarkdown from "react-markdown";

const { Text, Paragraph } = Typography;

const getScoreDescription = (score: number) => {
  if (score >= 85)
    return "该表现超出预期，完全满足或超过面试要求，展示了杰出的能力和潜力。";
  if (score >= 70)
    return "该表现良好，基本满足面试要求，展示了较强的相关能力。";
  if (score >= 60) return "该表现基本符合标准，但有进一步提升的空间。";
  return "该表现未达到预期标准，需要显著改进。";
};

export default function QuestionEvaluations({
  results,
}: {
  results: InterviewResults;
}) {
  return (
    <Card title="问题评估详情" style={{ marginBottom: 24 }}>
      <Collapse
        defaultActiveKey={[]} 
        accordion
        bordered={false}
        items={results.questionScores.map((item, index) => ({
          key: index,
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{ flex: 1 }}>
                <Text strong>{item.question}</Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 16,
                  flexShrink: 0,
                }}
              >
                <Progress
                  percent={item.score}
                  size="small"
                  status={item.score >= 60 ? "success" : "exception"}
                  style={{ width: 100, marginRight: 8 }}
                />
                <Tooltip title={getScoreDescription(item.score)}>
                  <Tag color={getScoreLevel(item.score).color}>
                    <span style={{ cursor: "pointer" }}>
                      {item.score / 10} 分{" "}
                      <InfoCircleOutlined style={{ fontSize: "12px" }} />
                    </span>
                  </Tag>
                </Tooltip>
              </div>
            </div>
          ),
          children: (
            <>
              {/* 问题解析 */}
              {item.questionAnalysis && (
                <div style={{ margin: "16px 0" }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      color: "#1677ff",
                      marginBottom: "8px",
                    }}
                  >
                    问题解析：
                  </Text>
                  <Alert
                    showIcon
                    type="info"
                    banner
                    title={
                      <div className="markdown-content">
                        <ReactMarkdown>{item.questionAnalysis}</ReactMarkdown>
                      </div>
                    }
                  />
                </div>
              )}

              {/* 标准答案 */}
              {item.standardAnswer && (
                <div style={{ margin: "16px 0" }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      color: "#52c41a",
                      marginBottom: "8px",
                    }}
                  >
                    参考答案：
                  </Text>
                  <Alert
                    showIcon
                    type="success"
                    banner
                    title={
                      <div className="markdown-content">
                        <ReactMarkdown>{item.standardAnswer}</ReactMarkdown>
                      </div>
                    }
                  />
                </div>
              )}

              {/* 你的回答 */}
              {item.answer && (
                <div style={{ margin: "16px 0" }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      color: "#722ed1",
                      marginBottom: "8px",
                    }}
                  >
                    你的回答：
                  </Text>
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "4px",
                      border: "1px solid #d3adf7",
                    }}
                  >
                    <Paragraph>{item.answer}</Paragraph>
                  </div>
                </div>
              )}

              {/* 评估反馈 */}
              <div style={{ margin: "16px 0" }}>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#ff4d4f",
                  }}
                >
                  评估反馈：
                </Text>
                <Alert
                  showIcon
                  type="warning"
                  banner
                  title={
                    <div className="markdown-content">
                      <ReactMarkdown>
                        {formatEvaluationToMarkdown(item.evaluation)}
                      </ReactMarkdown>
                    </div>
                  }
                />
              </div>
            </>
          ),
        }))}
      />
    </Card>
  );
}
