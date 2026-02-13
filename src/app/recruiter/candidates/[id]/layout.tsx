"use client";

import { useFetchCandidateSessions } from "@/hooks/useCandidateSessions";
import { Button, Card, Col, Result, Row, Spin, Typography } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";

const { Title } = Typography;

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const candidateId = params?.id as string;
  const { sessions, candidate, error, loading } =
    useFetchCandidateSessions(candidateId);

  if (loading) {
    return <Spin size="large" tip="加载中..." fullscreen />;
  }

  if (error) {
    if ((error as any).status === 404) {
      return (
        <Result
          status="404"
          title="未找到求职者信息"
          subTitle={(error as any).response.data.error}
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "70vh",
          }}
          extra={
            <Link href="/recruiter/candidates">
              <Button type="primary">返回求职者列表</Button>
            </Link>
          }
        />
      );
    }

    if ((error as any).status === 403 || (error as any).status === 400) {
      return (
        <Result
          status="403"
          title="无权限访问"
          subTitle={(error as any).response.data.error}
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "70vh",
          }}
          extra={
            <Link href="/recruiter/candidates">
              <Button type="primary">返回求职者列表</Button>
            </Link>
          }
        />
      );
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <Row
        gutter={[16, 16]}
        justify="space-between"
        align="middle"
        style={{
          margin: "0 auto",
          marginBottom: 24,
          paddingLeft: 36,
          paddingRight: 36,
          paddingTop: 116,
          paddingBottom: 46,
          background: "linear-gradient(120deg, #1890ff 0%, #10239e 100%)",
        }}
      >
        <Col xs={24} md={12} lg={8}>
          <div
            style={{
              padding: "16px 0",
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              marginLeft: 16,
            }}
          >
            <Title level={1} style={{ color: "white" }}>
              {candidate?.username}
            </Title>
          </div>
        </Col>

        <Col xs={24} md={12} lg={16}>
          <Row gutter={[16, 16]} justify="end">
            <Col xs={24} sm={8} style={{ maxWidth: 250 }}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {sessions.length}
                  </div>
                  <div style={{ color: "#666", fontSize: "18px" }}>
                    总面试次数
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8} style={{ maxWidth: 250 }}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {sessions.filter((s) => s.status === "completed").length}
                  </div>
                  <div style={{ color: "#666", fontSize: "18px" }}>
                    已完成面试
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8} style={{ maxWidth: 250 }}>
              <Card style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#faad14",
                    }}
                  >
                    {sessions
                      .filter((s) => s.duration)
                      .reduce((acc, s) => acc + (s.duration || 0), 0)}
                  </div>
                  <div style={{ color: "#666", fontSize: "18px" }}>
                    总面试时长(分钟)
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {children}
    </div>
  );
}
