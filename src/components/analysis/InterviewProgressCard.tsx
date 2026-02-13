import type { InterviewProgressCardProps } from "@/types/interview-progress";
import { RiseOutlined, StarOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  Empty,
  List,
  Row,
  Spin,
  Statistic,
  Typography,
  theme,
} from "antd";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { Title, Text } = Typography;

const InterviewProgressCard: React.FC<InterviewProgressCardProps> = ({
  progress,
  loading,
}) => {
  const { token } = theme.useToken();

  if (loading) {
    return (
      <Card className="progress-analysis-card">
        <Spin tip="加载分析数据中...">
          <div style={{ height: 400 }} />
        </Spin>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card className="progress-analysis-card">
        <Empty description="暂无面试进度数据" />
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  // 分析总体进步趋势
  const calculateTrend = (trend: any[]) => {
    if (trend.length < 2) return 0;
    const first = trend[0].overallScore;
    const last = trend[trend.length - 1].overallScore;
    return last - first;
  };

  const trend = calculateTrend(progress.scoreTrend);
  const trendColor = trend > 0 ? "#52c41a" : trend < 0 ? "#f5222d" : "#faad14";
  const trendText = trend > 0 ? "上升" : trend < 0 ? "下降" : "持平";

  return (
    <Card
      className="progress-analysis-card"
      title={`${progress.positionType} - 面试进度分析`}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="总体评分"
            value={Math.round(progress.avgOverallScore)}
            suffix="/ 100"
            styles={{ content: { color: "#1677ff" } }}
          />
          <div style={{ marginTop: 8 }}>
            <Badge
              status={trend > 0 ? "success" : trend < 0 ? "error" : "warning"}
              text={
                <Text>
                  较首次面试
                  <span
                    style={{
                      color: trendColor,
                      fontWeight: "bold",
                      margin: "0 4px",
                    }}
                  >
                    {trend > 0 ? "+" : ""}
                    {Math.abs(trend).toFixed(1)} ({trendText})
                  </span>
                </Text>
              }
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="总面试次数"
            value={progress.interviewCount}
            styles={{ content: { color: "#722ed1" } }}
          />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              首次: {formatDate(progress.firstInterviewDate)}
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="内容得分"
            value={Math.round(progress.avgContentScore)}
            suffix="/ 100"
            styles={{ content: { color: "#13c2c2" } }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="表达得分"
            value={Math.round(progress.avgDeliveryScore)}
            suffix="/ 100"
            styles={{ content: { color: "#fa8c16" } }}
          />
        </Col>
      </Row>

      {progress.scoreTrend.length > 1 && (
        <div style={{ marginTop: 32 }}>
          <Title level={5}>面试分数趋势</Title>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={progress.scoreTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: token.colorBgElevated,
                  borderColor: token.colorBorder,
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="overallScore"
                name="总体评分"
                stroke="#1677ff"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="contentScore"
                name="内容得分"
                stroke="#13c2c2"
              />
              <Line
                type="monotone"
                dataKey="deliveryScore"
                name="表达得分"
                stroke="#fa8c16"
              />
              <Line
                type="monotone"
                dataKey="nonVerbalScore"
                name="非语言得分"
                stroke="#722ed1"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <Row gutter={24} style={{ marginTop: 32 }}>
        <Col xs={24} sm={12}>
          <div>
            <Title level={5}>
              <StarOutlined /> 常见优势
            </Title>
            <List
              size="small"
              dataSource={progress.commonStrengths}
              renderItem={(item) => (
                <List.Item>
                  <Badge
                    color="#52c41a"
                    text={`${item.item} (${item.count}次)`}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>
            <Title level={5}>
              <RiseOutlined /> 需要改进的方面
            </Title>
            <List
              size="small"
              dataSource={progress.commonImprovements}
              renderItem={(item) => (
                <List.Item>
                  <Badge
                    color="#faad14"
                    text={`${item.item} (${item.count}次)`}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Text type="secondary">
          最近一次面试时间: {formatDate(progress.lastInterviewDate)}
        </Text>
      </div>
    </Card>
  );
};

export default InterviewProgressCard;
