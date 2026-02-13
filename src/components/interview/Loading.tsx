import { Typography } from "antd";

const { Paragraph } = Typography;

export const loadingTips = [
  "AI正在分析你的回答...",
  "正在评估关键点和逻辑性...",
  "分析语言表达和专业度...",
  "对照行业标准进行评分...",
  "生成个性化建议和反馈...",
];

export default function LoadingContent() {
  return (
    <div style={{ padding: "20px 0" }}>
      <div className="loading-tips-container">
        <Paragraph style={{ textAlign: "center" }}>
          AI正在深入分析您的回答，评估内容质量和表达方式...
        </Paragraph>
        <div className="loading-animation">
          <div className="loading-wave">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="loading-wave-bar"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
