"use client";

import { authAPI, recruiterAPI } from "@/services/api";
import {
  BarChartOutlined,
  GiftOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface RecruiterStats {
  totalCandidates: number;
  newCandidates: number;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  monthlySessionsGrowth: number;
  candidatesWithResume: number;
  recentSessionsCount: number;
}

export default function RecruiterDashboard() {
  const { message } = App.useApp();
  const [stats, setStats] = useState<RecruiterStats>({
    totalCandidates: 0,
    newCandidates: 0,
    totalSessions: 0,
    completedSessions: 0,
    averageScore: 0,
    monthlySessionsGrowth: 0,
    candidatesWithResume: 0,
    recentSessionsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [invitationCode, setInvitationCode] = useState<string>("");
  const [invitationLoading, setInvitationLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await recruiterAPI.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("获取统计数据失败:", error);
        message.error("获取统计数据失败");
      }
    };

    const fetchInvitationCode = async () => {
      try {
        const response = await authAPI.getInvitationCode();
        setInvitationCode(response.data.invitation_code);
      } catch {
        console.log("尚未生成邀请码");
      }
    };

    Promise.all([fetchStats(), fetchInvitationCode()])
      .catch((error) => {
        console.error("初始化数据失败:", error);
        message.error("初始化数据失败");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [message]);

  const generateInvitationCode = async () => {
    try {
      setInvitationLoading(true);
      const response = await authAPI.generateInvitationCode();
      setInvitationCode(response.data.invitation_code);
      message.success("邀请码生成成功！");
    } catch (error) {
      console.error("生成邀请码失败:", error);
      message.error("生成邀请码失败");
    } finally {
      setInvitationLoading(false);
    }
  };
  return (
    <div>
      {}
      <div
        style={{
          paddingTop: "110px",
          paddingBottom: "54px",
          paddingLeft: "156px",
          paddingRight: "24px",
          marginBottom: "36px",
          gap: 16,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "linear-gradient(120deg, #1890ff 0%, #10239e 100%)",
          flex: 1,
          minHeight: "350px",
        }}
      >
        {}
        <div
          style={{
            minWidth: "200px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            margin: "auto 0",
            paddingRight: "16px",
          }}
        >
          <Title
            level={2}
            style={{
              color: "white",
            }}
          >
            你好，招聘者
          </Title>
        </div>

        {}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <TeamOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#1890ff" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        求职者总数
                      </span>
                    }
                    value={stats.totalCandidates}
                    styles={{ content: { color: "#1890ff" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <BarChartOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#52c41a" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        会话总数
                      </span>
                    }
                    value={stats.totalSessions}
                    styles={{ content: { color: "#52c41a" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <UserOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#722ed1" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        已完成会话
                      </span>
                    }
                    value={stats.completedSessions}
                    styles={{ content: { color: "#722ed1" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <BarChartOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#faad14" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        平均分数
                      </span>
                    }
                    value={stats.averageScore}
                    suffix="分"
                    styles={{ content: { color: "#faad14" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <UserOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#13c2c2" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        本月新增求职者
                      </span>
                    }
                    value={stats.newCandidates}
                    styles={{ content: { color: "#13c2c2" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <TeamOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#eb2f96" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        有简历的求职者
                      </span>
                    }
                    value={stats.candidatesWithResume}
                    styles={{ content: { color: "#eb2f96" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <BarChartOutlined
                    style={{ marginRight: 8, fontSize: 36, color: "#722ed1" }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        最近7天会话
                      </span>
                    }
                    value={stats.recentSessionsCount}
                    styles={{ content: { color: "#722ed1" } }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <Space orientation="horizontal">
                  <BarChartOutlined
                    style={{
                      marginRight: 8,
                      fontSize: 36,
                      color:
                        stats.monthlySessionsGrowth >= 0
                          ? "#52c41a"
                          : "#ff4d4f",
                    }}
                  />
                  <Statistic
                    title={
                      <span
                        style={{
                          fontSize: 16,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        本月会话增长
                      </span>
                    }
                    value={stats.monthlySessionsGrowth}
                    suffix="%"
                    styles={{
                      content: {
                        color:
                          stats.monthlySessionsGrowth >= 0
                            ? "#52c41a"
                            : "#ff4d4f",
                      },
                    }}
                    loading={loading}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {}
      <Row
        style={{
          marginBottom: 24,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Col span={24}>
          <Card
            title={
              <Space>
                <GiftOutlined />
                <span>邀请码管理</span>
              </Space>
            }
            variant="borderless"
            extra={
              invitationCode ? (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={generateInvitationCode}
                  loading={invitationLoading}
                  type="dashed"
                >
                  重新生成邀请码
                </Button>
              ) : (
                <Button
                  icon={<GiftOutlined />}
                  type="primary"
                  onClick={generateInvitationCode}
                  loading={invitationLoading}
                >
                  生成邀请码
                </Button>
              )
            }
          >
            <Spin spinning={loading}>
              {invitationCode ? (
                <Alert
                  title="您的邀请码"
                  description={
                    <Space orientation="vertical">
                      求职者在注册时可以使用此邀请码，您将能够查看他们的面试记录。
                      <Text code copyable={{ text: invitationCode }}>
                        {invitationCode}
                      </Text>
                    </Space>
                  }
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  title="尚未生成邀请码"
                  description="生成邀请码后，求职者可以在注册时使用，您将能够查看他们的面试记录。"
                  type="info"
                  showIcon
                />
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
