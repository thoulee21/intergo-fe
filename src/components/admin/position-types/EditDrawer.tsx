import type { PositionType } from "@/types";
import { Button, Drawer, Form, Input, Space, type FormInstance } from "antd";

const { TextArea } = Input;

interface EditDrawerProps {
  editingPositionType: PositionType | null;
  closeDrawer: () => void;
  drawerVisible: boolean;
  form: FormInstance<any>;
  handleSubmit: (values: any) => void;
  title?: string;
}

export default function EditDrawer({
  editingPositionType,
  closeDrawer,
  drawerVisible,
  form,
  handleSubmit,
  title,
}: EditDrawerProps) {
  const defaultTitle = editingPositionType ? "编辑职位类型" : "添加职位类型";

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
          editingPositionType
            ? editingPositionType
            : {
                value: "",
                label: "",
                description: "",
              }
        }
      >
        <Form.Item
          name="value"
          label="职位编码"
          rules={[
            { required: true, message: "请输入职位编码" },
            { max: 50, message: "职位编码不能超过50个字符" },
          ]}
        >
          <Input placeholder="请输入职位编码，如software_engineer" />
        </Form.Item>

        <Form.Item
          name="label"
          label="职位名称"
          rules={[
            { required: true, message: "请输入职位名称" },
            { max: 50, message: "职位名称不能超过50个字符" },
          ]}
        >
          <Input placeholder="请输入职位名称，如软件工程师" />
        </Form.Item>

        <Form.Item
          name="description"
          label="职位描述"
          rules={[{ max: 200, message: "职位描述不能超过200个字符" }]}
        >
          <TextArea
            placeholder="请输入职位描述"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
