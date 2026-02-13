import { BookOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function SystemFeatures() {
  return (
    <div
      className="advantages-section animate-on-scroll"
      style={{
        marginBottom: "80px",
        borderRadius: "30px",
      }}
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
        系统特点
      </Title>
      <Row gutter={[48, 48]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Col xs={24} md={8} className="animate-on-scroll">
          <Card hoverable className="feature-card" style={styles.featureCard}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  background: "#1890ff",
                  fontSize: "28px",
                  marginBottom: "24px",
                }}
                size={80}
              />
              <Title
                level={3}
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                真实模拟
              </Title>
            </div>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
              模拟真实面试场景与问题，涵盖多种职业类型和面试难度，针对不同岗位特点生成专业问题，让你提前适应实际面试环境，充分准备从容应对。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8} className="animate-on-scroll">
          <Card hoverable className="feature-card" style={styles.featureCard}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                icon={<BookOutlined />}
                style={{
                  background: "#52c41a",
                  fontSize: "28px",
                  marginBottom: "24px",
                }}
                size={80}
              />
              <Title
                level={3}
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                多维度分析
              </Title>
            </div>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
              全方位分析语言表达、专业内容、非语言行为等多个维度，通过数据可视化展示个人表现，提供全面而精准的评价反馈，找出关键优势与不足。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8} className="animate-on-scroll">
          <Card hoverable className="feature-card" style={styles.featureCard}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                icon={<StarOutlined />}
                style={{
                  background: "#fa8c16",
                  fontSize: "28px",
                  marginBottom: "24px",
                }}
                size={80}
              />
              <Title
                level={3}
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                个性化建议
              </Title>
            </div>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
              基于大模型分析，针对个人表现提供有针对性的改进建议，结合心理学和沟通学理论，形成个性化提升方案，帮助持续提升面试技巧和职场竞争力。
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const styles = {
  featureCard: {
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    paddingTop: "24px",
    paddingBottom: "16px",
    borderRadius: "16px",
  },
};
