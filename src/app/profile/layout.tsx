"use client";

import AuthGuard from "@/components/AuthGuard";
import {
  BookOutlined,
  FundViewOutlined,
  HomeOutlined,
  LineChartOutlined,
  RocketOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const { Title } = Typography;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pathMap: Record<string, { title: string; icon: React.ReactNode }> = {
    profile: { title: "个人资料", icon: <UserOutlined /> },
    "learning-paths": { title: "学习路径", icon: <BookOutlined /> },
    progress: { title: "进步分析", icon: <LineChartOutlined /> },
    new: { title: "创建学习路径", icon: <RocketOutlined /> },
  };

  const breadcrumbItems = [
    {
      key: "home",
      title: (
        <Link href="/">
          <HomeOutlined style={{ marginRight: 8 }} />
          首页
        </Link>
      ),
    },
    ...pathname
      .split("/")
      .filter((item) => item)
      .map((item, index, arr) => {
        const pathInfo = pathMap[item] || {
          title: item,
          icon: null,
        };

        const href = `/${arr.slice(0, index + 1).join("/")}`;
        const isLast = index === arr.length - 1;
        const isDetailPage = /^\d+$/.test(item); // 检查是否为数字ID（详情页）

        return {
          key: item,
          title:
            isLast && !isDetailPage ? (
              <span>
                {pathInfo.icon && (
                  <span style={{ marginRight: 8 }}>{pathInfo.icon}</span>
                )}
                {isDetailPage ? "详情" : pathInfo.title}
              </span>
            ) : (
              <Link href={href}>
                <span style={{ marginRight: 8 }}>
                  {isDetailPage ? <FundViewOutlined /> : pathInfo.icon}
                </span>
                {isDetailPage ? "详情" : pathInfo.title}
              </Link>
            ),
        };
      }),
  ];

  // 根据面包屑生成页面标题
  const generatePageTitle = () => {
    const pathSegments = pathname.split("/").filter((item) => item);

    // 如果路径为空，返回首页信息
    if (pathSegments.length === 0) {
      return { title: "首页", icon: <HomeOutlined /> };
    }

    // 获取最后一级路径作为主标题
    const lastSegment = pathSegments[pathSegments.length - 1];

    // 忽略/new
    if (lastSegment === "new") {
      return null;
    }

    // 处理数字ID（详情页）
    if (/^\d+$/.test(lastSegment)) {
      // 使用倒数第二级作为标题
      const secondLastSegment = pathSegments[pathSegments.length - 2];
      const titleInfo = pathMap[secondLastSegment];
      if (titleInfo) {
        return { title: `${titleInfo.title}详情`, icon: <FundViewOutlined /> };
      }
      return { title: "详情", icon: <FundViewOutlined /> };
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

    // 默认返回个人资料
    return { title: "个人资料", icon: <UserOutlined /> };
  };

  const currentPageInfo = generatePageTitle();

  return (
    <AuthGuard>
      <div
        style={{
          padding: "80px 26px",
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "48px",
        }}
      >
        <Breadcrumb style={{ marginBottom: 24 }} items={breadcrumbItems} />

        <Title level={2} style={{ marginBottom: 24 }}>
          {currentPageInfo?.icon}
          <span style={{ marginLeft: 8 }}>{currentPageInfo?.title}</span>
        </Title>

        {children}
      </div>
    </AuthGuard>
  );
}
