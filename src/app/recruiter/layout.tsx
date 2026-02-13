"use client";

import AuthGuard from "@/components/AuthGuard";
import {
  ClockCircleOutlined,
  DashboardOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Typography } from "antd";
import { usePathname } from "next/navigation";
import React from "react";

const { Title } = Typography;

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pathMap: Record<string, { title: string; icon: React.ReactNode }> = {
    recruiter: { title: "招聘管理后台", icon: <DashboardOutlined /> },
    candidates: { title: "求职者管理", icon: <TeamOutlined /> },
    presets: { title: "预设场景管理", icon: <SettingOutlined /> },
    sessions: { title: "面试记录", icon: <ClockCircleOutlined /> },
    analysis: { title: "面试分析", icon: <ClockCircleOutlined /> },
  };

  const breadcrumbItems = [
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
        // 处理动态路由参数，如 [id] 或 [sessionId]
        let pathInfo = pathMap[item];

        // 检查是否是sessionId（通常是长度较长的UUID格式）
        const isSessionId = item.length > 20 && /^[a-f0-9-]+$/i.test(item);
        let displayTitle = item;

        // 如果是数字 ID，使用上级路径的信息
        if (/^\d+$/.test(item)) {
          const parentPath = arr[index - 1];
          if (parentPath === "candidates") {
            pathInfo = { title: "求职者详情", icon: <TeamOutlined /> };
          } else if (parentPath === "sessions") {
            pathInfo = { title: "面试详情", icon: <ClockCircleOutlined /> };
          }
        }
        // 如果是sessionId，只显示前8位
        else if (isSessionId) {
          displayTitle = item.substring(0, 8);
          const parentPath = arr[index - 1];
          if (parentPath === "sessions") {
            pathInfo = { title: "面试详情", icon: <ClockCircleOutlined /> };
          }
        }

        // 如果没有找到映射，使用默认值
        if (!pathInfo) {
          pathInfo = {
            title: displayTitle,
            icon: null,
          };
        }

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
          href: `/${arr.slice(0, index + 1).join("/")}`,
        };
      }),
  ];

  // 根据面包屑生成页面标题
  const generatePageTitle = () => {
    const pathSegments = pathname.split("/").filter((item) => item);

    if (pathSegments.length === 0) {
      return { title: "首页", icon: <HomeOutlined /> };
    }

    // 获取最后一级路径作为主标题
    const lastSegment = pathSegments[pathSegments.length - 1];

    // 处理动态路由
    if (/^\d+$/.test(lastSegment)) {
      const parentSegment = pathSegments[pathSegments.length - 2];
      if (parentSegment === "candidates") {
        return { title: "求职者详情", icon: <TeamOutlined /> };
      } else if (parentSegment === "sessions") {
        return { title: "面试详情", icon: <ClockCircleOutlined /> };
      }
    }

    // 处理sessionId（UUID格式）
    if (lastSegment.length > 20 && /^[a-f0-9-]+$/i.test(lastSegment)) {
      const parentSegment = pathSegments[pathSegments.length - 2];
      if (parentSegment === "sessions") {
        return { title: "面试详情", icon: <ClockCircleOutlined /> };
      }
    }

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

    // 默认返回招聘管理后台
    return { title: "招聘管理后台", icon: <DashboardOutlined /> };
  };

  const currentPageInfo = generatePageTitle();

  return (
    <AuthGuard requireRecruiter>
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        {currentPageInfo.title !== "招聘管理后台" &&
          currentPageInfo.title !== "面试记录" &&
          currentPageInfo.title !== "求职者详情" && (
            <div style={{ padding: "0 26px", paddingTop: "80px" }}>
              <Breadcrumb
                style={{ marginBottom: 24 }}
                items={breadcrumbItems}
              />

              <Title level={2} style={{ marginBottom: 24 }}>
                {currentPageInfo.icon}
                <span style={{ marginLeft: 8 }}>{currentPageInfo.title}</span>
              </Title>
            </div>
          )}

        {children}
      </div>
    </AuthGuard>
  );
}
