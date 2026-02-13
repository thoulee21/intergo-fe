"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";

import DetailModal from "@/components/shared/presets/DetailModal";
import EditDrawer from "@/components/shared/presets/EditDrawer";
import { recruiterAPI } from "@/services/api";
import type { InterviewPreset } from "@/types/presets";

const { Text } = Typography;

export default function RecruiterPresetsPage() {
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const [presets, setPresets] = useState<InterviewPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPreset, setEditingPreset] = useState<InterviewPreset | null>(
    null,
  );

  const fetchPresets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recruiterAPI.getRecruiterPresets();
      setPresets(response.data.presets || []);
    } catch (error) {
      console.error("获取预设场景失败:", error);
      messageApi.error("获取预设场景失败");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const openDrawer = useCallback(
    (preset?: InterviewPreset) => {
      if (preset) {
        setEditingPreset(preset);
        form.setFieldsValue(preset);
      } else {
        setEditingPreset(null);
        form.resetFields();
      }
      setDrawerVisible(true);
    },
    [form],
  );

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingPreset(null);
    form.resetFields();
  };

  const openModal = (preset: InterviewPreset) => {
    setEditingPreset(preset);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPreset(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingPreset) {
        await recruiterAPI.updateRecruiterPreset(editingPreset.id, values);
        messageApi.success("预设场景更新成功！");
      } else {
        await recruiterAPI.createRecruiterPreset(values);
        messageApi.success("预设场景创建成功！");
      }
      closeDrawer();
      fetchPresets();
    } catch (error) {
      console.error("保存预设场景失败:", error);
      messageApi.error("保存预设场景失败");
    }
  };

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await recruiterAPI.deleteRecruiterPreset(id);
        messageApi.success("预设场景删除成功！");
        fetchPresets();
      } catch (error) {
        console.error("删除预设场景失败:", error);
        messageApi.error("删除预设场景失败");
      }
    },
    [fetchPresets, messageApi],
  );

  const columns: ColumnsType<InterviewPreset> = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name: string, record) => (
          <Tag
            onClick={() => openModal(record)}
            style={{ cursor: "pointer" }}
            color="blue"
          >
            {name}
          </Tag>
        ),
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
      },
      {
        title: "面试模式",
        key: "interview_mode",
        render: (record: InterviewPreset) => (
          <Tag color="blue">{record.interviewParams.interview_mode}</Tag>
        ),
      },
      {
        title: "面试官风格",
        key: "interviewer_style",
        render: (record: InterviewPreset) => (
          <Tag color="green">{record.interviewParams.interviewer_style}</Tag>
        ),
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt: string) => new Date(createdAt).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        width: 200,
        render: (_, record) => (
          <Space size="small">
            <Button
              size="small"
              icon={<EditOutlined />}
              type="primary"
              onClick={() => openDrawer(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个预设场景吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, openDrawer],
  );

  return (
    <div style={{ padding: "0 24px" }}>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        创建和管理您的自定义面试预设场景，可以分配给邀请的求职者使用。
      </Text>

      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            我创建的面试预设场景
          </Text>
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={fetchPresets}
              loading={loading}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openDrawer()}
            >
              创建预设场景
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={presets}
          rowKey="id"
          loading={loading}
          pagination={{
            total: presets.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 个预设场景`,
          }}
          locale={{
            emptyText: "暂无预设场景，点击上方按钮创建您的第一个预设场景",
          }}
        />
      </Card>

      <EditDrawer
        editingPreset={editingPreset}
        closeDrawer={closeDrawer}
        drawerVisible={drawerVisible}
        form={form}
        handleSubmit={handleSubmit}
      />

      <DetailModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        editingPreset={editingPreset}
      />
    </div>
  );
}
