export default function getScoreLevel(score: number) {
  if (score >= 85) return { text: "优秀", color: "green" };
  if (score >= 70) return { text: "良好", color: "#1890ff" };
  if (score >= 60) return { text: "合格", color: "orange" };
  return { text: "需改进", color: "red" };
}
