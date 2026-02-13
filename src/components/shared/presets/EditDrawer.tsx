import interviewAPI from "@/services/api";
import type { PositionType } from "@/types";
import type { InterviewPreset } from "@/types/presets";
import {
  Button,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  Slider,
  Space,
  Switch,
  type FormInstance,
} from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

interface EditDrawerProps {
  editingPreset: InterviewPreset | null;
  closeDrawer: () => void;
  drawerVisible: boolean;
  form: FormInstance<any>;
  handleSubmit: (values: any) => void;
  title?: string;
}

export default function EditDrawer({
  editingPreset,
  closeDrawer,
  drawerVisible,
  form,
  handleSubmit,
  title,
}: EditDrawerProps) {
  const defaultTitle = editingPreset ? "编辑预设场景" : "添加预设场景";
  const [positionTypes, setPositionTypes] = useState<PositionType[]>([]);

  useEffect(() => {
    const fetchPositionTypes = async () => {
      const types = await interviewAPI.getPositionTypes();
      setPositionTypes(types.data || []);
    };

    fetchPositionTypes();
  }, []);

  return (
    <Drawer
      title={title || defaultTitle}
      size={600}
      onClose={closeDrawer}
      open={drawerVisible}
      styles={{ body: { paddingBottom: 80 } }}
      extra={
        <Space>
          <Button onClick={closeDrawer}>取消</Button>
          <Button type="primary" onClick={() => form.submit()}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={
          editingPreset
            ? editingPreset
            : {
                interviewParams: {
                  question_count: 2,
                },
              }
        }
      >
        <Form.Item
          name="name"
          label="预设场景名称"
          rules={[{ required: true, message: "请输入预设场景名称" }]}
        >
          <Input placeholder="例如：技术深度型面试" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ message: "请输入预设场景描述" }]}
        >
          <TextArea
            placeholder="描述这个预设场景的特点和适用情况"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          label="面试模式"
          name={["interviewParams", "interview_mode"]}
        >
          <Select>
            <Option value="标准">标准面试</Option>
            <Option value="结对编程">结对编程</Option>
            <Option value="系统设计">系统设计</Option>
            <Option value="算法挑战">算法挑战</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="面试官风格"
          name={["interviewParams", "interviewer_style"]}
          rules={[{ message: "请选择面试官风格" }]}
        >
          <Radio.Group>
            <Radio.Button value="专业型">专业型</Radio.Button>
            <Radio.Button value="友好型">友好型</Radio.Button>
            <Radio.Button value="挑战型">挑战型</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="行业焦点"
          name={["interviewParams", "industry_focus"]}
        >
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

        <Form.Item label="公司规模" name={["interviewParams", "company_size"]}>
          <Select placeholder="选择公司规模">
            <Option value="创业公司">创业公司</Option>
            <Option value="中型企业">中型企业</Option>
            <Option value="大型企业">大型企业</Option>
            <Option value="跨国公司">跨国公司</Option>
          </Select>
        </Form.Item>

        <Form.Item
          valuePropName="checked"
          label="包含代码练习"
          name={["interviewParams", "include_code_exercise"]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          valuePropName="checked"
          label="包含行为问题"
          name={["interviewParams", "include_behavioral_questions"]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          valuePropName="checked"
          label="包含压力测试"
          name={["interviewParams", "include_stress_test"]}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="选择职位类型"
          name={["interviewParams", "position_type"]}
          rules={[{ required: true, message: "请选择职位类型" }]}
        >
          <Select placeholder="选择你要模拟的职位">
            {positionTypes.map((pos) => (
              <Option
                key={pos.value}
                // 传递给后端大模型的值应该用可读的标签值
                value={pos.label}
              >
                {pos.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="选择面试难度"
          name={["interviewParams", "difficulty"]}
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
          name={["interviewParams", "question_count"]}
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
            style={{ width: "25%" }}
          />
        </Form.Item>

        {/* 自定义提示词 */}
        <Form.Item
          label="自定义提示词"
          name={["interviewParams", "custom_prompt"]}
          rules={[{ message: "请输入自定义提示词" }]}
        >
          <TextArea
            placeholder="为面试官提供额外的上下文或指导"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
