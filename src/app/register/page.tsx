"use client";

import registerLottieAni from "@/assets/animations/register.json";
import { authAPI } from "@/services/api";
import eventBus from "@/utils/eventBus";
import {
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Radio,
  Space,
  Typography,
} from "antd";
import { useLottie } from "lottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "recruiter">(
    "candidate",
  );

  const { View } = useLottie({
    animationData: registerLottieAni,
    autoplay: true,
    loop: true,
    style: {
      display: "flex",
      flex: 0.7,
      minWidth: "300px",
      marginRight: "5.5vw",
    },
    async: true,
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
  const handleRegister = async (values: {
    username: string;
    password: string;
    confirmPassword: string;
    email?: string;
    user_type: "candidate" | "recruiter";
    invitation_code?: string;
  }) => {
    try {
      if (values.password !== values.confirmPassword) {
        messageApi.error("两次密码输入不一致");
        return;
      }

      setLoading(true);
      const response = await authAPI.register({
        username: values.username,
        password: values.password,
        email: values.email,
        user_type: values.user_type,
        invitation_code: values.invitation_code,
      });

      if (response.status === 201) {
        messageApi.success(response.data.message || "注册成功！");

        try {
          const loginResponse = await authAPI.login({
            username: values.username,
            password: values.password,
          });

          if (loginResponse.status === 200) {
            const userInfo = await authAPI.validateSession();

            eventBus.publish("AUTH_STATE_CHANGED", {
              authenticated: true,
              username: userInfo.data.username,
              isAdmin: userInfo.data.is_admin,
              userType: userInfo.data.user_type,
              source: "register_page",
            });

            setTimeout(() => {
              if (userInfo.data.user_type === "recruiter") {
                router.push("/recruiter");
              } else {
                router.push("/");
              }
            }, 1000);

            return;
          }
        } catch (loginError) {
          console.error("自动登录失败:", loginError);
        }

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error: unknown) {
      console.error("注册失败:", error);
      messageApi.error(
        (
          error as {
            response?: { data?: { error?: string } };
          }
        ).response?.data?.error || "注册失败，该用户名可能已被使用",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
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
          paddingLeft: "16px",
          paddingRight: "16px",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            注册账号
          </Title>
          <Paragraph type="secondary">创建您的智能模拟面试系统账号</Paragraph>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          initialValues={{
            user_type: "candidate",
          }}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 3, message: "用户名至少需要3个字符" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="邮箱（可选）"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="user_type"
            label="用户类型"
            rules={[{ required: true, message: "请选择用户类型" }]}
          >
            <Radio.Group
              onChange={(e) => {
                const newUserType = e.target.value;
                setUserType(newUserType);
              }}
            >
              <Radio.Button value="candidate">求职者</Radio.Button>
              <Radio.Button value="recruiter">招聘者</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="invitation_code">
            <Input
              prefix={<KeyOutlined className="site-form-item-icon" />}
              placeholder="邀请码（可选）"
              size="large"
              disabled={userType === "recruiter"}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少需要6个字符" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码输入不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="确认密码"
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
              注册
            </Button>
          </Form.Item>
        </Form>
        <Divider>或者</Divider>
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Button block onClick={() => router.push("/login")}>
            已有账号？去登录
          </Button>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link href="/">返回首页</Link>
          </div>
        </Space>
      </Card>
    </div>
  );
}
