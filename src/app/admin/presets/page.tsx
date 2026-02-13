"use client";

import DetailModal from "@/components/shared/presets/DetailModal";
import EditDrawer from "@/components/shared/presets/EditDrawer";
import { interviewAPI } from "@/services/api";
import type { InterviewPreset } from "@/types/presets";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AdminPresetsPage() {
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const [presets, setPresets] = useState<InterviewPreset[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [editingPreset, setEditingPreset] = useState<InterviewPreset | null>(
    null,
  );

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPresets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getInterviewPresets();
      const allPresets = response.data.presets || [];

      let filteredPresets = allPresets;
      if (searchText) {
        filteredPresets = allPresets.filter(
          (preset: InterviewPreset) =>
            preset.name.toLowerCase().includes(searchText.toLowerCase()) ||
            preset.description.toLowerCase().includes(searchText.toLowerCase()),
        );
      }

      setPagination((prev) => ({
        ...prev,
        total: filteredPresets.length,
      }));

      setPresets(filteredPresets);
    } catch (error) {
      console.error("获取预设场景失败:", error);
      messageApi.error("获取预设场景失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [messageApi, searchText]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const showAddDrawer = () => {
    setEditingPreset(null);
    form.resetFields();
    form.setFieldsValue({
      interviewParams: {
        difficulty: "中级",
        interviewer_style: "友好型",
        interview_mode: "标准",
        include_code_exercise: false,
        include_behavioral_questions: false,
        include_stress_test: false,
      },
    });
    setDrawerVisible(true);
  };

  const showEditDrawer = useCallback(
    (preset: InterviewPreset) => {
      setEditingPreset(preset);

      form.setFieldsValue({
        name: preset.name,
        description: preset.description,
        interviewParams: preset.interviewParams,
      });

      setDrawerVisible(true);
    },
    [form],
  );

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const showDetailModal = (preset: InterviewPreset) => {
    setEditingPreset(preset);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name,
        description: values.description,
        interviewParams: values.interviewParams,
      };

      let response;

      if (editingPreset) {
        response = await interviewAPI.updatePreset(editingPreset.id, payload);
        messageApi.success("预设场景更新成功");
      } else {
        response = await interviewAPI.createPreset(payload);
        if (response.status === 201) {
          messageApi.success("预设场景创建成功");
        } else {
          messageApi.error("预设场景创建失败，请稍后重试");
        }
      }

      fetchPresets();

      closeDrawer();
    } catch (error) {
      console.error("操作预设场景失败:", error);
      messageApi.error(editingPreset ? "更新预设场景失败" : "创建预设场景失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(
    async (presetId: number) => {
      try {
        setLoading(true);
        await interviewAPI.deletePreset(presetId);
        messageApi.success("预设场景删除成功");
        fetchPresets();
      } catch (error) {
        console.error("删除预设场景失败:", error);
        messageApi.error("删除预设场景失败");
      } finally {
        setLoading(false);
      }
    },
    [fetchPresets, messageApi],
  );

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination((prev) => ({
      ...prev,
      current: 1, 
    }));
  };

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    const { field, order } = sorter;

    if (field && order) {
      const sortedPresets = [...presets].sort((a, b) => {
        const compareA = field
          .split(".")
          .reduce((obj: any, key: string) => obj?.[key], a);
        const compareB = field
          .split(".")
          .reduce((obj: any, key: string) => obj?.[key], b);

        if (typeof compareA === "string" && typeof compareB === "string") {
          return order === "ascend"
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        }

        return order === "ascend"
          ? compareA > compareB
            ? 1
            : -1
          : compareA > compareB
            ? -1
            : 1;
      });

      setPresets(sortedPresets);
    }
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
    }));
  };

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 70,
        sorter: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (text: string, record: InterviewPreset) => (
          <Tag
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={() => showDetailModal(record)}
          >
            {text}
          </Tag>
        ),
      },
      {
        title: "创建者",
        dataIndex: "creatorId",
        key: "creatorId",
        sorter: true,
        render: (creatorId: number, record: InterviewPreset) => (
          <Link href={`/admin/users/${creatorId}`}>
            <Tag color="purple" icon={<UserOutlined />}>
              {record.creatorName}
            </Tag>
          </Link>
        ),
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        sorter: true,
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        render: (_text: string, record: InterviewPreset) => (
          <Space size="small" wrap>
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() => showEditDrawer(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个预设场景吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, showEditDrawer],
  );

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Input.Search
            placeholder="搜索预设场景"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />

          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchPresets}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddDrawer}
            >
              添加预设场景
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={presets}
            rowKey="id"
            onChange={handleTableChange}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              onChange: handlePaginationChange,
              onShowSizeChange: handleShowSizeChange,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Spin>
      </Card>

      {/* 添加/编辑预设场景抽屉 */}
      <EditDrawer
        editingPreset={editingPreset}
        closeDrawer={closeDrawer}
        drawerVisible={drawerVisible}
        form={form}
        handleSubmit={handleSubmit}
      />

      {/* 预设场景详情模态框 */}
      <DetailModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        editingPreset={editingPreset}
      />
    </div>
  );
}
