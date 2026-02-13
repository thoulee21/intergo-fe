import { Card, Col, Row, Statistic, Typography } from "antd";
import CountUp from "react-countup";

const { Paragraph } = Typography;

export default function StatisticHighlights() {
  return (
    <div
      className="stats-section animate-on-scroll"
      style={{ marginBottom: "60px" }}
    >
      <Row
        gutter={[24, 24]}
        justify="center"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Col xs={12} sm={6}>
          <Card
            variant="outlined"
            style={{
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Statistic
              title="准确度"
              value={97.8}
              suffix="%"
              styles={{ content: { color: "#1890ff", fontWeight: "bold" } }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={1}
                  preserveValue
                />
              )}
            />
            <Paragraph
              style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}
            >
              面试评估准确率
            </Paragraph>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            variant="outlined"
            style={{
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Statistic
              title="岗位覆盖"
              value={50}
              suffix="+"
              styles={{ content: { color: "#52c41a", fontWeight: "bold" } }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={1}
                  preserveValue
                />
              )}
            />
            <Paragraph
              style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}
            >
              不同职业类别
            </Paragraph>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            variant="outlined"
            style={{
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Statistic
              title="满意度"
              value={96.2}
              suffix="%"
              styles={{ content: { color: "#fa8c16", fontWeight: "bold" } }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={1}
                  preserveValue
                />
              )}
            />
            <Paragraph
              style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}
            >
              用户评价满意度
            </Paragraph>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            variant="outlined"
            style={{
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Statistic
              title="推荐率"
              value={94.5}
              suffix="%"
              styles={{ content: { color: "#722ed1", fontWeight: "bold" } }}
              formatter={(value) => (
                <CountUp
                  end={Number(value)}
                  duration={2}
                  delay={1}
                  preserveValue
                />
              )}
            />
            <Paragraph
              style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}
            >
              用户推荐率
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
