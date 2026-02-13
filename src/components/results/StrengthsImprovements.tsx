import type { InterviewResults } from "@/types/results";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Row, Typography } from "antd";

const { Text } = Typography;

export default function StrengthsImprovements({
  results,
}: {
  results: InterviewResults;
}) {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} md={12}>
        <Card
          title="优势"
          extra={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        >
          <List
            dataSource={results.strengths}
            renderItem={(item) => (
              <List.Item>
                <Text>✓ {item}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card
          title="关键问题定位"
          extra={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
        >
          <List
            dataSource={results.improvements}
            renderItem={(item) => (
              <List.Item>
                <Text>• {item}</Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
