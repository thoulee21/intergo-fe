"use client";

import { authAPI, recruiterAPI } from "@/services/api";
import {
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Badge,
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const { Text } = Typography;

interface Candidate {
  id: number;
  username: string;
  email: string | null;
  status: string;
  created_at: string;
  last_login: string | null;
  has_resume: boolean;
}

export default function CandidatesPage() {
  const router = useRouter();
  const { message: messageApi } = App.useApp();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.getInvitedCandidates();
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("获取受邀求职者列表失败:", error);
      messageApi.error("获取受邀求职者列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filteredCandidates = candidates.filter(
    (candidate) =>
      searchText === "" ||
      candidate.username.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleViewDetail = useCallback(
    (candidateId: number) => {
      router.push(`/recruiter/candidates/${candidateId}`);
    },
    [router],
  );

  const handleViewSessions = useCallback(
    (candidateId: number) => {
      router.push(`/recruiter/candidates/${candidateId}/sessions`);
    },
    [router],
  );

  const handleRemoveCandidate = useCallback(
    async (candidateId: number, candidateName: string) => {
      try {
        await recruiterAPI.removeCandidate(candidateId);
        messageApi.success(`已成功移除候选人 ${candidateName}`);

        fetchCandidates();
      } catch (error) {
        console.error("移除候选人失败:", error);
        messageApi.error("移除候选人失败，请稍后重试");
      }
    },
    [fetchCandidates, messageApi],
  );

  const columns: ColumnsType<Candidate> = useMemo(
    () => [
      {
        title: "用户名",
        dataIndex: "username",
        key: "username",
        sorter: (a, b) => a.username.localeCompare(b.username),
        render: (username: string, record) => (
          <Tag
            icon={<UserOutlined />}
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={() => handleViewDetail(record.id)}
          >
            {username}
          </Tag>
        ),
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        render: (email: string | undefined) =>
          email ? (
            <Link href={`mailto:${email}`}>{email}</Link>
          ) : (
            <Text type="secondary">未设置</Text>
          ),
      },
      {
        title: "简历状态",
        dataIndex: "has_resume",
        key: "has_resume",
        render: (hasResume: boolean) =>
          hasResume ? (
            <Tag color="green" icon={<FileTextOutlined />}>
              已上传
            </Tag>
          ) : (
            <Tag color="orange">未上传</Tag>
          ),
      },
      {
        title: "账户状态",
        dataIndex: "status",
        key: "status",
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
        sorter: (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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
        sorter: (a, b) => {
          const aTime = a.last_login ? new Date(a.last_login).getTime() : 0;
          const bTime = b.last_login ? new Date(b.last_login).getTime() : 0;
          return aTime - bTime;
        },
      },
      {
        title: "操作",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewSessions(record.id)}
            >
              面试记录
            </Button>
            <Popconfirm
              title="确定要移除此候选人吗？"
              description={`移除候选人 ${record.username} 后，将删除邀请关系和预设分配。`}
              onConfirm={() =>
                handleRemoveCandidate(record.id, record.username)
              }
              okText="确定"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                移除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleRemoveCandidate, handleViewDetail, handleViewSessions],
  );

  return (
    <div style={{ padding: "0 24px" }}>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        这里显示通过您的邀请码注册的求职者列表，您可以查看他们的面试记录。
      </Text>
      <Card style={{ marginBottom: 20 }}>
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Input
            placeholder="搜索用户名或邮箱"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />

          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchCandidates}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredCandidates.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 位受邀求职者`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="暂无受邀求职者"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
}
