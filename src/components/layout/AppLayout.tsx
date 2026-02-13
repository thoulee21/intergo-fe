"use client";

import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import { useSettings } from "@/hooks/useSettings";
import { ReduxProvider } from "@/redux/provider";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider, Layout, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import React, { useCallback } from "react";
import "dayjs/locale/zh-cn";

const { Content } = Layout;

function AppLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCompactMode, isDarkMode, actualFontSize, primaryColor } =
    useSettings();

  const getThemeAlgorithm = useCallback(() => {
    const algorithms = [];

    if (isCompactMode) {
      algorithms.push(theme.compactAlgorithm);
    } else {
      algorithms.push(theme.defaultAlgorithm);
    }

    if (isDarkMode) {
      algorithms.push(theme.darkAlgorithm);
    }

    return algorithms;
  }, [isCompactMode, isDarkMode]);

  const getFontSize = useCallback(() => {
    switch (actualFontSize) {
      case "small":
        return 12;
      case "large":
        return 16;
      case "medium":
      default:
        return 14;
    }
  }, [actualFontSize]);

  return (
    <AntdRegistry>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: getThemeAlgorithm(),
          token: {
            fontSize: getFontSize(),
            colorPrimary: primaryColor,
          },
        }}
      >
        <App>
          <HappyProvider>
            <Layout className="layout">
              <AppHeader />
              <Content className="site-content">{children}</Content>
              <AppFooter />
            </Layout>
          </HappyProvider>
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ReduxProvider>
  );
}
