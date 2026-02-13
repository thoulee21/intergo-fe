import type { UserProfile, UserType } from "@/types";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Typography } from "antd";

const { Title, Text } = Typography;

export const userTypeMap: Record<UserType, string> = {
  candidate: "求职者",
  recruiter: "招聘者",
};

export default function Header({ user }: { user: UserProfile }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <Avatar
        size={80}
        icon={<UserOutlined />}
        style={{ backgroundColor: "#1677ff", marginBottom: 16 }}
      />
      <Title level={4}>{user.username}</Title>
      <Text type="secondary">{userTypeMap[user.user_type]}</Text>
    </div>
  );
}
