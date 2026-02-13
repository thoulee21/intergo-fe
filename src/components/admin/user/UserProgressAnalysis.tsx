"use client";

import InterviewProgressTabs from "@/components/analysis/InterviewProgressTabs";
import { interviewAPI } from "@/services/api";
import type { InterviewProgressItem } from "@/types/interview-progress";
import React, { useEffect, useState } from "react";

interface UserProgressAnalysisProps {
  userId: string;
}

const UserProgressAnalysis: React.FC<UserProgressAnalysisProps> = ({
  userId,
}) => {
  const [progressData, setProgressData] = useState<InterviewProgressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await interviewAPI.getUserInterviewProgressAdmin(userId);
        setProgressData(response.data.progress);
      } catch (err) {
        console.error("获取用户面试进度数据失败:", err);
        setError("获取面试进度数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProgressData();
    }
  }, [userId]);

  return (
    <InterviewProgressTabs
      error={error}
      loading={loading}
      progressData={progressData}
    />
  );
};

export default UserProgressAnalysis;
