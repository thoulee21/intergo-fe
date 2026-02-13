import type { LearningPath } from "@/types/learning-path";
import { Descriptions, Space, Tag, Typography } from "antd";

const { Text } = Typography;

export default function MetaDataTable({
  learningPath,
  positionTypes,
}: {
  learningPath: LearningPath;
  positionTypes: Record<number, string>;
}) {
  return (
    <Descriptions bordered column={1} size="small">
      <Descriptions.Item label="描述">
        {learningPath.description}
      </Descriptions.Item>

      <Descriptions.Item label="感兴趣的职位类型">
        <Space wrap>
          {learningPath.interestedPositionTypes &&
            learningPath.interestedPositionTypes.map((typeId) => (
              <Tag color="blue" key={typeId}>
                {positionTypes[typeId] || `职位类型${typeId}`}
              </Tag>
            ))}
          {(!learningPath.interestedPositionTypes ||
            learningPath.interestedPositionTypes.length === 0) && (
            <Text type="secondary">未设置感兴趣的职位类型</Text>
          )}
        </Space>
      </Descriptions.Item>
    </Descriptions>
  );
}
