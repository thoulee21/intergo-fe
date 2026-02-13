import { interviewAPI } from "@/services/api";
import { CopyOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Radio,
  Space,
  Switch,
  theme,
  type FormInstance,
} from "antd";

interface UserCreateFormValues {
  username: string;
  password?: string;
  email?: string;
  is_admin: boolean;
  user_type: "candidate" | "recruiter";
}

interface UserCreateDrawerProps {
  closeDrawer: () => void;
  drawerVisible: boolean;
  form: FormInstance<any>;
  onSuccess: () => void; 
  title?: string;
}

const { useApp } = App;

export default function UserCreateDrawer({
  closeDrawer,
  drawerVisible,
  form,
  onSuccess,
  title,
}: UserCreateDrawerProps) {
  const defaultTitle = "创建新用户";
  const { message: messageApi, modal } = useApp();
  const { token } = theme.useToken();

  const handleFormSubmit = async (values: UserCreateFormValues) => {
    try {
      const response = await interviewAPI.createUser({
        username: values.username,
        password: values.password,
        email: values.email,
        is_admin: values.is_admin,
        user_type: values.user_type,
      });

      modal.confirm({
        title: "用户创建成功",
        icon: <UserAddOutlined />,
        content: (
          <div>
            <p>
              已成功创建用户： <strong>{values.username}</strong>
            </p>
            {response.data.password && (
              <>
                <p>初始密码为：</p>
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
                  <span>{response.data.password}</span>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(response.data.password);
                      messageApi.success("密码已复制到剪贴板");
                    }}
                  />
                </div>
                <p>请记下此密码，它不会再次显示。</p>
              </>
            )}
          </div>
        ),
        okText: "确定",
        onOk: () => {
          closeDrawer();
          onSuccess(); 
        },
      });
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { error?: string } };
      };
      messageApi.error(
        errorResponse.response?.data?.error || "创建用户失败，请稍后重试",
      );
    }
  };

  return (
    <Drawer
      title={title || defaultTitle}
      size={600}
      onClose={closeDrawer}
      open={drawerVisible}
      styles={{ body: { paddingBottom: 80 } }}
      extra={
        <Space>
          <Button onClick={closeDrawer}>取消</Button>
          <Button type="primary" onClick={() => form.submit()}>
            创建
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          is_admin: false,
          user_type: "candidate",
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: "请输入用户名" },
            { min: 3, message: "用户名至少3个字符" },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          help="如不填写，系统将自动生成随机密码"
          rules={[{ min: 6, message: "密码至少6个字符" }]}
        >
          <Input.Password placeholder="留空则自动生成随机密码" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
        >
          <Input placeholder="用户邮箱（可选）" />
        </Form.Item>

        <Form.Item
          name="user_type"
          label="用户类型"
          rules={[{ required: true, message: "请选择用户类型" }]}
        >
          <Radio.Group>
            <Radio value="candidate">候选人</Radio>
            <Radio value="recruiter">招聘官</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="is_admin" label="管理员权限" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
