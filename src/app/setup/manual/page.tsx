"use client";

import InterviewParamsTags from "@/components/setup/InterviewParamsTags";
import InterviewBreadcrumb from "@/components/shared/InterviewBreadcrumb";
import ResumeUpload from "@/components/shared/ResumeUpload";
import { useAppDispatch } from "@/redux/hooks";
import { setInitials } from "@/redux/slices/interviewSlice";
import { authAPI, interviewAPI } from "@/services/api";
import type { PositionType, UserProfile } from "@/types";
import {
  CaretUpOutlined,
  CheckCircleFilled,
  RightOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Radio,
  Select,
  Slider,
  Spin,
  Steps,
  Switch,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "../setup.css";

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface InterviewPreset {
  id: number;
  name: string;
  description: string;
  interviewParams: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
}

interface InterviewFormValues {
  positionType: string;
  difficulty: string;
  questionCount: number;
  duration: number;
  specificTopics?: string[];
  includeCodeExercise?: boolean;
  interviewerStyle?: string;
  interviewMode?: string;
  industryFocus?: string;
  companySize?: string;
  customPrompt?: string;
  includeBehavioralQuestions?: boolean;
  includeStressTest?: boolean;
  presetId?: number;
}

export default function ManualSetupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [positionTypes, setPositionTypes] = useState<PositionType[]>([]);

  const [presets, setPresets] = useState<InterviewPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<InterviewPreset | null>(
    null,
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [positionTypesResponse, presetsResponse, userProfileResponse] =
          await Promise.all([
            interviewAPI.getPositionTypes(),
            interviewAPI.getInterviewPresets(),
            authAPI.getUserProfile(),
          ]);

        setPositionTypes(positionTypesResponse.data || []);
        setPresets(presetsResponse.data?.presets || []);
        setUser(userProfileResponse.data || null);
      } catch (error) {
        console.error("获取初始数据失败:", error);
        messageApi.error("获取数据失败，请稍后重试");

        setPositionTypes([]);
        setPresets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [messageApi]);

  const handleSelectPreset = async (preset: InterviewPreset) => {
    try {
      setSelectedPreset(preset);

      const { interviewParams } = preset;

      const paramsMapping: Record<string, string> = {
        position_type: "positionType",
        difficulty: "difficulty",
        question_count: "questionCount",
        include_code_exercise: "includeCodeExercise",
        interviewer_style: "interviewerStyle",
        interview_mode: "interviewMode",
        industry_focus: "industryFocus",
        company_size: "companySize",
        include_behavioral_questions: "includeBehavioralQuestions",
        include_stress_test: "includeStressTest",
      };

      const formValues: Partial<InterviewFormValues> = {
        presetId: preset.id,
      };

      Object.entries(interviewParams).forEach(([key, value]) => {
        const frontendKey = paramsMapping[key];
        if (frontendKey) {
          formValues[frontendKey as keyof InterviewFormValues] = value as any;
        }
      });

      form.setFieldsValue(formValues);
    } catch (error) {
      console.error("选择预设场景失败:", error);
      messageApi.error("选择预设场景失败");
    }
  };

  const handleSubmit = async (values: InterviewFormValues) => {
    if (currentStep !== 3) {
      messageApi.warning("请完成所有必要设置后再开始面试");
      return;
    }

    try {
      setLoading(true);

      const response = await interviewAPI.startInterview(values);

      const sessionId = response.data.sessionId;
      const firstQuestion = response.data.question;

      messageApi.success("面试会话已创建，即将开始面试");

      dispatch(
        setInitials({
          initialQuestion: firstQuestion,
          questionCount: values.questionCount,
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

  const handleNextStep = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setCurrentStep((prev) => prev + 1);
  }, []);

  const handleCheckAssignedPresets = () => {
    router.push("/setup/assigned");
  };

  return (
    <div style={{ paddingBottom: "32px" }}>
      <InterviewBreadcrumb currentStep="setup" />
      <Title level={2} className="text-center">
        <RocketOutlined /> 设置你的模拟面试
      </Title>
      <Paragraph className="text-center">
        选择你希望模拟的面试类型和难度，我们将为你创建个性化的面试体验
      </Paragraph>

      <Card style={{ maxWidth: "800px", margin: "0 auto", marginTop: "32px" }}>
        <Spin spinning={loading}>
          <Alert
            title="手动配置面试"
            description="您可以自由配置面试参数，或者查看是否有招聘官为您分配的预设场景"
            type="info"
            showIcon
            action={
              <Button size="small" onClick={handleCheckAssignedPresets}>
                查看分配预设
              </Button>
            }
            style={{ marginBottom: 40 }}
          />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              difficulty: "中级",
              questionCount: 2,
            }}
            onFinish={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentStep !== 3) {
                e.preventDefault();
              }
            }}
          >
            <Steps
              current={currentStep}
              items={[
                {
                  title: "上传简历",
                  content: "可选，个性化面试",
                  onClick: () => setCurrentStep(0),
                  style: { cursor: "pointer" },
                },
                {
                  title: "选择预设场景",
                  content: "快速开始面试",
                  onClick: () => setCurrentStep(1),
                  style: { cursor: "pointer" },
                },
                {
                  title: "可选设置",
                  content: "细致化面试体验",
                  disabled: !selectedPreset,
                  onClick: () => selectedPreset && setCurrentStep(2),
                  style: { cursor: selectedPreset ? "pointer" : undefined },
                },
                {
                  title: "必要设置",
                  content: "职位和难度",
                  disabled: !selectedPreset,
                  onClick: () => selectedPreset && setCurrentStep(3),
                  style: { cursor: selectedPreset ? "pointer" : undefined },
                },
              ]}
            />
            <div
              style={{
                minHeight: "300px",
                paddingTop: "26px",
                paddingBottom: "14px",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <Alert
                  title="上传您的简历，系统将基于简历内容为您量身定制面试问题"
                  description="简历上传是可选的，您可以稍后在个人资料中上传简历"
                  style={{ marginBottom: 16 }}
                  type="info"
                  banner
                  showIcon={false}
                />

                <ResumeUpload style={{ marginBottom: 16 }} user={user} />
              </div>
              <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                <Paragraph>选择一个预设的面试场景，快速开始面试</Paragraph>
                {presets.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin spinning={loading} />
                    {!loading && <p>暂无可用预设场景</p>}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {presets
                      .filter((p) => p.creatorId === 1)
                      .map((preset) => (
                        <Card
                          key={preset.id}
                          style={{
                            marginBottom: "4px",
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
                          onClick={() => handleSelectPreset(preset)}
                          title={preset.name}
                          extra={
                            <Tooltip title="应用此预设场景，并转到下一步">
                              <Button
                                size="small"
                                type="link"
                                icon={
                                  <RightOutlined
                                    style={{ color: token.colorPrimary }}
                                  />
                                }
                                onClick={async (e) => {
                                  await handleSelectPreset(preset);
                                  await handleNextStep(e);
                                }}
                              />
                            </Tooltip>
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
                )}
              </div>
              <div style={{ display: currentStep === 2 ? "block" : "none" }}>
                <Form.Item label="面试模式" name="interviewMode">
                  <Select placeholder="选择面试模式">
                    <Option value="标准">标准面试</Option>
                    <Option value="结对编程">结对编程</Option>
                    <Option value="系统设计">系统设计</Option>
                    <Option value="算法挑战">算法挑战</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="面试官风格"
                  name="interviewerStyle"
                  rules={[{ message: "请选择面试官风格" }]}
                >
                  <Radio.Group>
                    <Radio.Button value="专业型">专业型</Radio.Button>
                    <Radio.Button value="友好型">友好型</Radio.Button>
                    <Radio.Button value="挑战型">挑战型</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="行业焦点" name="industryFocus">
                  <Select placeholder="选择行业焦点">
                    <Option value="">无</Option>
                    <Option value="人工智能">人工智能</Option>
                    <Option value="大数据">大数据</Option>
                    <Option value="物联网">物联网</Option>
                    <Option value="智能系统">智能系统</Option>
                    <Option value="互联网">互联网</Option>
                    <Option value="金融">金融</Option>
                    <Option value="医疗">医疗</Option>
                    <Option value="教育">教育</Option>
                    <Option value="零售">零售</Option>
                    <Option value="制造业">制造业</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="公司规模" name="companySize">
                  <Select placeholder="选择公司规模">
                    <Option value="创业公司">创业公司</Option>
                    <Option value="中型公司">中型公司</Option>
                    <Option value="大型企业">大型企业</Option>
                    <Option value="跨国公司">跨国公司</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="包含代码练习"
                  name="includeCodeExercise"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label="包含行为问题"
                  name="includeBehavioralQuestions"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label="包含压力测试"
                  name="includeStressTest"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>
              <div style={{ display: currentStep === 3 ? "block" : "none" }}>
                <Form.Item
                  label="选择职位类型"
                  name="positionType"
                  rules={[{ required: true, message: "请选择职位类型" }]}
                >
                  <Select placeholder="选择你要模拟的职位">
                    {positionTypes.map((pos) => (
                      <Option
                        key={pos.value}
                        value={pos.label}
                      >
                        {pos.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="选择面试难度"
                  name="difficulty"
                  rules={[{ required: true, message: "请选择面试难度" }]}
                >
                  <Radio.Group>
                    <Radio.Button value="初级">初级</Radio.Button>
                    <Radio.Button value="中级">中级</Radio.Button>
                    <Radio.Button value="高级">高级</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="问题数量"
                  name="questionCount"
                  rules={[{ required: true, message: "请设置问题数量" }]}
                >
                  <Slider
                    min={1}
                    max={5}
                    marks={{
                      1: "1",
                      2: "2",
                      3: "3",
                      4: "4",
                      5: "5",
                    }}
                    tooltip={{ formatter: (value) => `${value}个问题` }}
                    style={{ width: "40%" }}
                  />
                </Form.Item>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {currentStep > 0 && (
                <Button
                  htmlType="button"
                  style={{ marginRight: "8px" }}
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  上一步
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="primary"
                  htmlType="button" 
                  style={{ marginLeft: "auto" }}
                  onClick={(e) => handleNextStep(e)}
                  disabled={
                    currentStep === 1 && !selectedPreset
                  }
                >
                  {currentStep === 0 ? "继续" : "下一步"}
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  设置完成
                </Button>
              )}
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
