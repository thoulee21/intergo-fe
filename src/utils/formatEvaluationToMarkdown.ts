import type { Evaluation } from "@/types/answer-evaluation";

const formatEvaluationToMarkdown = (evaluation: Evaluation) => {
  try {
    let markdown = `## 评分：${evaluation.score}/10\n\n`;

    if (evaluation.strengths && Array.isArray(evaluation.strengths)) {
      markdown += "### 优势\n";
      evaluation.strengths.forEach((strength: string) => {
        markdown += `* ${strength}\n`;
      });
    }

    if (evaluation.weaknesses && Array.isArray(evaluation.weaknesses)) {
      markdown += "### 需要改进\n";
      evaluation.weaknesses.forEach((weakness: string) => {
        markdown += `* ${weakness}\n`;
      });
      markdown += "\n";
    }

    if (evaluation.suggestions) {
      markdown += "### 改进建议\n";
      const suggestions = evaluation.suggestions.split("；");

      if (suggestions.length > 0) {
        suggestions.forEach((suggestion: string) => {
          markdown += `${suggestion}\n`;
        });
        markdown += "\n";
      } else {
        markdown += evaluation.suggestions + "\n\n";
      }
    }

    if (evaluation.feedback) {
      markdown += "### 总体评价\n";
      markdown += evaluation.feedback;
    }

    return markdown;
  } catch (error) {
    console.warn("评估结果解析失败:", error);
    return "";
  }
};

export default formatEvaluationToMarkdown;
