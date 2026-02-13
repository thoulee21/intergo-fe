"use client";

import { authAPI } from "@/services/api";
import { Button, Result, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireRecruiter?: boolean;
}

export default function AuthGuard({
  children,
  requireAdmin = false,
  requireRecruiter = false,
}: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = await authAPI.validateSession();
      const isAuthenticated = userInfo?.data?.valid || false;

      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }

      if (requireAdmin) {
        const isAdmin = userInfo?.data?.is_admin || false;

        if (!isAdmin) {
          setIsAuthorized(false);
          return;
        }
      }

      if (requireRecruiter) {
        const isRecruiter = userInfo?.data?.user_type === "recruiter";

        if (!isRecruiter) {
          setIsAuthorized(false);
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, requireAdmin, requireRecruiter]);

  if (isAuthorized === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="验证权限中..." fullscreen />
      </div>
    );
  }

  // 无权限状态
  if (!isAuthorized) {
    return (
      <Result
        status="403"
        title="无权访问"
        subTitle="您没有访问此页面的权限"
        style={{ textAlign: "center", marginTop: "20vh" }}
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            返回首页
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
