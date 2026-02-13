import { TrophyOutlined } from "@ant-design/icons";
import { Col, Row, Tag, Typography } from "antd";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function CNSoftBei() {
  return (
    <div
      className="competition-section animate-on-scroll"
      style={{
        background: "linear-gradient(120deg, #fff8e6 0%, #fff1b8 100%)",
        padding: "60px 24px",
        marginBottom: "80px",
        boxShadow: "0 10px 30px rgba(250, 219, 95, 0.2)",
      }}
    >
      <Row
        align="middle"
        gutter={[40, 40]}
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Col xs={24} md={6} className="text-center">
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              width: "180px",
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 15px 30px rgba(250, 173, 20, 0.2)",
            }}
          >
            <TrophyOutlined style={{ fontSize: "100px", color: "#faad14" }} />
          </div>
        </Col>
        <Col xs={24} md={18}>
          <Title
            level={2}
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#873800",
              marginBottom: "24px",
            }}
          >
            中国软件杯大赛项目
          </Title>
          <div style={{ marginBottom: "20px" }}>
            <Tag
              color="#1677ff"
              style={{
                fontSize: "16px",
                padding: "6px 12px",
                borderRadius: "16px",
                fontWeight: "bold",
              }}
            >
              A组赛题
            </Tag>
            <Tag
              color="#52c41a"
              style={{
                fontSize: "16px",
                padding: "6px 12px",
                borderRadius: "16px",
                marginLeft: "12px",
                fontWeight: "bold",
              }}
            >
              2025年度
            </Tag>
            <Tag
              color="#722ed1"
              style={{
                fontSize: "16px",
                padding: "6px 12px",
                borderRadius: "16px",
                marginLeft: "12px",
                fontWeight: "bold",
              }}
            >
              科大讯飞出题
            </Tag>
          </div>
          <Paragraph
            style={{ fontSize: "16px", lineHeight: "1.8", color: "#5c3c00" }}
          >
            本项目基于第十四届中国软件杯大赛&#34;
            <Link
              href="https://www.cnsoftbei.com/content-3-1094-1.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5c3c00", fontWeight: "bold" }}
            >
              面向高校学生的多模态智能模拟面试评测智能体开发
            </Link>
            &#34;赛题进行设计与实现。
            旨在帮助高校学生提升面试能力，通过多模态技术实现对面试过程的全方位评测，从而增强就业竞争力。
          </Paragraph>
          <Paragraph
            style={{ fontSize: "16px", lineHeight: "1.8", color: "#5c3c00" }}
          >
            <strong style={{ fontSize: "18px" }}>技术特点：</strong>{" "}
            采用科大讯飞星火大模型作为核心AI引擎，结合文本、语音和视频多模态分析技术，
            通过WebRTC采集用户面试实况，应用深度学习算法进行情感与行为分析，提供专业、全面的面试评测服务。
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
}
