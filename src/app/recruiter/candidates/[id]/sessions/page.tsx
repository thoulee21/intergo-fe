"use client";

import getStatusTag from "@/components/shared/sessions/getStatusTag";
import { useFetchCandidateSessions } from "@/hooks/useCandidateSessions";
import type { InterviewSessionWithDuration } from "@/types/recruiter/candidates";
import {
  EyeOutlined,
  FundViewOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

const { Text } = Typography;

export default function CandidateSessionsPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params?.id as string;

  const { sessions, loading, fetchCandidateSessions } =
    useFetchCandidateSessions(candidateId);

  const handleViewAnalysis = useCallback(
    (sessionId: string) => {
      router.push(`/recruiter/sessions/${sessionId}/analysis`);
    },
    [router],
  );

  const getDifficultyTag = useCallback((difficulty: string) => {
    const colorMap: Record<string, string> = {
      初级: "green",
      中级: "orange",
      高级: "red",
    };
    return <Tag color={colorMap[difficulty] || "default"}>{difficulty}</Tag>;
  }, []);

  // 表格列定义
  const columns: ColumnsType<InterviewSessionWithDuration> = useMemo(
    () => [
      {
        title: "职位类型",
        dataIndex: "position_type",
        key: "position_type",
        render: (type: string) => <Tag color="blue">{type}</Tag>,
      },
      {
        title: "难度",
        dataIndex: "difficulty",
        key: "difficulty",
        render: getDifficultyTag,
      },
      {
        title: "开始时间",
        dataIndex: "start_time",
        key: "start_time",
        render: (time: string) => new Date(time).toLocaleString(),
        sorter: (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      },
      {
        title: "耗时",
        dataIndex: "duration",
        key: "duration",
        render: (duration?: number) =>
          duration ? `${duration} 分钟` : <Text type="secondary">-</Text>,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: getStatusTag,
      },
      {
        title: "操作",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<FundViewOutlined />}
              onClick={() => handleViewAnalysis(record.session_id)}
            >
              查看分析
            </Button>
            {record.status === "completed" && (
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => router.push(`/results/${record.session_id}`)}
              >
                查看结果
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [getDifficultyTag, handleViewAnalysis, router],
  );

  return (
    <Card
      title={
        <div>
          <FundViewOutlined style={{ marginRight: 8 }} />
          面试会话记录
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchCandidateSessions}
          loading={loading}
        >
          刷新
        </Button>
      }
      style={{ margin: "24px" }}
    >
      <Table
        columns={columns}
        dataSource={sessions}
        rowKey="session_id"
        loading={loading}
        pagination={{
          total: sessions.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
        }}
        locale={{
          emptyText: (
            <Empty
              description="该求职者还没有进行过面试"
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            />
          ),
        }}
      />
    </Card>
  );
}
