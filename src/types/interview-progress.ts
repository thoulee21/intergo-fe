export interface InterviewProgressItem {
  id: number;
  userId: number;
  positionType: string;
  avgOverallScore: number;
  avgContentScore: number;
  avgDeliveryScore: number;
  avgNonVerbalScore: number;
  interviewCount: number;
  firstInterviewDate: string;
  lastInterviewDate: string;
  scoreTrend: {
    date: string;
    overallScore: number;
    contentScore: number;
    deliveryScore: number;
    nonVerbalScore: number;
  }[];
  commonStrengths: { item: string; count: number }[];
  commonImprovements: { item: string; count: number }[];
}

export interface InterviewProgressCardProps {
  progress: InterviewProgressItem | null;
  loading: boolean;
}
