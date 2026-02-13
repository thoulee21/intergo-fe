import ResumeHistory from "@/components/admin/user/ResumeHistory";
import interviewAPI from "@/services/api";
import type { UserProfile } from "@/types";
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { App, Button, Card, Empty, Space, Typography, theme } from "antd";

const { useApp } = App;

export default function ResumeManagement({
  user,
  fetchUserDetail,
}: {
  user: UserProfile | null;
  fetchUserDetail: () => Promise<void>;
}) {
  const { message: messageApi, modal } = useApp();
  const { token } = theme.useToken();

  const handleDeleteResume = async () => {
    if (!user || !user.has_resume) {
      messageApi.warning("该用户没有上传简历");
      return;
    }

    modal.confirm({
      title: "确认删除简历",
      content: `确定要删除用户 ${user.username} 的简历吗？此操作不可恢复。`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        try {
          const response = await interviewAPI.deleteUserResume(
            user.id.toString(),
          );

          if (response.data.message) {
            messageApi.success("简历删除成功");

            fetchUserDetail();
          } else {
            throw new Error("删除失败");
          }
        } catch (error: any) {
          console.error("删除简历失败:", error);
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "删除简历失败，请重试";
          messageApi.error(errorMessage);
        }
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          简历管理
        </div>
      }
      extra={
        <Space>
          <ResumeHistory user={user} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteResume}
            size="small"
            disabled={!user.has_resume}
          >
            删除简历
          </Button>
        </Space>
      }
      type="inner"
      style={{ marginBottom: 16 }}
    >
      {user.resume_text ? (
        <Typography.Paragraph
          style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: "6px",
            padding: "12px",
            maxHeight: "400px",
            overflow: "auto",
            fontSize: "14px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
          }}
          ellipsis
        >
          {user.resume_text}
        </Typography.Paragraph>
      ) : (
        <Empty
          description="暂无用户简历信息"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
}
