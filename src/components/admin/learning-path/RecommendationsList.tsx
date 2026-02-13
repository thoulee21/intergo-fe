import type { LearningPath } from "@/types/learning-path";
import { CopyOutlined } from "@ant-design/icons";
import { App, Avatar, Button, List, Typography } from "antd";

export default function RecommendationsList({
  learningPath,
}: {
  learningPath: LearningPath;
}) {
  const { message: messageApi } = App.useApp();
  return (
    <List
      bordered
      size="large"
      dataSource={learningPath.recommendations}
      renderItem={(item, index) => (
        <List.Item
          key={index}
          actions={[
            <Button
              type="text"
              icon={<CopyOutlined />}
              key={index}
              onClick={async () => {
                await navigator.clipboard.writeText(item);
                messageApi.success("已复制到剪贴板");
              }}
            />,
          ]}
          style={{ fontWeight: "normal" }}
        >
          <Avatar
            shape="square"
            size="small"
            style={{ backgroundColor: "#87d068", marginRight: 16 }}
          >
            {index + 1}
          </Avatar>
          <Typography.Text style={{ flex: 1 }}>{item}</Typography.Text>
        </List.Item>
      )}
    />
  );
}
