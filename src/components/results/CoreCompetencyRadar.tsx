"use client";

import type { CoreCompetencyIndicator } from "@/types/results";
import getScoreLevel from "@/utils/getScoreLevel";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip as AntdTooltip, Card, Typography, theme } from "antd";
import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const { Title } = Typography;

interface CoreCompetencyRadarProps {
  coreCompetencyIndicators: CoreCompetencyIndicator;
}

const CoreCompetencyRadar: React.FC<CoreCompetencyRadarProps> = ({
  coreCompetencyIndicators,
}) => {
  const { token } = theme.useToken();

  const radarData = useMemo(
    () => [
      {
        subject: "专业知识",
        value: coreCompetencyIndicators.professionalKnowledgeLevel,
        fullMark: 100,
      },
      {
        subject: "技能匹配",
        value: coreCompetencyIndicators.skillMatchingDegree,
        fullMark: 100,
      },
      {
        subject: "语言表达",
        value: coreCompetencyIndicators.languageExpressionAbility,
        fullMark: 100,
      },
      {
        subject: "逻辑思维",
        value: coreCompetencyIndicators.logicalThinkingAbility,
        fullMark: 100,
      },
      {
        subject: "创新能力",
        value: coreCompetencyIndicators.innovationAbility,
        fullMark: 100,
      },
      {
        subject: "适应抗压",
        value: coreCompetencyIndicators.adaptabilityAndStressResistance,
        fullMark: 100,
      },
    ],
    [
      coreCompetencyIndicators.adaptabilityAndStressResistance,
      coreCompetencyIndicators.innovationAbility,
      coreCompetencyIndicators.languageExpressionAbility,
      coreCompetencyIndicators.logicalThinkingAbility,
      coreCompetencyIndicators.professionalKnowledgeLevel,
      coreCompetencyIndicators.skillMatchingDegree,
    ],
  );

  return (
    <Card
      title={
        <Title level={5} style={{ margin: 0 }}>
          核心能力评估
        </Title>
      }
      style={{ marginBottom: 24 }}
      extra={
        <AntdTooltip title="核心能力评估雷达图，展示各项能力指标的得分情况">
          <InfoCircleOutlined style={{ cursor: "pointer" }} />
        </AntdTooltip>
      }
    >
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={radarData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fontSize: 13,
                fill: token.colorTextLabel,
                fontWeight: 500,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#999" }}
              tickCount={6}
            />
            <Radar
              name="能力指标"
              dataKey="value"
              stroke="#1890ff"
              fill="#1890ff"
              fillOpacity={0.25}
              strokeWidth={2.5}
              dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: token.colorBgElevated,
                borderColor: token.colorBorder,
                borderRadius: "6px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          {radarData.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: token.colorBgElevated,
                borderRadius: "8px",
                border: `1px solid ${token.colorBorder}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: getScoreLevel(item.value).color,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
                <span style={{ color: "#666", fontSize: 14 }}>
                  {item.subject}
                </span>
              </div>
              <span
                style={{
                  fontWeight: 600,
                  color: getScoreLevel(item.value).color,
                  fontSize: 16,
                }}
              >
                {item.value}分
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CoreCompetencyRadar;
