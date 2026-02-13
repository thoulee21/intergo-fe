"use client";

import DetailModal from "@/components/admin/position-types/DetailModal";
import EditDrawer from "@/components/admin/position-types/EditDrawer";
import { interviewAPI } from "@/services/api";
import type { PositionType } from "@/types";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
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
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

const { Text } = Typography;
const { useApp } = App;

export default function PositionTypesPage() {
  const [form] = Form.useForm();
  const { message: messageApi, modal } = useApp();
  const { confirm } = modal;

  const [positionTypes, setPositionTypes] = useState<PositionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [editingPositionType, setEditingPositionType] =
    useState<PositionType | null>(null);

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPositionTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getAdminPositionTypes();
      const allPositionTypes = response.data || [];

      let filteredPositionTypes = allPositionTypes;
      if (searchText) {
        filteredPositionTypes = allPositionTypes.filter(
          (positionType: PositionType) =>
            positionType.value
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            positionType.label
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (positionType.description || "")
              .toLowerCase()
              .includes(searchText.toLowerCase()),
        );
      }

      setPagination((prev) => ({
        ...prev,
        total: filteredPositionTypes.length,
      }));

      setPositionTypes(filteredPositionTypes);
    } catch (error) {
      console.error("获取职位类型失败:", error);
      messageApi.error("获取职位类型失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [messageApi, searchText]);

  useEffect(() => {
    fetchPositionTypes();
  }, [fetchPositionTypes]);

  const showAddDrawer = () => {
    setEditingPositionType(null);
    form.resetFields();
    form.setFieldsValue({
      value: "",
      label: "",
      description: "",
    });
    setDrawerVisible(true);
  };

  const showEditDrawer = useCallback(
    (positionType: PositionType) => {
      setEditingPositionType(positionType);

      form.setFieldsValue({
        value: positionType.value,
        label: positionType.label,
        description: positionType.description,
      });

      setDrawerVisible(true);
    },
    [form],
  );

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const showDetailModal = (positionType: PositionType) => {
    setEditingPositionType(positionType);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        value: values.value,
        label: values.label,
        description: values.description,
      };

      if (editingPositionType) {
        await interviewAPI.updatePositionType(
          editingPositionType.id.toString(),
          payload,
        );
        messageApi.success("职位类型更新成功");
      } else {
        await interviewAPI.createPositionType(payload);
        messageApi.success("职位类型创建成功");
      }

      fetchPositionTypes();

      closeDrawer();
    } catch (error: unknown) {
      if (
        (error as { response?: { status?: number } }).response?.status === 409
      ) {
        messageApi.error("已存在相同编码的职位类型");
      } else {
        console.error("操作职位类型失败:", error);
        messageApi.error(
          editingPositionType ? "更新职位类型失败" : "创建职位类型失败",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(
    async (positionTypeId: number) => {
      try {
        setLoading(true);
        await interviewAPI.deletePositionType(positionTypeId.toString());
        messageApi.success("职位类型删除成功");
        fetchPositionTypes();
      } catch (error: unknown) {
        type ErrorResponse = {
          response?: { status?: number; data?: { usageCount?: number } };
        };

        if ((error as ErrorResponse).response?.status === 409) {
          const usageCount =
            (error as ErrorResponse).response?.data?.usageCount || 0;
          confirm({
            title: "无法删除职位类型",
            icon: <ExclamationCircleOutlined />,
            content: `该职位类型已被 ${usageCount} 个面试会话使用，无法删除。`,
            okText: "知道了",
            cancelText: null,
            okButtonProps: { type: "primary" },
          });
        } else {
          console.error("删除职位类型失败:", error);
          messageApi.error("删除职位类型失败");
        }
      } finally {
        setLoading(false);
      }
    },
    [confirm, fetchPositionTypes, messageApi],
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
      const sortedPositionTypes = [...positionTypes].sort((a, b) => {
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

      setPositionTypes(sortedPositionTypes);
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
        title: "职位编码",
        dataIndex: "value",
        key: "value",
        sorter: true,
        render: (text: string, record: PositionType) => (
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
        title: "职位名称",
        dataIndex: "label",
        key: "label",
        sorter: true,
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        sorter: true,
        render: (text: string) => (
          <Text ellipsis={{ tooltip: text }}>{text || "-"}</Text>
        ),
      },
      {
        title: "使用次数",
        dataIndex: "usageCount",
        key: "usageCount",
        sorter: true,
        render: (text: number) => text || 0,
      },
      {
        title: "操作",
        key: "action",
        render: (_text: string, record: PositionType) => (
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
              title="确定要删除这个职位类型吗？"
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
            placeholder="搜索职位类型"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />

          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchPositionTypes}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddDrawer}
            >
              添加职位类型
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={positionTypes}
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

      {}
      <EditDrawer
        editingPositionType={editingPositionType}
        closeDrawer={closeDrawer}
        drawerVisible={drawerVisible}
        form={form}
        handleSubmit={handleSubmit}
      />

      {}
      <DetailModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        editingPositionType={editingPositionType}
      />
    </div>
  );
}
