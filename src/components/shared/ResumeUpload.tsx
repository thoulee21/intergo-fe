"use client";

import { interviewAPI } from "@/services/api";
import type { UserProfile } from "@/types";
import {
  DeleteOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { App, Button, Card, Progress, Space, Typography, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { useCallback, useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface ResumeUploadProps {
  onUploadSuccess?: (resumeLength: number) => void;
  onUploadError?: (error: string) => void;
  style?: React.CSSProperties;
  user?: UserProfile | null;
  onResumeUpdate?: () => void;
}

const { useApp } = App;

export default function ResumeUpload({
  onUploadSuccess,
  onUploadError,
  user,
  onResumeUpdate,
}: ResumeUploadProps) {
  const { message } = useApp();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resumeLength, setResumeLength] = useState<number | null>(null);

  useEffect(() => {
    if (user?.has_resume && user?.resume_text) {
      setUploadSuccess(true);
      setResumeLength(user.resume_text.length);
    }
  }, [user]);

  const uploadProps: UploadProps = useMemo(
    () => ({
      name: "resume",
      multiple: false,
      accept: ".pdf,.docx",
      fileList,
      disabled: uploading,
      showUploadList: {
        showDownloadIcon: false,
        showRemoveIcon: !uploading && !uploadSuccess,
      },

      beforeUpload: (file: RcFile) => {
        const isValidType =
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        if (!isValidType) {
          message.error("只支持 PDF 和 DOCX 格式的文件！");
          return false;
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          message.error("文件大小不能超过 10MB！");
          return false;
        }

        return true;
      },

      customRequest: async ({ file, onSuccess, onError }) => {
        try {
          setUploading(true);
          setUploadProgress(0);
          setUploadSuccess(false);

          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 850);

          const response = await interviewAPI.uploadResume(file as File);

          clearInterval(progressInterval);
          setUploadProgress(100);

          if (response.data.status === "success") {
            setUploadSuccess(true);
            setResumeLength(response.data.resume_length || 0);
            message.success("简历上传成功！");

            if (onUploadSuccess) {
              onUploadSuccess(response.data.resume_length || 0);
            }

            if (onResumeUpdate) {
              onResumeUpdate();
            }

            if (onSuccess) {
              onSuccess(response.data);
            }
          } else {
            throw new Error(response.data.message || "上传失败");
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "上传失败，请重试";
          message.error(errorMessage);

          if (onUploadError) {
            onUploadError(errorMessage);
          }

          if (onError) {
            onError(error);
          }
        } finally {
          setUploading(false);
        }
      },

      onChange(info) {
        setFileList(info.fileList.slice(-1)); 

        if (info.file.status === "removed") {
          setUploadSuccess(false);
          setResumeLength(null);
          setUploadProgress(0);
        }
      },
    }),
    [
      uploading,
      fileList,
      uploadSuccess,
      message,
      onUploadSuccess,
      onUploadError,
      onResumeUpdate,
    ],
  );

  const handleRetry = useCallback(() => {
    setFileList([]);
    setUploadSuccess(false);
    setResumeLength(null);
    setUploadProgress(0);
  }, []);

  const handleDeleteResume = useCallback(async () => {
    try {
      const response = await interviewAPI.deleteResume();

      if (response.data.status === "success") {
        setUploadSuccess(false);
        setResumeLength(null);
        setFileList([]);
        message.success("简历删除成功！");

        if (onResumeUpdate) {
          onResumeUpdate();
        }
      } else {
        throw new Error(response.data.message || "删除失败");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "删除失败，请重试";
      message.error(errorMessage);

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  }, [message, onUploadError, onResumeUpdate]);

  return (
    <>
      {!uploadSuccess ? (
        <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 PDF 和 DOCX 格式，文件大小不超过 10MB
          </p>
        </Dragger>
      ) : (
        <Card
          style={{ textAlign: "center" }}
          styles={{ body: { padding: "24px" } }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <FileTextOutlined style={{ fontSize: 48, color: "#52c41a" }} />
            <Title level={5} style={{ margin: 0 }}>
              简历已上传
            </Title>
            <Text type="secondary">已解析 {resumeLength} 个字符的简历内容</Text>
            <Space>
              <Button onClick={handleRetry} type="primary">
                重新上传
              </Button>
              <Button
                onClick={handleDeleteResume}
                danger
                icon={<DeleteOutlined />}
              >
                删除简历
              </Button>
            </Space>
          </Space>
        </Card>
      )}

      {uploading && (
        <div style={{ marginTop: 16 }}>
          <Progress percent={uploadProgress} status="active" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            正在上传并解析简历内容...
          </Text>
        </div>
      )}
    </>
  );
}
