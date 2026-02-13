"use client";

import ProgressAnalysis from "@/components/recruiter/ProgressAnalysis";
import { recruiterAPI } from "@/services/api";
import {
  EyeOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const { Paragraph, Text } = Typography;
const { Option } = Select;

interface CandidateDetail {
  id: number;
  username: string;
  email: string | null;
  status: string;
  created_at: string;
  last_login: string | null;
  has_resume: boolean;
  resume_text: string | null;
}

interface PresetOption {
  id: number;
  name: string;
  description: string;
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params?.id as string;
  const { message: messageApi } = App.useApp();
  const { token } = theme.useToken();

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [presets, setPresets] = useState<PresetOption[]>([]);
  const [assignedPresetId, setAssignedPresetId] = useState<number | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchCandidateDetail = useCallback(async () => {
    if (!candidateId) return;

    try {
      setLoading(true);
      const response = await recruiterAPI.getCandidateDetail(
        parseInt(candidateId),
      );
      setCandidate(response.data.candidate);
    } catch (error) {
      console.error("获取求职者详情失败:", error);
      messageApi.error("获取求职者详情失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [candidateId, messageApi]);

  const fetchPresets = useCallback(async () => {
    try {
      const response = await recruiterAPI.getRecruiterPresets();
      setPresets(response.data.presets || []);
    } catch (error) {
      console.error("获取预设场景失败:", error);
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await recruiterAPI.getCandidateAssignments();
      const assignments = response.data.assignments || [];
      const currentAssignment = assignments.find(
        (assignment: any) => assignment.candidate_id === parseInt(candidateId),
      );
      if (currentAssignment) {
        setAssignedPresetId(currentAssignment.preset_id);
      }
    } catch (error) {
      console.error("获取预设分配情况失败:", error);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCandidateDetail();
    fetchPresets();
    fetchAssignments();
  }, [fetchAssignments, fetchCandidateDetail, fetchPresets]);

  const handleAssignPreset = useCallback(
    async (presetId: number | null) => {
      if (!candidateId) return;

      try {
        setAssignLoading(true);

        await recruiterAPI.assignPresetToCandidate({
          candidate_id: parseInt(candidateId),
          preset_id: presetId,
        });

        if (presetId) {
          messageApi.success("预设场景分配成功！");
        } else {
          messageApi.info("预设场景分配已取消！");
        }

        setAssignedPresetId(presetId);
      } catch (error) {
        console.error("分配预设场景失败:", error);
        if (presetId) {
          messageApi.error("分配预设场景失败");
        } else {
          messageApi.error("取消分配失败");
        }
      } finally {
        setAssignLoading(false);
      }
    },
    [candidateId, messageApi],
  );

  return (
    <Row gutter={[24, 24]} style={{ padding: "0 24px" }}>
      <Col
        xs={24}
        md={8}
        style={{
          gap: 18,
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Row>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserOutlined style={{ marginRight: 8 }} />
                基本信息
              </div>
            }
            extra={
              <Button
                type="primary"
                onClick={() =>
                  router.push(`/recruiter/candidates/${candidateId}/sessions`)
                }
                icon={<EyeOutlined />}
              >
                查看面试记录
              </Button>
            }
          >
            <Spin spinning={loading}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="用户名">
                  {candidate?.username}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {candidate?.email || (
                    <span style={{ color: "#999" }}>未设置</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="账户状态">
                  {candidate?.status === "active" ? (
                    <Tag color="green">启用</Tag>
                  ) : (
                    <Tag color="red">停用</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="简历状态">
                  {candidate?.has_resume ? (
                    <Tag color="blue" icon={<FileTextOutlined />}>
                      已上传简历
                    </Tag>
                  ) : (
                    <Tag color="orange">未上传简历</Tag>
                  )}
                </Descriptions.Item>
                {candidate?.created_at && (
                  <Descriptions.Item label="注册时间">
                    {new Date(candidate.created_at).toLocaleString()}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="上次登录">
                  {candidate?.last_login ? (
                    new Date(candidate.last_login).toLocaleString()
                  ) : (
                    <span style={{ color: "#999" }}>从未登录</span>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Spin>
          </Card>
        </Row>

        <Row>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <SettingOutlined style={{ marginRight: 8 }} />
                面试预设场景分配
              </div>
            }
          >
            <Spin spinning={loading}>
              <Text type="secondary">
                为该求职者分配预设的面试场景，求职者在面试设置页面可以选择使用您分配的预设场景。
              </Text>
              <div>
                <Text strong>当前分配的预设场景：</Text>
                <Select
                  style={{ width: 280 }}
                  placeholder="暂未分配预设场景"
                  value={assignedPresetId}
                  onChange={handleAssignPreset}
                  loading={assignLoading}
                  allowClear
                >
                  {presets.map((preset) => (
                    <Option key={preset.id} value={preset.id}>
                      {preset.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Spin>
          </Card>
        </Row>

        {candidate?.resume_text && (
          <Row>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  简历内容
                </div>
              }
              style={{ width: "100%" }}
            >
              <Paragraph
                style={{
                  background: token.colorBgContainerDisabled,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: "6px",
                  padding: "16px",
                  maxHeight: "600px",
                  overflow: "auto",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  width: "100%",
                }}
              >
                {candidate?.resume_text}
              </Paragraph>
            </Card>
          </Row>
        )}
      </Col>

      <Col xs={24} md={16}>
        <ProgressAnalysis userId={candidate?.id.toString()} />
      </Col>
    </Row>
  );
}
