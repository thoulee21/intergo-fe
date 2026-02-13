"use client";

import { interviewAPI } from "@/services/api";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InterviewSetupPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAssignedPresets = async () => {
      try {
        const response = await interviewAPI.getAssignedPresets();
        const assignedPresets = response.data?.assigned_presets || [];

        if (assignedPresets.length > 0) {
          router.replace("/setup/assigned");
        } else {
          router.replace("/setup/manual");
        }
      } catch (error) {
        console.error("检查分配预设失败:", error);
        router.replace("/setup/manual");
      }
    };

    checkAssignedPresets();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Spin size="large" />
      <span style={{ marginLeft: 16 }}>正在检查面试设置...</span>
    </div>
  );
}
