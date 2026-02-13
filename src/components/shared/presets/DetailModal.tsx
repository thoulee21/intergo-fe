import type { InterviewPreset } from "@/types/presets";
import { Button, Descriptions, Modal, Table } from "antd";

interface DetailModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  editingPreset: InterviewPreset | null;
  title?: string;
}

export default function DetailModal({
  modalVisible,
  closeModal,
  editingPreset,
  title = "预设场景详情",
}: DetailModalProps) {
  return (
    <Modal
      title={title}
      open={modalVisible}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal}>
          关闭
        </Button>,
      ]}
      width={700}
    >
      {editingPreset && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="名称">
            {editingPreset.name}
          </Descriptions.Item>
          <Descriptions.Item label="ID">{editingPreset.id}</Descriptions.Item>
          <Descriptions.Item label="描述">
            {editingPreset.description}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(editingPreset.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(editingPreset.updatedAt).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="面试参数">
            <Table
              size="middle"
              bordered={false}
              pagination={false}
              showHeader={false}
              dataSource={[
                {
                  key: "interview_mode",
                  label: "面试模式",
                  value: editingPreset.interviewParams.interview_mode,
                },
                {
                  key: "interviewer_style",
                  label: "面试官风格",
                  value: editingPreset.interviewParams.interviewer_style,
                },
                {
                  key: "industry_focus",
                  label: "行业焦点",
                  value: editingPreset.interviewParams.industry_focus,
                },
                {
                  key: "company_size",
                  label: "公司规模",
                  value: editingPreset.interviewParams.company_size,
                },
                {
                  key: "include_code_exercise",
                  label: "包含代码练习",
                  value: editingPreset.interviewParams.include_code_exercise
                    ? "是"
                    : "否",
                },
                {
                  key: "include_behavioral_questions",
                  label: "包含行为问题",
                  value: editingPreset.interviewParams
                    .include_behavioral_questions
                    ? "是"
                    : "否",
                },
                {
                  key: "include_stress_test",
                  label: "包含压力测试",
                  value: editingPreset.interviewParams.include_stress_test
                    ? "是"
                    : "否",
                },
                {
                  key: "position_type",
                  label: "职位类型",
                  value: editingPreset.interviewParams.position_type,
                },
                {
                  key: "difficulty",
                  label: "面试难度",
                  value: editingPreset.interviewParams.difficulty,
                },
                {
                  key: "question_count",
                  label: "问题数量",
                  value: editingPreset.interviewParams.question_count,
                },
                {
                  key: "custom_prompt",
                  label: "自定义提示词",
                  value: editingPreset.interviewParams.custom_prompt,
                },
              ]}
              columns={[
                {
                  dataIndex: "label",
                  width: 120,
                },
                {
                  dataIndex: "value",
                },
              ]}
              rowKey="key"
              style={{ marginBottom: 0 }}
            />
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
