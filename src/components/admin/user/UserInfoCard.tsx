import Header from "@/components/shared/profile/Header";
import interviewAPI from "@/services/api";
import type { UserProfile } from "@/types";
import { CopyOutlined, KeyOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  Switch,
  Typography,
  theme,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useEffect } from "react";

const { Option } = Select;
const { useApp } = App;

interface UserFormValues {
  username: string;
  email: string;
  is_admin: boolean;
  status: "active" | "inactive";
}

export default function UserInfoCard({
  userId,
  messageApi,
  user,
  loading,
}: {
  userId: string;
  messageApi: MessageInstance;
  user: UserProfile | null;
  loading: boolean;
}) {
  const [form] = Form.useForm();
  const { modal } = useApp();
  const { token } = theme.useToken();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleSave = async (values: UserFormValues) => {
    try {
      await interviewAPI.updateUser(userId, values);

      messageApi.success("用户信息更新成功");
    } catch (error) {
      console.error("更新用户信息失败:", error);
      messageApi.error("更新用户信息失败，请稍后重试");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await interviewAPI.resetUserPassword(userId);

      modal.success({
        title: "密码重置成功",
        icon: <KeyOutlined />,
        content: (
          <>
            <p>
              用户 <strong>{user?.username}</strong> 的密码已重置为：
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: token.colorBgTextActive,
                borderRadius: "4px",
                padding: "8px",
                fontFamily: "monospace",
                justifyContent: "space-between",
              }}
            >
              <span>{response.data.new_password}</span>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(response.data.new_password);
                  messageApi.success("密码已复制到剪贴板");
                }}
              />
            </div>
            <p>请记下此密码，它不会再次显示。</p>
          </>
        ),
      });
    } catch (error) {
      console.error("重置密码失败:", error);
      messageApi.error("重置密码失败，请稍后重试");
    }
  };

  if (!user) {
    if (loading) {
      return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      );
    } else {
      return (
        <Card>
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Typography.Text type="secondary">
              用户信息加载失败，请稍后重试
            </Typography.Text>
          </div>
        </Card>
      );
    }
  }

  return (
    <Card loading={loading}>
      <Header user={user} />
      <Divider />

      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
        >
          <Input placeholder="用户邮箱" />
        </Form.Item>
        <Form.Item name="is_admin" label="管理员权限" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select>
            <Option value="active">启用</Option>
            <Option value="inactive">停用</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
            <Button
              type="default"
              onClick={handleResetPassword}
              icon={<KeyOutlined />}
              block
            >
              重置密码
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
