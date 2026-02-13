import { TrophyOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export default function Tips() {
  return (
    <Card
      className="tips-card"
      style={{
        margin: "10px auto",
        textAlign: "center",
      }}
      title={
        <>
          <TrophyOutlined style={{ marginRight: 8 }} /> 准备建议
        </>
      }
    >
      <Paragraph>1. 确保你的摄像头和麦克风正常工作</Paragraph>
      <Paragraph>2. 选择安静、光线充足的环境</Paragraph>
      <Paragraph>3. 穿着得体，保持专业形象</Paragraph>
      <Paragraph>4. 准备好纸笔，可能需要记录一些信息</Paragraph>
    </Card>
  );
}
