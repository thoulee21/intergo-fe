"use client";

import interviewAPI from "@/services/api";
import type { LearningPath } from "@/types/learning-path";
import {
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
} from "antd";
import type { SorterResult } from "antd/es/table/interface";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const { Option } = Select;

interface UserOption {
  label: string;
  value: number;
}

export default function LearningPathsPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<keyof LearningPath>("id");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | undefined>(
    "descend",
  );
  const [userFilter, setUserFilter] = useState<number | "all">("all");
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);

  const fetchLearningPaths = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getAllLearningPaths();
      const paths: LearningPath[] = response.data.paths || [];

      setLearningPaths(paths);

      const users: UserOption[] = Array.from(
        new Set(paths.map((path) => path.userId)),
      ).map((userId) => {
        const user = paths.find((path) => path.userId === userId);
        return {
          label: user?.username || `用户${userId}`,
          value: userId as number,
        };
      });

      setUserOptions(users);

      setFilteredPaths(paths);
    } catch (error) {
      console.error("获取学习路径列表失败:", error);
      message.error("获取学习路径列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLearningPaths();
  }, [fetchLearningPaths]);

  const applyFilters = useCallback(() => {
    let filtered = [...learningPaths];

    if (userFilter !== "all") {
      filtered = filtered.filter((path) => path.userId === userFilter);
    }

    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(
        (path) =>
          path.title?.toLowerCase().includes(lowerSearchText) ||
          path.description?.toLowerCase().includes(lowerSearchText) ||
          path.username?.toLowerCase().includes(lowerSearchText) ||
          String(path.id).includes(lowerSearchText),
      );
    }

    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
        if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

        if (fieldA < fieldB) return sortOrder === "ascend" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === "ascend" ? 1 : -1;
        return 0;
      });
    }

    setFilteredPaths(filtered);
  }, [learningPaths, searchText, userFilter, sortField, sortOrder]);

  useEffect(() => {
    applyFilters();
  }, [
    searchText,
    userFilter,
    sortField,
    sortOrder,
    learningPaths,
    applyFilters,
  ]);

  const handleDelete = async (id: number) => {
    try {
      await interviewAPI.deleteLearningPath(id);
      message.success("学习路径已成功删除");
      fetchLearningPaths();
    } catch (error) {
      console.error("删除学习路径失败:", error);
      message.error("删除学习路径失败");
    }
  };

  const handleTableChange: TableProps<LearningPath>["onChange"] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    const typedSorter = sorter as SorterResult<LearningPath>;
    if (typedSorter.order) {
      setSortField(typedSorter.field as keyof LearningPath);
      setSortOrder(typedSorter.order);
    } else {
      setSortField("id");
      setSortOrder("descend");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleUserFilterChange = (value: number | "all") => {
    setUserFilter(value);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: true,
      sortOrder: sortField === "id" ? sortOrder : undefined,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      sorter: true,
      sortOrder: sortField === "title" ? sortOrder : undefined,
      render: (text: string, record: LearningPath) => (
        <Link href={`/admin/learning-paths/${record.id}`}>
          <Tag color="green">{text}</Tag>
        </Link>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 500,
      ellipsis: true,
    },
    {
      title: "用户",
      dataIndex: "username",
      key: "username",
      sorter: true,
      sortOrder: sortField === "username" ? sortOrder : undefined,
      render: (text: string, record: LearningPath) => (
        <Link href={`/admin/users/${record.userId}`}>
          <Tag color="blue">{text}</Tag>
        </Link>
      ),
      filters: userOptions.map((user) => ({
        text: user.label,
        value: user.value,
      })),
      filteredValue: userFilter !== "all" ? [userFilter] : null,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      sortOrder: sortField === "createdAt" ? sortOrder : undefined,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: LearningPath) => (
        <Popconfirm
          title="确定要删除这个学习路径吗?"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space wrap>
          <Input.Search
            placeholder="搜索标题、描述或用户名"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="按用户筛选"
            style={{ width: 150 }}
            onChange={handleUserFilterChange}
            value={userFilter}
            allowClear
            onClear={() => setUserFilter("all")}
          >
            <Option value="all">所有用户</Option>
            {userOptions.map((user) => (
              <Option key={user.value} value={user.value}>
                {user.label}
              </Option>
            ))}
          </Select>
        </Space>

        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchLearningPaths}
            loading={loading}
          >
            刷新数据
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPaths}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </Card>
  );
}
