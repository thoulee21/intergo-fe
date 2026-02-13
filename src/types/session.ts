import type { UserProfile } from "@/types";
import type { Evaluation } from "./answer-evaluation";

export type QuestionType = {
  id: string;
  questionIndex: number;
  question: string;
  answer?: string | null;
  evaluation?: Evaluation;
  createdAt: string;
};

export type VideoAnalysisType = {
  eyeContact: number;
  facialExpressions: number;
  bodyLanguage: number;
  confidence: number;
  recommendations: string;
};

export type AudioAnalysisType = {
  clarity: number;
  pace: number;
  tone: number;
  fillerWordsCount: number;
  recommendations: string;
};

export type AnalysisType = {
  id: string;
  videoAnalysis?: VideoAnalysisType;
  audioAnalysis?: AudioAnalysisType;
  createdAt: string;
};

export type SessionDetailsType = {
  sessionId: string;
  positionType: string;
  difficulty: string;
  status: string;
  interviewParams: Record<string, any>;
  startTime: string | null;
  endTime: string | null;
  questions: Array<QuestionType>;
  analysis?: AnalysisType;
  userInfo: UserProfile;
};
