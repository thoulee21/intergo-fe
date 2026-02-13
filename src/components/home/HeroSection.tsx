import {
  ArrowRightOutlined,
  FileProtectOutlined,
  RobotOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Row, Space, Typography } from "antd";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

export default function HeroSection() {
  return (
    <div
      className="hero-section"
      style={{
        background: "linear-gradient(120deg, #1890ff 0%, #10239e 100%)",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "150px",
        paddingBottom: "80px",
        marginBottom: "60px",
        boxShadow: "0 10px 30px rgba(24, 144, 255, 0.2)",
      }}
    >
      <Row
        align="middle"
        justify="center"
        gutter={[48, 48]}
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Col xs={24} md={14} className="text-center animate-on-scroll">
          <Title
            style={{ color: "white", fontSize: "48px", marginBottom: "24px" }}
          >
            智能模拟面试评测系统
          </Title>
          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "20px",
              marginBottom: "40px",
            }}
          >
            基于多模态AI技术，为高校学生提供专业的模拟面试体验与评测
            <br />
            大数据驱动，助力职场竞争力提升
          </Paragraph>
          <Space size="large">
            <Link href="/setup">
              <Button
                type="primary"
                size="large"
                style={{
                  height: "50px",
                  padding: "0 32px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  background: "white",
                  color: "#1890ff",
                  border: "none",
                  boxShadow: "0 8px 16px rgba(255, 255, 255, 0.3)",
                }}
              >
                立即体验 <ArrowRightOutlined />
              </Button>
            </Link>
            <Button
              type="default"
              ghost
              size="large"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                height: "50px",
                padding: "0 32px",
                fontSize: "18px",
                borderRadius: "25px",
                color: "white",
                borderColor: "white",
              }}
            >
              了解更多
            </Button>
          </Space>
        </Col>
        <Col xs={24} md={10} className="animate-on-scroll">
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              padding: "30px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="feature-highlight">
              <Space orientation="vertical" size={20} style={{ width: "100%" }}>
                <Space>
                  <Avatar
                    size={64}
                    icon={<RobotOutlined />}
                    style={{ background: "#1890ff" }}
                  />
                  <div>
                    <Link
                      href="https:
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: "20px",
                          fontWeight: "bold",
                          display: "block",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.textDecoration = "underline";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.textDecoration = "none";
                        }}
                      >
                        讯飞星火大模型
                      </Text>
                    </Link>
                    <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                      业界领先的AI技术支持
                    </Text>
                  </div>
                </Space>

                <Space>
                  <Avatar
                    size={64}
                    icon={<VideoCameraOutlined />}
                    style={{ background: "#1890ff" }}
                  />
                  <div>
                    <Text
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                        display: "block",
                      }}
                    >
                      多模态分析技术
                    </Text>
                    <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                      同时分析视频、语音和文本内容
                    </Text>
                  </div>
                </Space>

                <Space>
                  <Avatar
                    size={64}
                    icon={<FileProtectOutlined />}
                    style={{ background: "#1890ff" }}
                  />
                  <div>
                    <Text
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "bold",
                        display: "block",
                      }}
                    >
                      专业评测报告
                    </Text>
                    <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                      多维度数据分析和改进建议
                    </Text>
                  </div>
                </Space>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
