"use client";

import AuthGuard from "@/components/AuthGuard";
import {
  BookOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Typography } from "antd";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const { Title } = Typography;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pathMap: Record<string, { title: string; icon: React.ReactNode }> =
    useMemo(
      () => ({
        admin: { title: "管理后台", icon: <SettingOutlined /> },
        users: { title: "用户管理", icon: <UserOutlined /> },
        sessions: { title: "会话管理", icon: <FileTextOutlined /> },
        "position-types": { title: "职位管理", icon: <TeamOutlined /> },
        create: { title: "新建", icon: <EditOutlined /> },
        "learning-paths": { title: "学习路径", icon: <BookOutlined /> },
        presets: { title: "预设管理", icon: <FileTextOutlined /> },
      }),
      [],
    );

  const breadcrumbItems = useMemo(
    () => [
      {
        key: "home",
        title: (
          <span>
            <HomeOutlined style={{ marginRight: 8 }} />
            首页
          </span>
        ),
        href: "/",
      },
      ...pathname
        .split("/")
        .filter((item) => item)
        .map((item, index, arr) => {
          // 检查是否是sessionId（通常是长度较长的UUID格式）
          const isSessionId = item.length > 20 && /^[a-f0-9-]+$/i.test(item);
          const displayTitle = isSessionId ? item.substring(0, 8) : item;

          const pathInfo = pathMap[item] || {
            title: displayTitle,
            icon: null,
          };

          return {
            key: item,
            title: (
              <span>
                {pathInfo.icon && (
                  <span style={{ marginRight: 8 }}>{pathInfo.icon}</span>
                )}
                {pathInfo.title}
              </span>
            ),
            href:
              item !== "admin"
                ? `/${arr.slice(0, index + 1).join("/")}`
                : "/admin/sessions",
          };
        }),
    ],
    [pathMap, pathname],
  );

  // 根据面包屑生成页面标题
  const generatePageTitle = () => {
    const pathSegments = pathname.split("/").filter((item) => item);

    if (pathSegments.length === 0) {
      return { title: "首页", icon: <HomeOutlined /> };
    }

    // 获取最后一级路径作为主标题
    const lastSegment = pathSegments[pathSegments.length - 1];
    const titleInfo = pathMap[lastSegment];

    if (titleInfo) {
      return titleInfo;
    }

    // 如果最后一级没有匹配，使用倒数第二级
    if (pathSegments.length > 1) {
      const secondLastSegment = pathSegments[pathSegments.length - 2];
      const fallbackInfo = pathMap[secondLastSegment];
      if (fallbackInfo) {
        return fallbackInfo;
      }
    }

    // 默认返回管理后台
    return { title: "管理后台", icon: <SettingOutlined /> };
  };

  const currentPageInfo = generatePageTitle();

  return (
    <AuthGuard requireAdmin={true}>
      <div style={{ padding: "80px 26px" }}>
        <Breadcrumb style={{ marginBottom: 24 }} items={breadcrumbItems} />

        <Title level={2} style={{ marginBottom: 24 }}>
          {currentPageInfo.icon}
          <span style={{ marginLeft: 8 }}>{currentPageInfo.title}</span>
        </Title>

        {children}
      </div>
    </AuthGuard>
  );
}
