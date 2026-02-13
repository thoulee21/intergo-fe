import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "用户登录",
  description: "登录智能模拟面试系统，开始你的面试准备之旅",
  keywords: ["用户登录", "登录", "智能面试系统", "面试准备"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(120deg, #1890ff 0%, #10239e 100%)",
      }}
    >
      {children}
    </div>
  );
}
