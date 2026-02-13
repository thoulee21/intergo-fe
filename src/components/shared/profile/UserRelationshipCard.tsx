import type { UserProfile } from "@/types";
import {
  CodeOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Space, Tag, Typography } from "antd";

interface UserRelationshipCardProps {
  user: UserProfile;
}

export default function UserRelationshipCard({
  user,
}: UserRelationshipCardProps) {
  return (
    <Card
      title={
        <Space>
          <CodeOutlined />
          关系信息
        </Space>
      }
    >
      <Descriptions size="small" column={1}>
        {/* 显示邀请码 */}
        <Descriptions.Item label="邀请码">
          {user.invitation_code ? (
            <Tag color="blue">
              <Typography.Text
                copyable={{ text: user.invitation_code }}
                style={{ fontSize: 12 }}
              >
                {user.invitation_code}
              </Typography.Text>
            </Tag>
          ) : (
            <Typography.Text type="secondary">未设置</Typography.Text>
          )}
        </Descriptions.Item>

        {/* 如果是候选人，显示招聘者信息 */}
        {user.user_type === "candidate" && user.recruiter_info && (
          <>
            <Descriptions.Item label="招聘者">
              <Tag color="purple" icon={<TeamOutlined />}>
                {user.recruiter_info.username}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="分配的面试场景">
              {user.assigned_preset ? (
                <Tag color="green" icon={<SettingOutlined />}>
                  {user.assigned_preset.name}
                </Tag>
              ) : (
                <Typography.Text type="secondary">未分配</Typography.Text>
              )}
            </Descriptions.Item>
          </>
        )}

        {}
        {user.user_type === "recruiter" &&
          user.invited_candidates_count !== undefined && (
            <Descriptions.Item label="邀请的候选人">
              <Tag color="orange" icon={<UserOutlined />}>
                {user.invited_candidates_count} 人
              </Tag>
            </Descriptions.Item>
          )}

        {}
        {user.user_type === "recruiter" && !user.invitation_code && (
          <Descriptions.Item label="状态">
            <Typography.Text type="warning">尚未生成邀请码</Typography.Text>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}
