import type { Metadata } from "next/types";
import React from "react";

export const metadata: Metadata = {
  title: "面试进步分析",
  description:
    "通过分析您的多次面试表现，系统能够识别您的优势和进步空间，帮助您更有针对性地提升面试技能。",
  keywords: ["面试进步分析", "面试表现分析", "面试技能提升", "面试反馈"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
