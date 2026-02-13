import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function CallAction() {
  return (
    <div
      className="cta-section animate-on-scroll"
      style={{
        background: "linear-gradient(120deg, #1890ff 0%, #10239e 100%)",
        padding: "60px 24px",
        textAlign: "center",
        marginBottom: "60px",
      }}
    >
      <Title
        level={2}
        style={{
          color: "white",
          marginBottom: "24px",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        准备好提升你的面试技巧了吗？
      </Title>
      <Paragraph
        style={{
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: "18px",
          marginBottom: "40px",
          maxWidth: "800px",
          margin: "0 auto 40px",
        }}
      >
        立即体验我们的智能模拟面试系统，获得专业的评测和建议，提高你的就业竞争力！
      </Paragraph>
      <Link href="/setup">
        <Button
          type="primary"
          size="large"
          style={{
            height: "50px",
            padding: "0 40px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "25px",
            background: "white",
            color: "#1890ff",
            border: "none",
            boxShadow: "0 8px 16px rgba(255, 255, 255, 0.3)",
          }}
        >
          开始你的模拟面试 <ArrowRightOutlined />
        </Button>
      </Link>
    </div>
  );
}
