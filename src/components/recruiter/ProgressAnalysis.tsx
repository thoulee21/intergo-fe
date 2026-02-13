"use client";

import InterviewProgressTabs from "@/components/analysis/InterviewProgressTabs";
import { recruiterAPI } from "@/services/api";
import type { InterviewProgressItem } from "@/types/interview-progress";
import { LineChartOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React, { useCallback, useEffect, useState } from "react";

interface ProgressAnalysisProps {
  userId?: string;
}

const ProgressAnalysis: React.FC<ProgressAnalysisProps> = ({ userId }) => {
  const [progressData, setProgressData] = useState<InterviewProgressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgressData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await recruiterAPI.getCandidateInterviewProgress(userId);
      setProgressData(response.data.progress);
    } catch (err) {
      console.error("获取用户面试进度数据失败:", err);
      setError("获取面试进度数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <LineChartOutlined style={{ marginRight: 8 }} />
          面试进度分析
        </div>
      }
      type="inner"
    >
      <InterviewProgressTabs
        error={error}
        loading={loading}
        progressData={progressData}
      />
    </Card>
  );
};

export default ProgressAnalysis;
