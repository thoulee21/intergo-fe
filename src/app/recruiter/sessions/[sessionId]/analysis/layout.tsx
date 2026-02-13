import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "面试分析",
  description: "查看和分析面试会话的详细信息",
};

export default function SessionAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "0 24px",
        paddingBottom: "36px",
      }}
    >
      {children}
    </div>
  );
}
