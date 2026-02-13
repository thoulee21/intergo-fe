import type { InterviewProgressItem } from "@/types/interview-progress";
import {
  QuestionCircleOutlined,
  StarFilled,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Tooltip as AntdTooltip,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Statistic,
  Tabs,
  theme,
  Typography,
} from "antd";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InterviewProgressCard from "./InterviewProgressCard";

const InterviewProgressTabs = ({
  progressData,
  loading,
  error,
}: {
  progressData: InterviewProgressItem[];
  loading: boolean;
  error: string | null;
}) => {
  const { token } = theme.useToken();
  const [activeKey, setActiveKey] = useState<string>("all");

  const calculateAllPositionsAvgData = useCallback(
    (data: InterviewProgressItem[]) => {
      if (!data || data.length === 0) return null;

      let totalOverallScore = 0;
      let totalContentScore = 0;
      let totalDeliveryScore = 0;
      let totalNonVerbalScore = 0;
      let count = 0;

      data.forEach((item) => {
        totalOverallScore += item.avgOverallScore;
        totalContentScore += item.avgContentScore;
        totalDeliveryScore += item.avgDeliveryScore;
        totalNonVerbalScore += item.avgNonVerbalScore;
        count++;
      });

      return {
        avgOverallScore: totalOverallScore / count,
        avgContentScore: totalContentScore / count,
        avgDeliveryScore: totalDeliveryScore / count,
        avgNonVerbalScore: totalNonVerbalScore / count,
      };
    },
    [],
  );

  const allPositionsAvgData = calculateAllPositionsAvgData(progressData);

  const getAllCommonItems = (
    data: InterviewProgressItem[],
    type: "strengths" | "improvements",
  ) => {
    const itemsMap = new Map<string, number>();

    data.forEach((position) => {
      const items =
        type === "strengths"
          ? position.commonStrengths
          : position.commonImprovements;
      items.forEach((item) => {
        const count = itemsMap.get(item.item) || 0;
        itemsMap.set(item.item, count + item.count);
      });
    });

    return Array.from(itemsMap.entries())
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTrendData = (data: InterviewProgressItem[]) => {
    const allInterviews: { date: string; score: number }[] = [];

    data.forEach((position) => {
      position.scoreTrend.forEach((trend) => {
        allInterviews.push({
          date: trend.date,
          score: trend.overallScore,
        });
      });
    });

    return allInterviews.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  };

  const items = useMemo(
    () => [
      {
        key: "all",
        label: "概览",
        children: (
          <div>
            {}
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总面试次数"
                    value={progressData.reduce(
                      (total, item) => total + item.interviewCount,
                      0,
                    )}
                    styles={{ content: { color: "#1677ff" } }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总体平均分数"
                    value={Math.round(
                      allPositionsAvgData?.avgOverallScore || 0,
                    )}
                    suffix="/100"
                    styles={{ content: { color: "#3f8600" } }}
                    prefix={<StarFilled />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="最高分职位"
                    value={
                      progressData
                        .slice()
                        .sort(
                          (a, b) => b.avgOverallScore - a.avgOverallScore,
                        )[0]?.positionType || "无"
                    }
                    styles={{ content: { color: token.colorPrimary } }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已面试职位数"
                    value={progressData.length}
                    styles={{ content: { color: "#722ed1" } }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 能力雷达图和职位得分对比 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card
                  title="综合能力评估"
                  extra={
                    <AntdTooltip title="展示所有职位的平均评分表现">
                      <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </AntdTooltip>
                  }
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={[
                        {
                          subject: "总体表现",
                          所有职位: Math.round(
                            allPositionsAvgData?.avgOverallScore || 0,
                          ),
                          fullMark: 100,
                        },
                        {
                          subject: "内容质量",
                          所有职位: Math.round(
                            allPositionsAvgData?.avgContentScore || 0,
                          ),
                          fullMark: 100,
                        },
                        {
                          subject: "表达能力",
                          所有职位: Math.round(
                            allPositionsAvgData?.avgDeliveryScore || 0,
                          ),
                          fullMark: 100,
                        },
                        {
                          subject: "非语言表现",
                          所有职位: Math.round(
                            allPositionsAvgData?.avgNonVerbalScore || 0,
                          ),
                          fullMark: 100,
                        },
                      ]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="所有职位平均"
                        dataKey="所有职位"
                        stroke={token.colorPrimary}
                        fill={token.colorPrimary}
                        fillOpacity={0.4}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: token.colorBgElevated,
                          borderColor: token.colorBorder,
                          borderRadius: "6px",
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="各职位得分对比"
                  extra={
                    <AntdTooltip title="显示前10个职位的平均分数">
                      <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </AntdTooltip>
                  }
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={progressData
                        .sort((a, b) => b.avgOverallScore - a.avgOverallScore)
                        .slice(0, 10)
                        .map((item) => ({
                          name: item.positionType,
                          score: Math.round(item.avgOverallScore),
                        }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={token.colorBorder}
                      />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        stroke={token.colorText}
                        tick={{ fill: token.colorTextSecondary }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={85}
                        tick={{ fontSize: 12, fill: token.colorTextSecondary }}
                        stroke={token.colorText}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: token.colorBgElevated,
                          borderColor: token.colorBorder,
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: token.colorText }}
                      />
                      <Legend wrapperStyle={{ color: token.colorText }} />
                      <Bar
                        dataKey="score"
                        name="总体评分"
                        fill={token.colorPrimary}
                        label={{
                          position: "right",
                          fill: "black",
                        }}
                        isAnimationActive
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* 最常见优势和弱项 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card
                  title="面试表现总结"
                  extra={
                    <AntdTooltip title="根据所有面试统计的常见优势和需要改进项">
                      <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </AntdTooltip>
                  }
                  styles={{ body: { paddingTop: 0 } }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Typography.Title level={5} style={{ color: "#52c41a" }}>
                        <StarFilled /> 最常见优势
                      </Typography.Title>
                      <ul style={{ paddingLeft: 20 }}>
                        {getAllCommonItems(progressData, "strengths")
                          .slice(0, 5)
                          .map((item, index) => (
                            <li key={index} style={{ marginBottom: 8 }}>
                              {item.item}{" "}
                              <Typography.Text type="secondary">
                                ({item.count}次)
                              </Typography.Text>
                            </li>
                          ))}
                      </ul>
                    </Col>
                    <Col span={12}>
                      <Typography.Title level={5} style={{ color: "#faad14" }}>
                        <QuestionCircleOutlined /> 最常见需改进项
                      </Typography.Title>
                      <ul style={{ paddingLeft: 20 }}>
                        {getAllCommonItems(progressData, "improvements")
                          .slice(0, 5)
                          .map((item, index) => (
                            <li key={index} style={{ marginBottom: 8 }}>
                              {item.item}{" "}
                              <Typography.Text type="secondary">
                                ({item.count}次)
                              </Typography.Text>
                            </li>
                          ))}
                      </ul>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* 随时间的进步趋势 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card
                  title="总体进步趋势"
                  extra={
                    <AntdTooltip title="展示所有面试随时间的分数变化">
                      <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                    </AntdTooltip>
                  }
                  styles={{
                    body: { paddingRight: 26, paddingLeft: 0, marginLeft: 0 },
                  }}
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getTrendData(progressData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          moment(date).format("MM-DD HH:mm")
                        }
                      />
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
                        dataKey="score"
                        name="总体评分"
                        stroke="#1677ff"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </div>
        ),
      },
      ...progressData.map((item) => ({
        key: item.positionType,
        label: item.positionType,
        children: <InterviewProgressCard progress={item} loading={false} />,
      })),
    ],
    [
      progressData,
      allPositionsAvgData?.avgOverallScore,
      allPositionsAvgData?.avgContentScore,
      allPositionsAvgData?.avgDeliveryScore,
      allPositionsAvgData?.avgNonVerbalScore,
      token.colorPrimary,
      token.colorBgElevated,
      token.colorBorder,
      token.colorTextSecondary,
      token.colorText,
    ],
  );

  if (loading) {
    return (
      <Card>
        <Spin tip="加载面试进度数据中...">
          <div style={{ height: 200 }} />
        </Spin>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert message="错误" description={error} type="error" showIcon />
      </Card>
    );
  }

  // 如果没有数据
  if (!progressData || progressData.length === 0) {
    return (
      <Card>
        <Empty
          description="未完成任何面试，无法生成进度分析"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div className="interview-progress-tabs">
      <Tabs
        defaultActiveKey="all"
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        type="line"
      />
    </div>
  );
};

export default InterviewProgressTabs;
