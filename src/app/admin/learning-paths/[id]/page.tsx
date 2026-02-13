"use client";

import DetailTabs from "@/components/admin/learning-path/DetailTabs";
import interviewAPI from "@/services/api";
import type { LearningPath } from "@/types/learning-path";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  message,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

export default function LearningPathDetailPage() {
  const router = useRouter();

  const params = useParams();
  const id = parseInt(params.id as string);

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLearningPathDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getLearningPathDetail(id);
      setLearningPath(response.data);
    } catch (error) {
      console.error("获取学习路径详情失败:", error);
      message.error("获取学习路径详情失败");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLearningPathDetail();
  }, [fetchLearningPathDetail]);

  const handleDelete = async () => {
    try {
      await interviewAPI.deleteLearningPath(id);
      message.success("学习路径已成功删除");
      router.push("/admin/learning-paths");
    } catch (error) {
      console.error("删除学习路径失败:", error);
      message.error("删除学习路径失败");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!learningPath) {
    return (
      <Card>
        <Title level={4}>学习路径不存在或已被删除</Title>
        <Button
          type="primary"
          onClick={() => router.push("/admin/learning-paths")}
        >
          返回列表
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={learningPath.title}
        extra={
          <Space>
            <Button onClick={() => router.push("/admin/learning-paths")}>
              <ArrowLeftOutlined />
              返回列表
            </Button>
            <Popconfirm
              title="确定要删除这个学习路径吗?"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </Space>
        }
      >
        <Descriptions bordered>
          <Descriptions.Item label="ID">{learningPath.id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(learningPath.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="用户">
            <Link href={`/admin/users/${learningPath.userId}`}>
              <Tag color="blue">{learningPath.username}</Tag>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="描述">
            <Paragraph>{learningPath.description}</Paragraph>
          </Descriptions.Item>
        </Descriptions>

        <DetailTabs learningPath={learningPath} />
      </Card>
    </>
  );
}
