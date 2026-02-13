"use client";

import ResumeManagement from "@/components/admin/user/ResumeManagement";
import UserInfoCard from "@/components/admin/user/UserInfoCard";
import UserProgressAnalysis from "@/components/admin/user/UserProgressAnalysis";
import UserRelationshipCard from "@/components/shared/profile/UserRelationshipCard";
import { interviewAPI } from "@/services/api";
import type { UserProfile } from "@/types";
import { LineChartOutlined } from "@ant-design/icons";
import { App, Button, Card, Col, Result, Row, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const { useApp } = App;

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  const { message: messageApi } = useApp();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const fetchUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUserDetail(userId);
      setUser(response.data);
    } catch (error: any) {
      setErrorCode(error.response?.status);
      console.error("获取用户详情失败:", error);
      messageApi.error("获取用户详情失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [userId, messageApi]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  if (errorCode === 404) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <Button type="primary" onClick={() => router.push("/admin/users")}>
            返回列表
          </Button>
        }
      />
    );
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6}>
          <UserInfoCard
            userId={userId}
            messageApi={messageApi}
            user={user}
            loading={loading}
          />

          {user && (
            <div style={{ margin: "16px 0" }}>
              <UserRelationshipCard user={user} />
            </div>
          )}

          <ResumeManagement user={user} fetchUserDetail={fetchUserDetail} />
        </Col>

        <Col xs={24} md={18}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <LineChartOutlined style={{ marginRight: 8 }} />
                面试进度分析
              </div>
            }
            type="inner"
          >
            <UserProgressAnalysis userId={userId} />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}
