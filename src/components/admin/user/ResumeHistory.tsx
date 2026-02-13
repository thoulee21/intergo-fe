"use client";

import { interviewAPI } from "@/services/api";
import type { ResumeBackup, UserProfile } from "@/types";
import {
  CloudDownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { App, Button, Empty, List, Modal, Space, Spin, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";

const { Text } = Typography;

interface ResumeHistoryProps {
  user: UserProfile;
}

const { useApp } = App;

export default function ResumeHistory({ user }: ResumeHistoryProps) {
  const { message: messageApi } = useApp();
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<ResumeBackup[]>([]);
  const [visible, setVisible] = useState(false);

  const fetchResumeBackups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUserResumeBackups(
        user.id.toString(),
      );

      if (response.data.backups) {
        setBackups(response.data.backups);
      }
    } catch (error: any) {
      console.error("获取简历备份失败:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "获取简历备份失败";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user.id, messageApi]);

  useEffect(() => {
    if (visible) {
      fetchResumeBackups();
    }
  }, [fetchResumeBackups, visible]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  const getFileExtension = useCallback((filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext || "";
  }, []);

  const handleDownload = useCallback(
    async (backup: ResumeBackup) => {
      try {
        messageApi.loading("正在下载文件...");
        const response = await interviewAPI.downloadUserResumeBackup(
          user.id.toString(),
          backup.name,
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        const fileName = backup.name.split("/").pop() || backup.name;
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        messageApi.success("文件下载成功");
      } catch (error: any) {
        console.error("下载文件失败:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "下载文件失败";
        messageApi.error(errorMessage);
      }
    },
    [user.id, messageApi],
  );

  return (
    <>
      <Button
        icon={<HistoryOutlined />}
        onClick={() => setVisible(true)}
        size="small"
      >
        查看简历历史
      </Button>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <HistoryOutlined style={{ marginRight: 8 }} />
            {user.username} 的简历历史
          </div>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        <Spin spinning={loading}>
          {backups.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无简历备份记录"
            />
          ) : (
            <List
              dataSource={backups}
              renderItem={(backup) => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      type="link"
                      icon={<CloudDownloadOutlined />}
                      onClick={() => handleDownload(backup)}
                    >
                      下载
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      getFileExtension(backup.name) === "pdf" ? (
                        <FilePdfOutlined
                          style={{ fontSize: 24, color: "#ff4d4f" }}
                        />
                      ) : (
                        <FileWordOutlined
                          style={{ fontSize: 24, color: "#1890ff" }}
                        />
                      )
                    }
                    title={backup.name}
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary">
                          文件大小：{formatFileSize(backup.size)}
                        </Text>
                        <Text type="secondary">
                          最后修改时间：{formatTime(backup.last_modified)}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Modal>
    </>
  );
}
