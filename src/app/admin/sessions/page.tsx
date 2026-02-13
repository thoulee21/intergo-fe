"use client";

import getStatusTag from "@/components/shared/sessions/getStatusTag";
import { interviewAPI } from "@/services/api";
import type { SessionType, UserProfile } from "@/types";
import {
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const { Text } = Typography;
const { Option } = Select;

export default function InterviewSessionPage() {
  const { message } = App.useApp();
  const router = useRouter();

  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState<number | undefined>(undefined);
  const [sortField, setSortField] = useState<string>("startTime");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | undefined>(
    "descend",
  );

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const params: { userId?: number } = {};
      if (userFilter) {
        params.userId = userFilter;
      }

      const response = await interviewAPI.getAllSessions(params);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("获取面试会话列表失败:", error);
      message.error("获取面试会话列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [message, userFilter]);

  useEffect(() => {
    fetchSessions();
    fetchUsers();
  }, [fetchSessions]);

  const fetchUsers = async () => {
    try {
      const response = await interviewAPI.getAllUsers();
      if (response.data && response.data.users) {
        setUsers(
          response.data.users.map((user: UserProfile) => ({
            id: user.id,
            username: user.username,
          })),
        );
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, userFilter]);

  const handleDelete = async (sessionId: string) => {
    try {
      setLoading(true);
      await interviewAPI.deleteSession(sessionId);
      message.success("面试会话已删除");
      fetchSessions();
    } catch (error) {
      console.error("删除面试会话失败:", error);
      message.error("删除面试会话失败，请稍后重试");
      setLoading(false);
    }
  };

  const handleViewDetails = (sessionId: string) => {
    router.push(`/admin/sessions/${sessionId}`);
  };

  const handleViewResults = (sessionId: string) => {
    router.push(`/results/${sessionId}`);
  };

  const filteredSessions = sessions
    .filter(
      (session: SessionType) =>
        (statusFilter === "all" || session.status === statusFilter) &&
        (positionFilter === "all" || session.positionType === positionFilter) &&
        (searchText === "" ||
          session.sessionId.toLowerCase().includes(searchText.toLowerCase()) ||
          session.positionType
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (session.username &&
            session.username.toLowerCase().includes(searchText.toLowerCase()))),
    )
    .sort((a, b) => {
      if (!sortOrder) return 0;
      const direction = sortOrder === "ascend" ? 1 : -1;

      switch (sortField) {
        case "sessionId":
          return direction * a.sessionId.localeCompare(b.sessionId);
        case "positionType":
          return direction * a.positionType.localeCompare(b.positionType);
        case "username":
          return direction * (a.username || "").localeCompare(b.username || "");
        case "difficulty":
          const difficultyOrder = { 初级: 1, 中级: 2, 高级: 3 };
          return (
            direction *
            ((difficultyOrder[a.difficulty as keyof typeof difficultyOrder] ||
              0) -
              (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] ||
                0))
          );
        case "startTime":
          return (
            direction *
            (new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          );
        case "status":
          const statusOrder = { active: 1, completed: 2, abandoned: 3 };
          return (
            direction *
            ((statusOrder[a.status as keyof typeof statusOrder] || 0) -
              (statusOrder[b.status as keyof typeof statusOrder] || 0))
          );
        case "questionCount":
          return (
            direction * (Number(a.questionCount) - Number(b.questionCount))
          );
        case "duration":
          const aDuration = a.duration !== undefined ? Number(a.duration) : 0;
          const bDuration = b.duration !== undefined ? Number(b.duration) : 0;
          return direction * (aDuration - bDuration);
        default:
          return (
            direction *
            (new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          );
      }
    });

  const positionTypes = [
    ...new Set(sessions.map((session) => session.positionType)),
  ];

  const columns = [
    {
      title: "会话ID",
      dataIndex: "sessionId",
      key: "sessionId",
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }}>{text.slice(0, 8)}...</Text>
      ),
      sorter: true,
      sortOrder: sortField === "sessionId" ? sortOrder : undefined,
    },
    {
      title: "用户",
      dataIndex: "username",
      key: "username",
      render: (text: string, record: SessionType) => (
        <Link href={`/admin/users/${record.userId}`}>
          <Tag icon={<TeamOutlined />} color="purple">
            {text || "未知用户"}
          </Tag>
        </Link>
      ),
      sorter: true,
      sortOrder: sortField === "username" ? sortOrder : undefined,
    },
    {
      title: "职位类型",
      dataIndex: "positionType",
      key: "positionType",
      render: (text: string) => <Tag icon={<UserOutlined />}>{text}</Tag>,
      sorter: true,
      sortOrder: sortField === "positionType" ? sortOrder : undefined,
    },
    {
      title: "难度",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (text: string) => {
        const color =
          text === "初级" ? "green" : text === "中级" ? "blue" : "red";
        return <Tag color={color}>{text}</Tag>;
      },
      sorter: true,
      sortOrder: sortField === "difficulty" ? sortOrder : undefined,
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: true,
      sortOrder: sortField === "startTime" ? sortOrder : undefined,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
      sorter: true,
      sortOrder: sortField === "status" ? sortOrder : undefined,
    },
    {
      title: "问题数",
      dataIndex: "questionCount",
      key: "questionCount",
      render: (text: string, record: SessionType) => (
        <Text>
          {record.answeredCount}/{text}
        </Text>
      ),
      sorter: true,
      sortOrder: sortField === "questionCount" ? sortOrder : undefined,
    },
    {
      title: "持续时间",
      dataIndex: "duration",
      key: "duration",
      render: (text: string) => (text ? `${text} 分钟` : "-"),
      sorter: true,
      sortOrder: sortField === "duration" ? sortOrder : undefined,
    },
    {
      title: "操作",
      key: "action",
      render: (_: string, record: SessionType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.sessionId)}
          >
            详情
          </Button>
          {record.status === "completed" && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleViewResults(record.sessionId)}
            >
              报告
            </Button>
          )}
          <Popconfirm
            title="确定要删除此面试会话吗？"
            description="此操作不可恢复，所有相关数据将被删除。"
            onConfirm={() => handleDelete(record.sessionId)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Space wrap>
            <Input
              placeholder="搜索会话ID、职位或用户"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 120 }}
              placeholder="状态筛选"
            >
              <Option value="all">所有状态</Option>
              <Option value="completed">{getStatusTag("completed")}</Option>
              <Option value="active">{getStatusTag("active")}</Option>
              <Option value="timeout">{getStatusTag("timeout")}</Option>
            </Select>
            <Select
              value={positionFilter}
              onChange={(value) => setPositionFilter(value)}
              style={{ width: 150 }}
              placeholder="职位筛选"
            >
              <Option value="all">所有职位</Option>
              {positionTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <Select
              value={userFilter}
              onChange={(value) => setUserFilter(value)}
              style={{ width: 150 }}
              placeholder="用户筛选"
              allowClear
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Space>

          <Button
            type="primary"
            onClick={fetchSessions}
            loading={loading}
            icon={<ReloadOutlined />}
          >
            刷新数据
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredSessions.map((session) => ({
              ...session,
              key: session.sessionId,
            }))}
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
        </Spin>
      </Card>
    </div>
  );
}
