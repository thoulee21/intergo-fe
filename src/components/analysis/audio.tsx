import type { AudioAnalysisType, VideoAnalysisType } from "@/types/session";
import { SoundOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Tag, Typography } from "antd";

const { Text, Paragraph } = Typography;

const Title = () => (
  <>
    <Tag icon={<SoundOutlined />} color="green" />
    音频分析
  </>
);

export default function AudioAnalysis({
  record,
}: {
  record: {
    videoAnalysis?: VideoAnalysisType;
    audioAnalysis?: AudioAnalysisType;
  };
}) {
  if (!record.audioAnalysis) {
    return null; // 如果没有音频分析数据，则不渲染组件
  }

  return (
    <Card
      size="small"
      title={<Title />}
      variant="borderless"
      style={{ marginBottom: 10, padding: 12 }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>清晰度</Text>
              <Text strong>{record.audioAnalysis.clarity}/10</Text>
            </div>
            <Progress
              percent={record.audioAnalysis.clarity * 10}
              size="small"
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>语速</Text>
              <Text strong>{record.audioAnalysis.pace}/10</Text>
            </div>
            <Progress percent={record.audioAnalysis.pace * 10} size="small" />
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>语调</Text>
              <Text strong>{record.audioAnalysis.tone}/10</Text>
            </div>
            <Progress percent={record.audioAnalysis.tone * 10} size="small" />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Text>填充词数量</Text>
              <Text strong>{record.audioAnalysis.fillerWordsCount}</Text>
            </div>
            <Progress
              percent={
                ((10 - record.audioAnalysis.fillerWordsCount) / 10) * 100
              }
              size="small"
            />
          </div>
        </Col>
      </Row>
      <Paragraph type="secondary">
        {record.audioAnalysis.recommendations}
      </Paragraph>
    </Card>
  );
}
