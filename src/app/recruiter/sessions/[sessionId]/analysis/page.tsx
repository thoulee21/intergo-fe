"use client";

import MultimodalAnalysis from "@/components/analysis";
import getStatusTag from "@/components/shared/sessions/getStatusTag";
import { recruiterAPI } from "@/services/api";
import type { QuestionType, SessionDetailsType } from "@/types/session";
import formatEvaluationToMarkdown from "@/utils/formatEvaluationToMarkdown";
import {
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Row,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

const { Title, Paragraph } = Typography;

export default function RecruiterSessionAnalysisPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();

  const [sessionDetails, setSessionDetails] =
    useState<SessionDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recruiterAPI.getSessionAnalysis(sessionId);
      setSessionDetails(response.data);
    } catch (error) {
      console.error("获取会话详情失败:", error);
      message.error("获取会话详情失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSessionDetails();
  }, [fetchSessionDetails, sessionId]);

  const handleViewResults = () => {
    router.push(`/results/${sessionId}`);
  };

  const handleBack = () => {
    router.push("/recruiter");
  };

  const formatDateTime = useCallback((dateString: string | null) => {
    return dateString ? new Date(dateString).toLocaleString() : "尚未结束";
  }, []);

  const calculateDuration = useCallback(() => {
    if (!sessionDetails?.startTime || !sessionDetails.endTime) return "进行中";

    const start = new Date(sessionDetails.startTime).getTime();
    const end = new Date(sessionDetails.endTime).getTime();
    const durationMinutes = Math.round((end - start) / 60000); 

    if (durationMinutes < 60) {
      return `${durationMinutes} 分钟`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours} 小时 ${minutes} 分钟`;
    }
  }, [sessionDetails]);

  const questionsColumns = useMemo(
    () => [
      {
        title: "索引",
        dataIndex: "questionIndex",
        key: "questionIndex",
        width: 60,
        render: (text: string) => <Tag>{text + 1}</Tag>,
      },
      {
        title: "问题内容",
        dataIndex: "question",
        key: "question",
        render: (text: string) => (
          <div style={{ maxHeight: "100px", overflow: "auto" }}>{text}</div>
        ),
      },
      {
        title: "回答状态",
        key: "answerStatus",
        width: 120,
        render: (_: string, record: QuestionType) => (
          <Tag color={record.answer ? "success" : "default"}>
            {record.answer ? "已回答" : "未回答"}
          </Tag>
        ),
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (text: string) => formatDateTime(text),
      },
    ],
    [formatDateTime],
  );

  const bottomTabsItems = useMemo(
    () => [
      {
        key: "questions",
        label: (
          <span>
            <QuestionCircleOutlined /> 问题与回答
          </span>
        ),
        children: (
          <Card>
            <Table
              dataSource={
                sessionDetails?.questions?.map((q) => ({
                  ...q,
                  key: q.id,
                })) || []
              }
              columns={questionsColumns}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ padding: "0 20px" }}>
                    {record.answer ? (
                      <>
                        <Title level={5}>求职者回答</Title>
                        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                          {record.answer}
                        </Paragraph>
                        {record.evaluation && (
                          <>
                            <Divider />
                            <Title level={5}>AI评估</Title>
                            <div className="markdown-content">
                              <ReactMarkdown>
                                {formatEvaluationToMarkdown(record.evaluation)}
                              </ReactMarkdown>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Paragraph type="secondary">
                        求职者尚未回答此问题
                      </Paragraph>
                    )}
                  </div>
                ),
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.answer ? (
                    expanded ? (
                      <EyeOutlined onClick={(e) => onExpand(record, e)} />
                    ) : (
                      <EyeOutlined
                        onClick={(e) => onExpand(record, e)}
                        style={{ color: "#1890ff" }}
                      />
                    )
                  ) : null,
              }}
              pagination={false}
            />
          </Card>
        ),
      },
      {
        key: "analysis",
        label: (
          <span>
            <VideoCameraOutlined /> 多模态分析
          </span>
        ),
        children: (
          <Card>
            {sessionDetails?.analysis ? (
              <MultimodalAnalysis record={sessionDetails.analysis} />
            ) : (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <Paragraph type="secondary">暂无多模态分析数据</Paragraph>
              </div>
            )}
          </Card>
        ),
      },
    ],
    [questionsColumns, sessionDetails],
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: 20 }}>正在加载会话详情...</Paragraph>
      </div>
    );
  }

  if (!sessionDetails) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Paragraph>找不到会话详情</Paragraph>
        <Button type="primary" onClick={handleBack}>
          返回招聘管理
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={8}>
          <Card title="会话信息" style={{ height: "100%" }}>
            <Row gutter={16}>
              <Col span={24}>
                <Statistic
                  title="求职者"
                  value={sessionDetails.userInfo?.username || "未知用户"}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#2f54eb" }}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="职位类型"
                  value={sessionDetails.positionType}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="难度等级"
                  value={sessionDetails.difficulty}
                  prefix={<TrophyOutlined />}
                  valueStyle={{
                    color:
                      sessionDetails.difficulty === "高级"
                        ? "#d4380d"
                        : sessionDetails.difficulty === "中级"
                          ? "#fa8c16"
                          : "#52c41a",
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="时间统计" style={{ height: "100%" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="开始时间"
                  value={formatDateTime(sessionDetails.startTime)}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="结束时间"
                  value={formatDateTime(sessionDetails.endTime)}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="持续时间"
                  value={calculateDuration()}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{
                    color: sessionDetails.endTime ? "#08979c" : "#fa8c16",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="问题数量"
                  value={sessionDetails.questions?.length || 0}
                  suffix="题"
                  prefix={<QuestionCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="状态信息"
            style={{ height: "100%" }}
            extra={
              sessionDetails.status === "completed" && (
                <Button icon={<FileTextOutlined />} onClick={handleViewResults}>
                  查看评估报告
                </Button>
              )
            }
          >
            <Row gutter={16}>
              <Col xs={24}>
                <Statistic
                  title="完成问题"
                  value={
                    sessionDetails.questions?.filter((q) => q.answer).length ||
                    0
                  }
                  suffix={`/ ${sessionDetails.questions?.length || 0}`}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="完成率"
                  value={
                    sessionDetails.questions?.length
                      ? Math.round(
                          (sessionDetails.questions.filter((q) => q.answer)
                            .length /
                            sessionDetails.questions.length) *
                            100,
                        )
                      : 0
                  }
                  suffix="%"
                  valueStyle={{
                    color:
                      (sessionDetails.questions?.filter((q) => q.answer)
                        .length || 0) /
                        (sessionDetails.questions?.length || 1) >
                      0.8
                        ? "#3f8600"
                        : "#cf1322",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="会话状态"
                  valueRender={() => getStatusTag(sessionDetails.status)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Tabs animated items={bottomTabsItems} />
    </div>
  );
}
