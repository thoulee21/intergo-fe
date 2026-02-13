import type { PositionType } from "@/types";
import { Descriptions, Modal } from "antd";

interface DetailModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  editingPositionType: PositionType | null;
}

export default function DetailModal({
  modalVisible,
  closeModal,
  editingPositionType,
}: DetailModalProps) {
  return (
    <Modal
      title="职位类型详情"
      open={modalVisible}
      onCancel={closeModal}
      footer={null}
      width={800}
    >
      {editingPositionType && (
        <Descriptions
          column={1}
          bordered
          size="small"
          styles={{ label: { width: "120px" } }}
        >
          <Descriptions.Item label="ID">
            {editingPositionType.id}
          </Descriptions.Item>
          <Descriptions.Item label="职位编码">
            {editingPositionType.value}
          </Descriptions.Item>
          <Descriptions.Item label="职位名称">
            {editingPositionType.label}
          </Descriptions.Item>
          <Descriptions.Item label="职位描述">
            {editingPositionType.description || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="使用次数">
            {editingPositionType.usageCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {editingPositionType.createdAt
              ? new Date(editingPositionType.createdAt).toLocaleString()
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {editingPositionType.updatedAt
              ? new Date(editingPositionType.updatedAt).toLocaleString()
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
