"use client";

import interviewAPI from "@/services/api";
import { Button, Result, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewLearningPathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(true);

  useEffect(() => {
    const checkCreatePermission = async () => {
      try {
        const canCreateResponse = await interviewAPI.canCreateLearningPath();
        setCanCreate(canCreateResponse.data.canCreate);
      } catch (err) {
        console.error("获取创建权限失败:", err);
        setCanCreate(false);
      } finally {
        setLoading(false);
      }
    };

    checkCreatePermission();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "100px 0",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!canCreate) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，你没有权限创建学习路径规划。"
        extra={
          <Button type="primary" onClick={() => router.push("/profile")}>
            返回个人资料
          </Button>
        }
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
