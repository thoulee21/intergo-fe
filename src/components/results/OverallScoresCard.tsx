import type { InterviewResults } from "@/types/results";
import {
  FileTextOutlined,
  FundViewOutlined,
  InfoCircleOutlined,
  SoundOutlined,
  TrophyOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Space, Statistic, Tooltip, Typography } from "antd";
import CountUp from "react-countup";

const { Title } = Typography;

const scoreDescriptions = {
  overallScore:
    "总体得分是综合评估您在本次面试中的整体表现，包含了内容、表达和非语言表现三个主要维度的加权评分。",
  contentScore:
    "内容评分反映了您回答的准确性、完整性、逻辑性和相关性。高分表示您的回答内容充实、准确并且能很好地回应面试问题的要求。",
  deliveryScore:
    "表达评分关注您的语言表达能力，包括表达清晰度、流畅度、语速、语调变化以及专业术语的使用是否恰当。",
  nonVerbalScore:
    "非语言表现评分考察您的肢体语言、面部表情、目光接触、姿势以及整体自信度等非语言因素。这些因素对面试官的整体印象有重要影响。",
};

export default function OverallScoresCard({
  results,
}: {
  results: InterviewResults;
}) {
  return (
    <Card
      style={{
        paddingTop: 66,
        marginBottom: 24,
        background:
          "linear-gradient(120deg,rgb(147, 185, 246) 0%,rgb(220, 242, 247) 100%)",
        borderRadius: 0,
      }}
    >
      <Row
        gutter={16}
        style={{ height: 150 }}
        align="middle"
        justify="space-between"
      >
        <Col xs={24} md={6}>
          <Title
            level={3}
            style={{
              margin: 0,
              paddingLeft: "24px",
              fontWeight: "bold",
              textAlign: "left",
              fontSize: "32px",
              color: "black",
            }}
          >
            <FundViewOutlined style={{ marginRight: "12px" }} />
            面试评分概览
          </Title>
        </Col>
        <Col xs={24} md={4}>
          <Space orientation="horizontal">
            <TrophyOutlined
              style={{
                fontSize: "48px",
                color: "#faad14",
                background: "rgba(243, 242, 249, 0.5)",
                padding: "16px",
                borderRadius: "8px",
              }}
            />
            <Statistic
              className="score-item"
              title={
                <span
                  style={{
                    color: "black",
                    fontSize: "16px",
                  }}
                >
                  总体得分{" "}
                  <Tooltip title={scoreDescriptions.overallScore}>
                    <InfoCircleOutlined
                      style={{ fontSize: "14px", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
              }
              value={results.overallScore}
              styles={{
                content: { fontWeight: "bold", fontSize: 30, color: "black" },
              }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={0.3}
                  preserveValue
                />
              )}
            />
          </Space>
        </Col>
        <Col xs={24} md={4}>
          <Space orientation="horizontal">
            <FileTextOutlined
              style={{
                fontSize: "48px",
                color: "#52c41a",
                background: "rgba(242, 247, 240, 0.5)",
                padding: "16px",
                borderRadius: "8px",
              }}
            />
            <Statistic
              className="score-item"
              title={
                <span
                  style={{
                    color: "black",
                    fontSize: "16px",
                  }}
                >
                  内容评分{" "}
                  <Tooltip title={scoreDescriptions.contentScore}>
                    <InfoCircleOutlined
                      style={{ fontSize: "14px", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
              }
              value={results.contentScore}
              styles={{
                content: { fontWeight: "bold", fontSize: 30, color: "black" },
              }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={0.3}
                  preserveValue
                />
              )}
            />
          </Space>
        </Col>
        <Col xs={24} md={4}>
          <Space orientation="horizontal">
            <SoundOutlined
              style={{
                fontSize: "48px",
                color: "#722ed1",
                background: "rgba(245, 238, 250, 0.5)",
                padding: "16px",
                borderRadius: "8px",
              }}
            />
            <Statistic
              className="score-item"
              title={
                <span
                  style={{
                    color: "black",
                    fontSize: "16px",
                  }}
                >
                  表达评分{" "}
                  <Tooltip title={scoreDescriptions.deliveryScore}>
                    <InfoCircleOutlined
                      style={{ fontSize: "14px", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
              }
              value={results.deliveryScore}
              styles={{
                content: { fontWeight: "bold", fontSize: 30, color: "black" },
              }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={0.3}
                  preserveValue
                />
              )}
            />
          </Space>
        </Col>
        <Col xs={24} md={4}>
          <Space orientation="horizontal">
            <VideoCameraOutlined
              style={{
                fontSize: "48px",
                color: "#1890ff",
                background: "rgba(240, 244, 250, 0.5)",
                padding: "16px",
                borderRadius: "8px",
              }}
            />
            <Statistic
              className="score-item"
              title={
                <span
                  style={{
                    color: "black",
                    fontSize: "16px",
                  }}
                >
                  非语言表现{" "}
                  <Tooltip title={scoreDescriptions.nonVerbalScore}>
                    <InfoCircleOutlined
                      style={{ fontSize: "14px", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
              }
              value={results.nonVerbalScore}
              styles={{
                content: { fontWeight: "bold", fontSize: 30, color: "black" },
              }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={0.3}
                  preserveValue
                />
              )}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
