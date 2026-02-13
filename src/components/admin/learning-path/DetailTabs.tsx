import RecommendationsList from "@/components/admin/learning-path/RecommendationsList";
import type { LearningPath } from "@/types/learning-path";
import { Collapse, List, Space, Tabs, Tag, Typography } from "antd";
import { useCallback, useMemo } from "react";

const { Text, Paragraph } = Typography;

export default function DetailTabs({
  learningPath,
}: {
  learningPath: LearningPath;
}) {
  const getTimelineColor = useCallback((timeline: string) => {
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
  }, []);

  const items = useMemo(() => {
    const priorityColors = {
      高: "red",
      中: "orange",
      低: "green",
    };

    return [
      {
        key: "0",
        label: "建议",
        children: <RecommendationsList learningPath={learningPath} />,
      },
      {
        key: "1",
        label: "技能提升",
        children: (
          <List
            itemLayout="vertical"
            dataSource={learningPath.skillsToImprove || []}
            bordered
            renderItem={(skill) => (
              <List.Item
                extra={
                  <Tag
                    color={
                      priorityColors[
                        skill.priority as keyof typeof priorityColors
                      ] || "blue"
                    }
                  >
                    优先级: {skill.priority}
                  </Tag>
                }
              >
                <List.Item.Meta title={skill.name} description={skill.reason} />
              </List.Item>
            )}
          />
        ),
      },
      {
        key: "2",
        label: "职业目标",
        children: (
          <Collapse
            defaultActiveKey={["0", "1"]}
            items={learningPath.careerGoals.map((goal, index) => ({
              key: index.toString(),
              label: (
                <Space>
                  <Tag color={getTimelineColor(goal.timeline)}>
                    {goal.timeline}
                  </Tag>
                  <Text strong>{goal.goal}</Text>
                </Space>
              ),
              children: (
                <List
                  dataSource={goal.steps}
                  renderItem={(step, i) => (
                    <Paragraph>
                      {i + 1}. {step}
                    </Paragraph>
                  )}
                />
              ),
            }))}
          />
        ),
      },
    ];
  }, [getTimelineColor, learningPath]);

  return <Tabs defaultActiveKey="2" style={{ marginTop: 6 }} items={items} />;
}
