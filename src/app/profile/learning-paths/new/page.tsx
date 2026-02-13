"use client";

import LoadingPathAnimation from "@/components/learning-paths/LoadingPathAnimation";
import interviewAPI from "@/services/api";
import { BulbOutlined, RocketOutlined } from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Layout,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

interface PositionType {
  description?: string;
  id: number;
  label: string;
  value: string;
}

export default function NewLearningPathPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const [positionTypes, setPositionTypes] = useState<PositionType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchPositionTypes = async () => {
      try {
        const response = await interviewAPI.getPositionTypes();
        setPositionTypes(response.data || []);
      } catch (err) {
        console.error("获取职位类型失败:", err);
        messageApi.error("获取职位类型失败");
      } finally {
        setLoading(false);
      }
    };

    fetchPositionTypes();
  }, [messageApi]);

  const handleAnimationComplete = () => {
    if (showAnimation) {
      setShowAnimation(false);
      router.push("/profile/learning-paths");
    }
  };

  const handleSubmit = async (values: { positionTypes: number[] }) => {
    if (!values.positionTypes || values.positionTypes.length === 0) {
      messageApi.warning("请至少选择一个职位类型");
      return;
    }

    try {
      setSubmitting(true);
      setLoadingProgress(0);

      setShowAnimation(true);

      let apiCompleted = false;
      let progressValue = 0;

      const progressInterval = setInterval(() => {
        if (apiCompleted) {
          setLoadingProgress(100);
          clearInterval(progressInterval);
          return;
        }

        progressValue = Math.min(
          progressValue + (progressValue < 30 ? 2 : 1),
          75,
        );
        setLoadingProgress(progressValue);
      }, 300);

      const apiPromise = interviewAPI.createLearningPath({
        positionTypes: values.positionTypes,
      });

      apiPromise
        .then(() => {
          apiCompleted = true;

          messageApi.success("学习路径规划生成成功");

          setLoadingProgress(100);

          clearInterval(progressInterval);
        })
        .catch((err) => {
          clearInterval(progressInterval);
          setLoadingProgress(0);
          setShowAnimation(false);

          console.error("创建学习路径失败:", err);
          messageApi.error((err as any).response.data.error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (err) {
      console.error("提交表单时出错:", err);
      messageApi.error("提交失败，请重试");

      setShowAnimation(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <LoadingPathAnimation
        visible={showAnimation}
        progress={loadingProgress}
        onComplete={handleAnimationComplete}
      />
      <Title level={2} style={{ alignContent: "center", textAlign: "center" }}>
        <RocketOutlined style={{ marginRight: 8 }} />
        创建学习路径规划
      </Title>
      <Layout.Content style={{ maxWidth: 650, margin: "0 auto" }}>
        <Card>
          <Spin spinning={loading || submitting}>
            <Alert
              message="创建个性化学习路径"
              style={{ marginBottom: 24 }}
              description={
                <>
                  <p>
                    系统将根据你的面试历史和所选职位类型，生成个性化的学习路径规划。
                    这将帮助你明确接下来的学习方向，提升面试表现。
                  </p>
                  <p>
                    <BulbOutlined /> <Text strong>提示：</Text>{" "}
                    选择你感兴趣的职位类型，系统会生成更有针对性的规划。
                  </p>
                </>
              }
              type="info"
              showIcon
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ positionTypes: [] }}
            >
              <Form.Item
                name="positionTypes"
                label="请选择你感兴趣的职位类型"
                rules={[{ required: true, message: "请至少选择一个职位类型" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="选择职位类型"
                  optionFilterProp="children"
                  allowClear
                  showSearch
                >
                  {positionTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<RocketOutlined />}
                    loading={submitting}
                  >
                    生成学习路径规划
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Layout.Content>
    </div>
  );
}
