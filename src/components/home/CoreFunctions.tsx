import {
  FileTextOutlined,
  RobotOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function CoreFunctions() {
  return (
    <div
      id="features"
      className="features-section animate-on-scroll"
      style={{ marginBottom: "80px" }}
    >
      <Title
        level={2}
        className="text-center"
        style={{
          marginBottom: "48px",
          position: "relative",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "4px",
            background: "#1890ff",
            margin: "0 auto 16px",
            borderRadius: "2px",
          }}
        />
        核心功能
      </Title>
      <Row gutter={[32, 32]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="feature-card"
            style={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
            cover={
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  background:
                    "linear-gradient(120deg, #e6f7ff 0%, #bae7ff 100%)",
                }}
              >
                <FileTextOutlined
                  style={{ fontSize: "72px", color: "#1890ff" }}
                />
              </div>
            }
          >
            <Card.Meta
              title={
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                  文本分析
                </span>
              }
              description={
                <Paragraph style={{ fontSize: "14px", marginTop: "16px" }}>
                  智能分析回答内容，评估专业度、逻辑性和相关性，为您提供专业面试官级别的评价
                </Paragraph>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="feature-card"
            style={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
            cover={
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  background:
                    "linear-gradient(120deg, #f0f5ff 0%, #d6e4ff 100%)",
                }}
              >
                <VideoCameraOutlined
                  style={{ fontSize: "72px", color: "#2f54eb" }}
                />
              </div>
            }
          >
            <Card.Meta
              title={
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                  视频分析
                </span>
              }
              description={
                <Paragraph style={{ fontSize: "14px", marginTop: "16px" }}>
                  分析面部表情、眼神接触和肢体语言，评估自信度和专业形象，全方位提升非语言表达能力
                </Paragraph>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="feature-card"
            style={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
            cover={
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  background:
                    "linear-gradient(120deg, #fff7e6 0%, #ffe7ba 100%)",
                }}
              >
                <SoundOutlined style={{ fontSize: "72px", color: "#fa8c16" }} />
              </div>
            }
          >
            <Card.Meta
              title={
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                  语音分析
                </span>
              }
              description={
                <Paragraph style={{ fontSize: "14px", marginTop: "16px" }}>
                  分析语速、语调、清晰度和填充词使用，提升口头表达能力，增强表达的专业性和感染力
                </Paragraph>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className="feature-card"
            style={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
            cover={
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  background:
                    "linear-gradient(120deg, #f9f0ff 0%, #efdbff 100%)",
                }}
              >
                <RobotOutlined style={{ fontSize: "72px", color: "#722ed1" }} />
              </div>
            }
          >
            <Card.Meta
              title={
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                  AI评测
                </span>
              }
              description={
                <Paragraph style={{ fontSize: "14px", marginTop: "16px" }}>
                  基于讯飞星火大模型的全面智能评测与建议，提供个性化的面试技巧和能力提升方案
                </Paragraph>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
