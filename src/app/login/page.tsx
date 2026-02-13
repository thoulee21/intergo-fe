"use client";

import loginLottieAni from "@/assets/animations/login.json";
import { authAPI } from "@/services/api";
import eventBus from "@/utils/eventBus";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import { useLottie } from "lottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(false);

  const { View } = useLottie({
    animationData: loginLottieAni,
    autoplay: true,
    loop: true,
    style: {
      display: "flex",
      flex: 1,
      minWidth: "300px",
      paddingRight: "2vw",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authAPI.isAuthenticated();
      if (isAuth) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = useCallback(
    async (values: { username: string; password: string }) => {
      try {
        setLoading(true);
        const response = await authAPI.login(values);

        if (response.status === 200) {
          messageApi.success("登录成功");

          const userInfo = await authAPI.validateSession();

          eventBus.publish("AUTH_STATE_CHANGED", {
            authenticated: true,
            username: userInfo.data.username,
            isAdmin: userInfo.data.is_admin,
            userType: userInfo.data.user_type,
            source: "login_page",
          });

          if (userInfo.data.is_admin) {
            router.push("/admin/sessions");
          } else if (userInfo.data.user_type === "recruiter") {
            router.push("/recruiter");
          } else {
            router.push("/");
          }
        }
      } catch (error: unknown) {
        console.error("登录失败:", error);
        messageApi.error(
          (
            error as {
              response?: { data?: { error?: string } };
            }
          ).response?.data?.error || "登录失败，请检查用户名和密码",
        );
      } finally {
        setLoading(false);
      }
    },
    [messageApi, router],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>{View}</>

      <Card
        variant="outlined"
        hoverable
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            用户登录
          </Title>
          <Paragraph type="secondary">登录您的智能模拟面试系统账号</Paragraph>
        </div>

        <Form form={form} name="login" onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ marginTop: "8px" }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>或者</Divider>

        <Space orientation="vertical" style={{ width: "100%" }}>
          <Button block onClick={() => router.push("/register")}>
            注册新账号
          </Button>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link href="/">返回首页</Link>
          </div>
        </Space>
      </Card>
    </div>
  );
}
