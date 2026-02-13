"use client";

import MultimodalAnalysis from "@/components/analysis";
import CoreCompetencyRadar from "@/components/results/CoreCompetencyRadar";
import ExportReport from "@/components/results/ExportReport";
import OverallScoresCard from "@/components/results/OverallScoresCard";
import QuestionEvaluations from "@/components/results/QuestionEvaluations";
import StrengthsImprovements from "@/components/results/StrengthsImprovements";
import interviewAPI from "@/services/api";
import type { InterviewResults } from "@/types/results";
import getScoreLevel from "@/utils/getScoreLevel";
import { FileTextOutlined } from "@ant-design/icons";
import { Button, Card, Progress, Result, Spin, Typography } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const { Paragraph, Title } = Typography;

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await interviewAPI.getInterviewResults(sessionId);
        const resultData = response.data;

        setResults(resultData);
      } catch (e) {
        setError(e);
        console.error("获取面试结果失败:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>正在加载面试评估结果...</p>
      </div>
    );
  }

  if (error && (error as any)?.status === 403) {
    return (
      <Result
        status="403"
        title="无权限访问"
        subTitle="您没有权限查看该面试结果，请联系管理员或尝试其他操作。"
        style={{ textAlign: "center", marginTop: "20vh" }}
        extra={
          <Button type="primary" href="/">
            返回首页
          </Button>
        }
      />
    );
  }

  if (!results) {
    return (
      <Result
        status="404"
        title="未找到面试结果"
        subTitle="该会话可能不存在或已被删除，请尝试创建新的面试"
        style={{ textAlign: "center", marginTop: "20vh" }}
        extra={
          <Button type="primary" href="/">
            返回首页
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <OverallScoresCard results={results} />
      <Card
        title={
          <span>
            <FileTextOutlined style={{ marginRight: "8px" }} />
            面试评估报告
          </span>
        }
        style={{
          margin: "24px auto",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          maxWidth: "1200px",
        }}
        extra={<ExportReport sessionId={sessionId} />}
      >
        <CoreCompetencyRadar
          coreCompetencyIndicators={results.coreCompetencyIndicators}
        />
        {results.resumeAnalysis.analysis && results.resumeAnalysis.score && (
          <Card title="简历分析" style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ marginRight: 16 }}>匹配度评分：</span>
              <Progress
                type="circle"
                percent={results.resumeAnalysis.score}
                size={80}
                format={(percent) => `${percent}分`}
                strokeColor={getScoreLevel(results.resumeAnalysis.score).color}
              />
            </div>
            <Title level={5}>分析详情：</Title>
            <Paragraph>{results.resumeAnalysis.analysis}</Paragraph>
          </Card>
        )}
        <StrengthsImprovements results={results} />
        <QuestionEvaluations results={results} />
        <MultimodalAnalysis
          record={{
            videoAnalysis: results.videoAnalysis,
            audioAnalysis: results.audioAnalysis,
          }}
        />
        <Card title="改进建议" style={{ marginBottom: 24 }}>
          <Paragraph>{results.recommendations}</Paragraph>
        </Card>
      </Card>
    </div>
  );
}
