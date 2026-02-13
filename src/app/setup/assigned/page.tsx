"use client";

import InterviewParamsTags from "@/components/setup/InterviewParamsTags";
import InterviewBreadcrumb from "@/components/shared/InterviewBreadcrumb";
import { useAppDispatch } from "@/redux/hooks";
import { setInitials } from "@/redux/slices/interviewSlice";
import { interviewAPI } from "@/services/api";
import {
  CaretUpOutlined,
  CheckCircleFilled,
  RocketOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Spin,
  Tag,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

interface AssignedPreset {
  id: number;
  name: string;
  description: string;
  recruiterName: string;
  interviewParams: any;
  createdAt: string;
}

export default function AssignedPresetsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [assignedPresets, setAssignedPresets] = useState<AssignedPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<AssignedPreset | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const assignedPresetsResponse = await interviewAPI.getAssignedPresets();
        const presets = assignedPresetsResponse.data?.assigned_presets || [];
        setAssignedPresets(presets);

        setSelectedPreset(presets.length > 0 ? presets[0] : null);
        form.setFieldsValue({
          presetId: presets.length > 0 ? presets[0].id : null,
        });

        if (presets.length === 0) {
          messageApi.info("您没有分配的预设场景，将为您跳转到手动设置页面");
          setTimeout(() => {
            router.replace("/setup/manual");
          }, 2000);
        }
      } catch (error) {
        console.error("获取分配预设失败:", error);
        messageApi.error("获取数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, messageApi, router]);

  const handleSelectPreset = (preset: AssignedPreset) => {
    setSelectedPreset(preset);
    form.setFieldsValue({ presetId: preset.id });
  };

  const handleSubmit = async () => {
    if (!selectedPreset) {
      messageApi.warning("请选择一个预设场景");
      return;
    }

    try {
      setLoading(true);

      const interviewData = {
        ...selectedPreset,
        ...selectedPreset.interviewParams,
      };

      const response = await interviewAPI.startInterview(interviewData);

      const sessionId = response.data.sessionId;
      const firstQuestion = response.data.question;

      messageApi.success("面试会话已创建，即将开始面试");

      const questionCount = selectedPreset?.interviewParams?.questionCount || 2;

      dispatch(
        setInitials({
          initialQuestion: firstQuestion,
          questionCount: questionCount,
          avatarContent: response.data.avatarContent,
        }),
      );

      router.push(`/interview/${sessionId}`);
    } catch (error) {
      console.error("创建面试会话失败:", error);
      messageApi.error("创建面试会话失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSetup = () => {
    router.push("/setup/manual");
  };

  return (
    <div>
      <InterviewBreadcrumb currentStep="setup" />
      <Title level={2} className="text-center">
        <RocketOutlined /> 您的专属面试场景
      </Title>
      <Paragraph className="text-center">
        招聘官为您准备了定制化的面试场景，您也可以选择手动配置面试参数
      </Paragraph>

      <Card style={{ maxWidth: "800px", margin: "0 auto", marginTop: "32px" }}>
        <Spin spinning={loading}>
          {assignedPresets.length === 0 && !loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Alert
                title="暂无分配的预设场景"
                description="您目前没有招聘官分配的面试场景，将为您跳转到手动设置页面"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </div>
          ) : (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Alert
                title="选择您的面试场景"
                description="以下是招聘官为您准备的面试场景，请选择一个开始面试。如果您想手动配置面试参数，可以点击右侧的按钮。"
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
                action={
                  <Button onClick={handleManualSetup} size="small">
                    手动配置面试
                  </Button>
                }
              />

              <Form.Item
                label="分配的预设场景"
                name="presetId"
                rules={[{ required: true, message: "请选择一个预设场景" }]}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {assignedPresets.map((preset) => (
                    <Card
                      key={preset.id}
                      style={{
                        marginBottom: "16px",
                        cursor: "pointer",
                        border:
                          selectedPreset?.id === preset.id
                            ? `2px solid ${token.colorPrimary}`
                            : `2px solid transparent`,
                        boxShadow:
                          selectedPreset?.id === preset.id
                            ? "0 0 10px rgba(24, 144, 255, 0.3)"
                            : undefined,
                      }}
                      variant="borderless"
                      type="inner"
                      size="small"
                      title={preset.name}
                      onClick={() => handleSelectPreset(preset)}
                      extra={
                        <div style={{ fontSize: "12px", color: "#999" }}>
                          来自招聘官：
                          <Tag color="purple" style={{ fontSize: "12px" }}>
                            {preset.recruiterName}
                          </Tag>
                        </div>
                      }
                    >
                      <InterviewParamsTags
                        interviewParams={preset.interviewParams}
                      />
                      <Card.Meta
                        description={preset.description}
                        avatar={
                          preset.description &&
                          (selectedPreset?.id === preset.id ? (
                            <CheckCircleFilled
                              style={{ color: token.colorSuccess }}
                            />
                          ) : (
                            <CaretUpOutlined
                              style={{ color: token.colorTextSecondary }}
                            />
                          ))
                        }
                      />
                    </Card>
                  ))}
                </div>
              </Form.Item>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!selectedPreset}
                >
                  开始面试
                </Button>
              </div>
            </Form>
          )}
        </Spin>
      </Card>
    </div>
  );
}
