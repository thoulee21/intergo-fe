import { Badge } from "antd";

const getStatusTag = (status: "completed" | "active" | string) => {
  switch (status) {
    case "completed":
      return <Badge status="success" text="已完成" />;
    case "active":
      return <Badge status="processing" text="进行中" />;
    case "timeout":
      return <Badge status="warning" text="已放弃" />;
    default:
      return <Badge status="default" text={status} />;
  }
};

export default getStatusTag;
