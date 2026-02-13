"use client";

import ResumeUpload from "@/components/shared/ResumeUpload";
import Header from "@/components/shared/profile/Header";
import UserRelationshipCard from "@/components/shared/profile/UserRelationshipCard";
import getStatusTag from "@/components/shared/sessions/getStatusTag";
import { authAPI } from "@/services/api";
import type { InterviewSession, UserProfile } from "@/types";
import {
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  LineChartOutlined,
  LockOutlined,
  MailOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProfilePage() {
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [invitationCodeForm] = Form.useForm();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changeInvitationCodeVisible, setChangeInvitationCodeVisible] =
    useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getUserProfile();
        setUser(response.data);
      } catch (error) {
        console.error("获取用户信息失败:", error);
        messageApi.error("获取用户信息失败");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [messageApi]);

  useEffect(() => {
    if (editMode && user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      });
    }
  }, [editMode, user, form]);

  useEffect(() => {
    const fetchUserSessions = async () => {
      try {
        setSessionLoading(true);
        const response = await authAPI.getUserSessions();
        setSessions(response.data.sessions || []);
      } catch (error) {
        console.error("获取用户面试会话失败:", error);
        messageApi.error("获取面试记录失败");
      } finally {
        setSessionLoading(false);
      }
    };

    if (user) {
      fetchUserSessions();
    }
  }, [user, messageApi]);

  const handleUpdateProfile = useCallback(
    async (values: { email: string }) => {
      try {
        await authAPI.updateProfile(values);
        messageApi.success("个人资料已更新");
        setEditMode(false);

        const response = await authAPI.getUserProfile();
        setUser(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data.error || "更新个人资料失败，请稍后重试";

        console.error("更新个人资料失败:", error);
        messageApi.error(errorMessage);
      }
    },
    [messageApi],
  );

  const handleChangePassword = useCallback(
    async (values: {
      old_password: string;
      new_password: string;
      confirm_password: string;
    }) => {
      if (values.new_password !== values.confirm_password) {
        messageApi.error("两次输入的密码不一致");
        return;
      }

      try {
        await authAPI.changePassword({
          old_password: values.old_password,
          new_password: values.new_password,
        });
        messageApi.success("密码修改成功");
        setChangePasswordVisible(false);
        passwordForm.resetFields();
      } catch (error) {
        console.error("修改密码失败:", error);
        messageApi.error("修改密码失败，请确认旧密码是否正确");
      }
    },
    [messageApi, passwordForm],
  );

  const handleChangeInvitationCode = useCallback(
    async (values: { invitation_code: string }) => {
      try {
        await authAPI.changeInvitationCode({
          invitation_code: values.invitation_code,
        });
        messageApi.success("邀请码更改成功");
        setChangeInvitationCodeVisible(false);
        invitationCodeForm.resetFields();

        const userResponse = await authAPI.getUserProfile();
        setUser(userResponse.data);
      } catch (error) {
        console.error("更改邀请码失败:", error);
        messageApi.error("更改邀请码失败，请确认邀请码是否有效");
      }
    },
    [messageApi, invitationCodeForm],
  );

  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return "未知";
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN");
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "职位类型",
        dataIndex: "position_type",
        key: "position_type",
      },
      {
        title: "难度",
        dataIndex: "difficulty",
        key: "difficulty",
      },
      {
        title: "开始时间",
        dataIndex: "start_time",
        key: "start_time",
        render: (text: string) => formatDate(text),
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (text: string) => getStatusTag(text),
      },
      {
        title: "操作",
        key: "action",
        render: (_: string, record: InterviewSession) => (
          <Space size="small">
            {record.status === "in_progress" ? (
              <Link href={`/interview/${record.session_id}`} passHref>
                <Button type="primary" size="small">
                  继续面试
                </Button>
              </Link>
            ) : (
              <Link href={`/results/${record.session_id}`} passHref>
                <Button
                  type="primary"
                  size="small"
                  disabled={record.status !== "completed"}
                >
                  查看结果
                </Button>
              </Link>
            )}
          </Space>
        ),
      },
    ],
    [formatDate],
  );

  return (
    <div>
      <Spin spinning={loading}>
        {user && (
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <Header user={user} />
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="注册日期"
                        value={formatDate(user.created_at).split(" ")[0]}
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="面试次数"
                        value={sessions.length}
                        prefix={<FileTextOutlined />}
                      />
                    </Col>
                  </Row>
                  <Divider />
                  <Button
                    danger
                    onClick={() => setChangePasswordVisible(true)}
                    style={{ width: "100%", marginBottom: 8 }}
                  >
                    <LockOutlined /> 修改密码
                  </Button>
                  {user.user_type === "candidate" && (
                    <Button
                      type="default"
                      icon={<EditOutlined />}
                      onClick={() => setChangeInvitationCodeVisible(true)}
                      style={{ width: "100%" }}
                    >
                      修改邀请码
                    </Button>
                  )}
                </div>
              </Card>

              {/* 关系信息卡片 */}
              {user && (
                <div style={{ marginTop: 16 }}>
                  <UserRelationshipCard user={user} />
                </div>
              )}
            </Col>

            <Col xs={24} md={16}>
              <Card
                title="基本信息"
                extra={
                  !editMode ? (
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                    >
                      编辑
                    </Button>
                  ) : null
                }
              >
                {!editMode ? (
                  <List itemLayout="horizontal">
                    <List.Item>
                      <List.Item.Meta
                        avatar={<UserOutlined />}
                        title="用户名"
                        description={user.username}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<MailOutlined />}
                        title="电子邮箱"
                        description={user.email || "未设置"}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<ClockCircleOutlined />}
                        title="注册时间"
                        description={formatDate(user.created_at)}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<ClockCircleOutlined />}
                        title="上次登录"
                        description={
                          user.last_login ? formatDate(user.last_login) : "未知"
                        }
                      />
                    </List.Item>
                  </List>
                ) : (
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ email: user.email }}
                    onFinish={handleUpdateProfile}
                  >
                    <Form.Item label="用户名" name="username">
                      <Input
                        prefix={<UserOutlined />}
                        value={user.username}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item
                      label="电子邮箱"
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: "请输入有效的电子邮箱",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item>
                      <Row gutter={8}>
                        <Col span={12}>
                          <Button block onClick={() => setEditMode(false)}>
                            取消
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button
                            type="primary"
                            block
                            htmlType="submit"
                            icon={<SaveOutlined />}
                          >
                            保存
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                )}
              </Card>

              <Card title="简历管理" style={{ marginTop: 24 }}>
                <ResumeUpload user={user} />
              </Card>

              <Card
                title="面试记录"
                style={{ marginTop: 24 }}
                extra={
                  <Link href="/profile/progress" passHref>
                    <Button icon={<LineChartOutlined />}>查看进步分析</Button>
                  </Link>
                }
              >
                <Table
                  columns={columns}
                  dataSource={sessions}
                  rowKey="session_id"
                  loading={sessionLoading}
                  pagination={{
                    defaultPageSize: 5,
                    hideOnSinglePage: true,
                  }}
                  locale={{ emptyText: "暂无面试记录" }}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
      <Modal
        title="修改密码"
        open={changePasswordVisible}
        footer={null}
        onCancel={() => {
          setChangePasswordVisible(false);
          passwordForm.resetFields();
        }}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="当前密码"
            name="old_password"
            rules={[{ required: true, message: "请输入当前密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="new_password"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码长度不能少于6位" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirm_password"
            rules={[
              { required: true, message: "请再次输入新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不匹配"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Button
                  block
                  onClick={() => {
                    setChangePasswordVisible(false);
                    passwordForm.resetFields();
                  }}
                >
                  取消
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block>
                  提交
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改邀请码"
        open={changeInvitationCodeVisible}
        footer={null}
        onCancel={() => {
          setChangeInvitationCodeVisible(false);
          invitationCodeForm.resetFields();
        }}
      >
        <Form
          form={invitationCodeForm}
          layout="vertical"
          onFinish={handleChangeInvitationCode}
          initialValues={{ invitation_code: user?.invitation_code }}
        >
          <Form.Item label="新邀请码" name="invitation_code">
            <Input
              prefix={<LockOutlined />}
              placeholder="请输入招聘者提供的邀请码"
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Button
                  block
                  onClick={() => {
                    setChangeInvitationCodeVisible(false);
                    invitationCodeForm.resetFields();
                  }}
                >
                  取消
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block>
                  提交
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
