import type { AudioAnalysisType, VideoAnalysisType } from "@/types/session";
import { VideoCameraOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Tag, Typography } from "antd";

const { Text, Paragraph } = Typography;

const Title = () => (
  <>
    <Tag icon={<VideoCameraOutlined />} color="blue" />
    视频分析
  </>
);

export default function VideoAnalysis({
  record,
}: {
  record: {
    videoAnalysis?: VideoAnalysisType;
    audioAnalysis?: AudioAnalysisType;
  };
}) {
  if (!record.videoAnalysis) {
    return null; // 如果没有视频分析数据，则不渲染组件
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
              <Text>眼神接触</Text>
              <Text strong>{record.videoAnalysis.eyeContact}/10</Text>
            </div>
            <Progress
              percent={record.videoAnalysis.eyeContact * 10}
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
              <Text>面部表情</Text>
              <Text strong>{record.videoAnalysis.facialExpressions}/10</Text>
            </div>
            <Progress
              percent={record.videoAnalysis.facialExpressions * 10}
              size="small"
            />
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
              <Text>肢体语言</Text>
              <Text strong>{record.videoAnalysis.bodyLanguage}/10</Text>
            </div>
            <Progress
              percent={record.videoAnalysis.bodyLanguage * 10}
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
              <Text>自信程度</Text>
              <Text strong>{record.videoAnalysis.confidence}/10</Text>
            </div>
            <Progress
              percent={record.videoAnalysis.confidence * 10}
              size="small"
            />
          </div>
        </Col>
      </Row>
      <Paragraph type="secondary">
        {record.videoAnalysis.recommendations}
      </Paragraph>
    </Card>
  );
}
