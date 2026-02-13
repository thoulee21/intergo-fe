import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Rate, Row, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function UserComments() {
  return (
    <div
      className="testimonials-section animate-on-scroll"
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
        用户评价
      </Title>
      <Row gutter={[24, 24]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Col xs={24} md={8}>
          <Card
            style={{
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Avatar
                size={50}
                icon={<UserOutlined />}
                style={{ background: "#1890ff" }}
              />
              <div style={{ marginLeft: "16px" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "block",
                  }}
                >
                  王同学
                </Text>
                <Text type="secondary">计算机科学专业</Text>
              </div>
            </div>
            <Rate
              disabled
              defaultValue={5}
              style={{ fontSize: "16px", marginBottom: "12px" }}
            />
            <Paragraph style={{ fontSize: "14px", lineHeight: "1.8" }}>
              &#34;这个系统帮助我发现了在面试中的一些盲点，尤其是我不自觉的肢体动作和语言习惯。通过有针对性的练习，我最终成功拿到了心仪公司的offer！&#34;
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            style={{
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Avatar
                size={50}
                icon={<UserOutlined />}
                style={{ background: "#52c41a" }}
              />
              <div style={{ marginLeft: "16px" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "block",
                  }}
                >
                  李同学
                </Text>
                <Text type="secondary">金融学专业</Text>
              </div>
            </div>
            <Rate
              disabled
              defaultValue={5}
              style={{ fontSize: "16px", marginBottom: "12px" }}
            />
            <Paragraph style={{ fontSize: "14px", lineHeight: "1.8" }}>
              &#34;系统的问题非常专业，几乎覆盖了我在真实面试中遇到的所有问题类型。评测报告详细而具体，给了我很大的帮助，让我在面试中更加自信。&#34;
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            style={{
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Avatar
                size={50}
                icon={<UserOutlined />}
                style={{ background: "#722ed1" }}
              />
              <div style={{ marginLeft: "16px" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "block",
                  }}
                >
                  赵老师
                </Text>
                <Text type="secondary">就业指导中心</Text>
              </div>
            </div>
            <Rate
              disabled
              defaultValue={5}
              style={{ fontSize: "16px", marginBottom: "12px" }}
            />
            <Paragraph style={{ fontSize: "14px", lineHeight: "1.8" }}>
              &#34;我们学校就业指导中心引入这个系统后，学生的面试通过率显著提高。系统的多模态分析能力非常专业，真正帮助学生发现并改进面试中的不足。&#34;
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
