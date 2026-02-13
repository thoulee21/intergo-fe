"use client";

import UserCreateDrawer from "@/components/admin/user/UserDrawer";
import { interviewAPI } from "@/services/api";
import {
  DeleteOutlined,
  LockOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  App,
  Badge,
  Button,
  Card,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const { Text } = Typography;

interface UserType {
  id: number;
  username: string;
  email: string | null;
  is_admin: boolean;
  user_type: "candidate" | "recruiter";
  status: string;
  created_at: string;
  last_login: string | null;
}

export default function UsersPage() {
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | undefined>(
    "descend",
  );
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error("获取用户列表失败:", error);
      message.error("获取用户列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId: number) => {
    try {
      setLoading(true);
      await interviewAPI.deleteUser(userId.toString());
      messageApi.success("用户已删除");
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { error?: string } };
      };
      messageApi.error(
        errorResponse.response?.data?.error || "删除用户失败，请稍后重试",
      );
    } finally {
      await fetchUsers();
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: boolean) => {
    try {
      setLoading(true);
      await interviewAPI.updateUser(userId.toString(), {
        status: newStatus ? "active" : "inactive",
      });
      messageApi.success(`用户状态已更新为${newStatus ? "启用" : "停用"}`);
      fetchUsers();
    } catch (error) {
      console.error("更新用户状态失败:", error);
      messageApi.error("更新用户状态失败，请稍后重试");
      setLoading(false);
    }
  };
  const handleCreate = () => {
    form.resetFields();
    form.setFieldsValue({
      is_admin: false,
      user_type: "candidate",
    });
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSubmit = async () => {
    await fetchUsers();
  };

  const filteredUsers = users
    .filter(
      (user) =>
        (statusFilter === "all" ||
          (statusFilter === "active" && user.status === "active") ||
          (statusFilter === "inactive" && user.status === "inactive")) &&
        (userTypeFilter === "all" || user.user_type === userTypeFilter) &&
        (searchText === "" ||
          user.username.toLowerCase().includes(searchText.toLowerCase()) ||
          (user.email &&
            user.email.toLowerCase().includes(searchText.toLowerCase()))),
    )
    .sort((a, b) => {
      const direction = sortOrder === "ascend" ? 1 : -1;

      switch (sortField) {
        case "username":
          return direction * a.username.localeCompare(b.username);
        case "email":
          const emailA = a.email || "";
          const emailB = b.email || "";
          return direction * emailA.localeCompare(emailB);
        case "is_admin":
          return (
            direction * (a.is_admin === b.is_admin ? 0 : a.is_admin ? 1 : -1)
          );
        case "user_type":
          return direction * a.user_type.localeCompare(b.user_type);
        case "status":
          return (
            direction *
            (a.status === b.status ? 0 : a.status === "active" ? 1 : -1)
          );
        case "last_login":
          const lastLoginA = a.last_login
            ? new Date(a.last_login).getTime()
            : 0;
          const lastLoginB = b.last_login
            ? new Date(b.last_login).getTime()
            : 0;
          return direction * (lastLoginA - lastLoginB);
        case "created_at":
        default:
          return (
            direction *
            (new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime())
          );
      }
    });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      sorter: true,
      sortOrder: sortField === "username" ? sortOrder : undefined,
      render: (text: string, record: UserType) => (
        <Link href={`/admin/users/${record.id}`}>
          <Tag color="blue" style={{ cursor: "pointer" }}>
            {text}
          </Tag>
        </Link>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder: sortField === "email" ? sortOrder : undefined,
      render: (email: string | null) =>
        email ? (
          <Link href={`mailto:${email}`}>{email}</Link>
        ) : (
          <Text type="secondary">未设置</Text>
        ),
    },
    {
      title: "角色",
      dataIndex: "is_admin",
      key: "is_admin",
      width: 100,
      sorter: true,
      sortOrder: sortField === "is_admin" ? sortOrder : undefined,
      render: (isAdmin: boolean) => (
        <Tag
          color={isAdmin ? "gold" : "default"}
          icon={isAdmin ? <LockOutlined /> : <UnlockOutlined />}
        >
          {isAdmin ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "用户类型",
      dataIndex: "user_type",
      key: "user_type",
      width: 100,
      sorter: true,
      sortOrder: sortField === "user_type" ? sortOrder : undefined,
      render: (userType: "candidate" | "recruiter") => {
        const colorMap = {
          candidate: "blue",
          recruiter: "green",
        };
        const labelMap = {
          candidate: "候选人",
          recruiter: "招聘官",
        };
        return (
          <Tag color={colorMap[userType] || "default"}>
            {labelMap[userType] || userType}
          </Tag>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      sorter: true,
      sortOrder: sortField === "status" ? sortOrder : undefined,
      render: (status: string) => {
        if (status === "active") {
          return <Badge status="success" text="启用" />;
        } else {
          return <Badge status="error" text="停用" />;
        }
      },
    },
    {
      title: "注册时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: true,
      sortOrder: sortField === "created_at" ? sortOrder : undefined,
    },
    {
      title: "上次登录",
      dataIndex: "last_login",
      key: "last_login",
      render: (text: string | null) =>
        text ? (
          new Date(text).toLocaleString()
        ) : (
          <Text type="secondary">从未登录</Text>
        ),
      sorter: true,
      sortOrder: sortField === "last_login" ? sortOrder : undefined,
    },
    {
      title: "操作",
      key: "action",
      render: (_: string, record: UserType) => (
        <Space size="small">
          <Switch
            checked={record.status === "active"}
            checkedChildren="启用"
            unCheckedChildren="停用"
            onChange={(checked) => handleStatusChange(record.id, checked)}
          />
          <Popconfirm
            title="确定要删除此用户吗？"
            description="如果用户有关联数据将改为停用，否则将永久删除。"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="admin-users-page">
        <Card style={{ marginBottom: 20 }}>
          <Space
            wrap
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Space wrap>
              <Input
                placeholder="搜索用户名或邮箱"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
              <Space wrap>
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  style={{ width: 120 }}
                  options={[
                    { value: "all", label: "全部状态" },
                    { value: "active", label: "启用" },
                    { value: "inactive", label: "停用" },
                  ]}
                />
                <Select
                  value={userTypeFilter}
                  onChange={(value) => setUserTypeFilter(value)}
                  style={{ width: 120 }}
                  options={[
                    { value: "all", label: "全部类型" },
                    { value: "candidate", label: "候选人" },
                    { value: "recruiter", label: "招聘官" },
                  ]}
                />
              </Space>
            </Space>
            <Space wrap>
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleCreate}
              >
                创建用户
              </Button>
            </Space>
          </Space>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            bordered
            onChange={(_pagination, _filters, sorter) => {
              const typedSorter = sorter as {
                field: string;
                order?: "ascend" | "descend";
              };

              if (typedSorter) {
                setSortField(typedSorter.field);
                setSortOrder(typedSorter.order);
              }
            }}
          />
        </Card>
      </div>
      <UserCreateDrawer
        closeDrawer={closeDrawer}
        drawerVisible={drawerVisible}
        form={form}
        onSuccess={handleSubmit}
      />
    </>
  );
}
