"use client";

import InterviewProgressTabs from "@/components/analysis/InterviewProgressTabs";
import interviewAPI from "@/services/api";
import type { InterviewProgressItem } from "@/types/interview-progress";
import { Alert } from "antd";
import { useEffect, useState } from "react";

export default function ProgressAnalysisPage() {
  const [progressData, setProgressData] = useState<InterviewProgressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await interviewAPI.getUserInterviewProgress();
        setProgressData(response.data.progress);
      } catch (err) {
        console.error("获取面试进度数据失败:", err);
        setError("获取面试进度数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <div>
      <Alert
        description="通过分析您的多次面试表现，系统能够识别您的优势和进步空间，帮助您更有针对性地提升面试技能。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <InterviewProgressTabs
        error={error}
        loading={loading}
        progressData={progressData}
      />
    </div>
  );
}
