"use client";

import MetaDataTable from "@/components/admin/learning-path/MetaDataTable";
import RecommendationsList from "@/components/admin/learning-path/RecommendationsList";
import interviewAPI from "@/services/api";
import { LearningPath } from "@/types/learning-path";
import {
  ArrowLeftOutlined,
  BookOutlined,
  DeleteOutlined,
  ToolOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  List,
  Popconfirm,
  Result,
  Row,
  Skeleton,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Text, Paragraph } = Typography;

export default function LearningPathDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathId = Number(params.id);
  const { message: messageApi } = App.useApp();

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [positionTypes, setPositionTypes] = useState<Record<number, string>>(
    {},
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [positionTypesResponse, pathResponse] = await Promise.all([
          interviewAPI.getPositionTypes(),
          pathId ? interviewAPI.getUserLearningPathDetail(pathId) : null,
        ]);

        const posTypesMap: Record<number, string> = {};
        if (
          positionTypesResponse.data &&
          Array.isArray(positionTypesResponse.data)
        ) {
          positionTypesResponse.data.forEach(
            (pt: { id: number; label: string }) => {
              posTypesMap[pt.id] = pt.label;
            },
          );
        }
        setPositionTypes(posTypesMap);

        if (pathResponse) {
          setLearningPath(pathResponse.data);
        }
      } catch (err) {
        console.error("获取数据失败:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, messageApi, pathId]);

  const handleDelete = async () => {
    try {
      await interviewAPI.deleteUserLearningPath(pathId);
      messageApi.success("学习路径已删除");
      router.push("/profile/learning-paths");
    } catch (err) {
      console.error("删除学习路径失败:", err);
      messageApi.error("删除学习路径失败");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "未知时间";
    return new Date(dateString).toLocaleString("zh-CN");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "高":
      case "high":
        return "red";
      case "中":
      case "medium":
        return "orange";
      case "低":
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const getTimelineColor = (timeline: string) => {
    switch (timeline.toLowerCase()) {
      case "短期":
      case "short":
      case "short-term":
        return "green";

      case "中期":
      case "medium":
      case "medium-term":
        return "blue";

      case "长期":
      case "long":
      case "long-term":
        return "purple";

      default:
        if (timeline.includes("短期")) {
          return "green";
        }
        if (timeline.includes("中期")) {
          return "blue";
        }
        if (timeline.includes("长期")) {
          return "purple";
        }
        return "default";
    }
  };

  if (loading) {
    return <Skeleton active />;
  }

  if (!learningPath) {
    return (
      <Result
        status="404"
        title="获取学习路径详情失败"
        subTitle="学习路径不存在"
        extra={
          <Button
            type="primary"
            onClick={() => router.push("/profile/learning-paths")}
          >
            返回列表
          </Button>
        }
      />
    );
  }

  return (
    <Card
      title={
        <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
          <Space>
            <BookOutlined />
            <span>{learningPath.title}</span>
          </Space>
          <Paragraph type="secondary">
            创建时间: {formatDate(learningPath.createdAt)}
          </Paragraph>
        </Space>
      }
      extra={
        <Space>
          <Button onClick={() => router.push("/profile/learning-paths")}>
            <ArrowLeftOutlined />
            返回列表
          </Button>
          <Popconfirm
            title="确定要删除这个学习路径吗?"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <MetaDataTable
        learningPath={learningPath}
        positionTypes={positionTypes}
      />
      <Divider orientation="horizontal">
        <Space>
          <BookOutlined />
          <span>具体建议</span>
        </Space>
      </Divider>
      <RecommendationsList learningPath={learningPath} />
      <Row gutter={24}>
        <Col span={12}>
          <Divider orientation="horizontal">
            <Space>
              <ToolOutlined />
              <span>需要提升的技能</span>
            </Space>
          </Divider>

          <Card variant="outlined">
            <List
              dataSource={learningPath.skillsToImprove}
              renderItem={(skill) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space>
                      <Text strong>{skill.name}</Text>
                      <Tag color={getPriorityColor(skill.priority)}>
                        优先级: {skill.priority}
                      </Tag>
                    </Space>
                    <Paragraph>{skill.reason}</Paragraph>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Divider orientation="horizontal">
            <Space>
              <TrophyOutlined />
              <span>职业目标</span>
            </Space>
          </Divider>

          <Card variant="outlined" size="small">
            <Timeline
              items={learningPath.careerGoals.map((goal, goalIndex) => ({
                key: goalIndex,
                color: getTimelineColor(goal.timeline),
                children: (
                  <Card
                    size="small"
                    variant="borderless"
                    title={
                      <Space>
                        <Text strong>{goal.goal}</Text>
                        <Tag color={getTimelineColor(goal.timeline)}>
                          {goal.timeline}
                        </Tag>
                      </Space>
                    }
                  >
                    <Timeline
                      items={goal.steps.map((step, stepIndex) => ({
                        key: stepIndex,
                        children: step,
                      }))}
                    />
                  </Card>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
