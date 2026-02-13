"use client";

import DetailTabs from "@/components/admin/learning-path/DetailTabs";
import MetaDataTable from "@/components/admin/learning-path/MetaDataTable";
import interviewAPI from "@/services/api";
import { LearningPath } from "@/types/learning-path";
import {
  DeleteOutlined,
  EyeOutlined,
  HistoryOutlined,
  PlusOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Empty,
  List,
  Popconfirm,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const { Text } = Typography;

export default function LearningPathsPage() {
  const router = useRouter();
  const { message: messageApi } = App.useApp();
  const { token } = theme.useToken();

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);
  const [positionTypes, setPositionTypes] = useState<Record<number, string>>(
    {},
  );

  const fetchCreateAbility = useCallback(async () => {
    try {
      const canCreateResponse = await interviewAPI.canCreateLearningPath();
      setCanCreate(canCreateResponse.data.canCreate);
    } catch (err) {
      console.error("获取创建权限失败:", err);
      messageApi.error("获取创建权限失败");
    }
  }, [messageApi]);

  const fetchLearningPaths = useCallback(async () => {
    try {
      const response = await interviewAPI.getUserLearningPaths();
      setLearningPaths(response.data.paths || []);
    } catch (err) {
      console.error("获取学习路径失败:", err);
      messageApi.error("获取学习路径失败");
    }
  }, [messageApi]);

  const fetchPositionTypes = useCallback(async () => {
    try {
      const response = await interviewAPI.getPositionTypes();
      const positionTypesMap: Record<number, string> = {};
      response.data.forEach((pt: { id: number; label: string }) => {
        positionTypesMap[pt.id] = pt.label;
      });
      setPositionTypes(positionTypesMap);
    } catch (err) {
      console.error("获取职位类型失败:", err);
      messageApi.error("获取职位类型失败");
    }
  }, [messageApi]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCreateAbility(),
        fetchLearningPaths(),
        fetchPositionTypes(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [fetchLearningPaths, fetchCreateAbility, fetchPositionTypes]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await interviewAPI.deleteUserLearningPath(id);
        messageApi.success("学习路径已删除");
        fetchLearningPaths();
      } catch (err) {
        console.error("删除学习路径失败:", err);
        messageApi.error("删除学习路径失败");
      }
    },
    [fetchLearningPaths, messageApi],
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "未知时间";
    return new Date(dateString).toLocaleString("zh-CN");
  };

  const renderLatestPath = () => {
    if (learningPaths.length === 0) {
      return (
        <Card>
          <Empty description="暂无学习路径规划" />
        </Card>
      );
    }

    // 排序，获取最新的路径
    const sortedPaths = [...learningPaths].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestPath = sortedPaths[0];

    return (
      <Card
        title={
          <Space>
            <RocketOutlined />
            <span>{latestPath.title}</span>
          </Space>
        }
        extra={
          <Popconfirm
            title="确定要删除这个学习路径吗？"
            key="delete-confirm"
            onConfirm={() => handleDelete(latestPath.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button key="delete" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        }
      >
        <MetaDataTable
          learningPath={latestPath}
          positionTypes={positionTypes}
        />
        <DetailTabs learningPath={latestPath} />
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Text type="secondary">
            创建时间: {formatDate(latestPath.createdAt)}
          </Text>
        </div>
      </Card>
    );
  };

  // 渲染历史学习路径列表
  const renderPathList = useCallback(() => {
    return (
      <List
        loading={loading}
        dataSource={learningPaths}
        bordered
        size="large"
        style={{ backgroundColor: token.colorBgContainer }}
        renderItem={(path) => (
          <List.Item
            key={path.id}
            actions={[
              <Link href={`/profile/learning-paths/${path.id}`} key="view">
                <Button icon={<EyeOutlined />} type="link">
                  查看
                </Button>
              </Link>,
              <Popconfirm
                title="确定要删除这个学习路径吗？"
                key="delete-confirm"
                onConfirm={() => handleDelete(path.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  key="delete"
                  icon={<DeleteOutlined />}
                  danger
                  type="link"
                >
                  删除
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={path.title}
              description={
                <>
                  <Text ellipsis style={{ maxWidth: "100%" }}>
                    {path.description}
                  </Text>
                  <br />
                  <Text type="secondary">
                    创建时间: {formatDate(path.createdAt)}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: <Empty description="暂无学习路径规划" />,
        }}
      />
    );
  }, [handleDelete, learningPaths, loading, token.colorBgContainer]);

  return (
    <Tabs
      defaultActiveKey="latest"
      animated
      size="large"
      items={[
        {
          key: "latest",
          label: "最新",
          children: loading ? <Skeleton active /> : renderLatestPath(),
          animated: true,
          icon: <ThunderboltOutlined />,
        },
        {
          key: "history",
          label: "历史",
          children: renderPathList(),
          disabled: learningPaths.length === 0,
          animated: true,
          icon: <HistoryOutlined />,
        },
      ]}
      tabBarExtraContent={
        <Tooltip
          title={!canCreate ? "无法生成学习路径规划，请先进行面试" : undefined}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/profile/learning-paths/new")}
            disabled={!canCreate}
          >
            创建新的学习路径
          </Button>
        </Tooltip>
      }
    />
  );
}
