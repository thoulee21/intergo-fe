import { SyncOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Paragraph } = Typography;

export default function LoadingFinalEvaluation() {
  return (
    <div style={{ textAlign: "center", padding: "30px 0" }}>
      <div className="loading-animation">
        <div className="loading-wave">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="loading-wave-bar"></div>
          ))}
        </div>
      </div>
      <Paragraph style={{ marginTop: 16, fontSize: "16px" }}>
        <SyncOutlined spin /> AI正在深入分析您的整体表现...
      </Paragraph>
      <Paragraph type="secondary" style={{ marginTop: 16 }}>
        正在综合分析您的回答质量、语言表达、专业度和逻辑性，生成全面的评估报告...
      </Paragraph>
    </div>
  );
}
